// The single dispatcher every tracked interaction goes through.
//
// One call site, three destinations:
//   GA4        — gtag, always sent; Consent Mode v2 decides how Google stores it
//   Meta Pixel — only present at all once MARKETING consent is granted
//   /api/collect — our own first-party sink, only with ANALYTICS consent
//
// Events carry a shared `event_id` so the browser-side Meta Pixel hit and the
// server-side Conversions API hit for the same action collapse into one in
// Events Manager instead of double-counting.

import { EVENTS, type EventDef, type EventKey, type EventParams } from "./events";
import { attributionSummary, deriveFbc, readFbp } from "./attribution";
import { bumpSessionViews, getSession, getVisitorId } from "./identity";

type GtagFn = (...args: unknown[]) => void;
type FbqFn = ((...args: unknown[]) => void) & { loaded?: boolean };

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

const COLLECT_ENDPOINT = "/api/collect";
const FLUSH_INTERVAL_MS = 3000;
const MAX_BATCH = 25;

type QueuedEvent = {
  event: string;
  event_id: string;
  ts: number;
  path: string;
  params: EventParams;
};

let queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenersBound = false;

function consent(): { analytics: boolean; marketing: boolean } {
  if (typeof window === "undefined") return { analytics: false, marketing: false };
  try {
    const raw = window.localStorage.getItem("programo-consent-v1");
    if (!raw) return { analytics: false, marketing: false };
    const c = JSON.parse(raw) as { analytics?: boolean; marketing?: boolean };
    return { analytics: !!c?.analytics, marketing: !!c?.marketing };
  } catch {
    return { analytics: false, marketing: false };
  }
}

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof fn === "function") fn(...args);
}

function fbq(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const fn = window.fbq;
  if (typeof fn === "function") fn(...args);
}

export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Strips undefined/null so GA4 and our store never receive empty params. */
function clean(params: EventParams): EventParams {
  const out: EventParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}

// ---------------------------------------------------------------- first-party

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_INTERVAL_MS);
}

/** Sends the queued batch. Uses sendBeacon on page hide so nothing is lost. */
export function flush(useBeacon = false): void {
  if (typeof window === "undefined" || queue.length === 0) return;
  const batch = queue;
  queue = [];

  const session = getSession();
  const body = JSON.stringify({
    visitor_id: getVisitorId(),
    session_id: session.id,
    session_number: session.number,
    page_views: session.views,
    tz_offset: new Date().getTimezoneOffset(),
    screen: typeof screen !== "undefined" ? `${screen.width}x${screen.height}` : undefined,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    attribution: attributionSummary(),
    events: batch,
  });

  try {
    if (useBeacon && "sendBeacon" in navigator) {
      navigator.sendBeacon(COLLECT_ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(COLLECT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* analytics must never surface an error to the visitor */
    });
  } catch {
    /* ignore */
  }
}

function bindLifecycleListeners(): void {
  if (listenersBound || typeof window === "undefined") return;
  listenersBound = true;
  // pagehide fires reliably on mobile Safari where beforeunload does not, and
  // it is the only one of the two that means "this visit is over".
  window.addEventListener("pagehide", () => {
    emitSessionSummary();
    flush(true);
  });

  // Hiding the tab is NOT leaving. Switching to another tab to check an e-mail
  // and coming back is the most ordinary thing a visitor does; treating it as
  // the end of the visit produced a session_summary containing the first page
  // and nothing else — and, because it only ever emitted once, the rest of the
  // visit (including the lead) never appeared in any summary at all.
  // Flush what we have so nothing is lost if they never return, but keep the
  // tally open.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
}

// ------------------------------------------------------------ session summary

/**
 * Running tally of the visit, emitted as one row when the visitor leaves.
 *
 * At a few hundred sessions a month, this is the most useful artefact the whole
 * system produces: not a chart, but a list short enough to read line by line.
 * Everything here is derived from events that already pass through track(), so
 * it costs one object and no extra listeners.
 */
const stats = {
  pages: 0,
  maxScroll: 0,
  engagedSeconds: 0,
  ctaClicks: 0,
  sections: new Set<string>(),
  formStarted: false,
  formSubmitted: false,
  contactClicked: false,
  frustration: 0,
  emitted: false,
  /** Which session the tally belongs to — see resetSessionStats. */
  sessionId: "",
};

/** Starts a fresh tally. */
function resetSessionStats(sessionId = ""): void {
  stats.pages = 0;
  stats.maxScroll = 0;
  stats.engagedSeconds = 0;
  stats.ctaClicks = 0;
  stats.sections = new Set();
  stats.formStarted = false;
  stats.formSubmitted = false;
  stats.contactClicked = false;
  stats.frustration = 0;
  stats.emitted = false;
  stats.sessionId = sessionId;
}

function updateStats(name: string, params: EventParams): void {
  switch (name) {
    case "page_view_spa":
      stats.pages += 1;
      break;
    case "scroll_depth":
      stats.maxScroll = Math.max(stats.maxScroll, Number(params.percent) || 0);
      break;
    case "engaged_time":
      stats.engagedSeconds += Number(params.seconds) || 0;
      break;
    case "cta_click":
      stats.ctaClicks += 1;
      break;
    case "section_view":
      if (typeof params.section === "string") stats.sections.add(params.section);
      break;
    case "form_start":
      stats.formStarted = true;
      break;
    case "generate_lead":
      stats.formSubmitted = true;
      break;
    case "contact_click":
    case "copy_contact":
      stats.contactClicked = true;
      break;
    case "rage_click":
    case "dead_click":
    case "js_error":
    case "form_submit_failed":
      stats.frustration += 1;
      break;
  }
}

function emitSessionSummary(): void {
  if (stats.emitted || typeof window === "undefined") return;
  // A session with no measured activity says nothing worth a row.
  if (stats.pages === 0 && stats.maxScroll === 0) return;
  stats.emitted = true;
  const s = getSession();
  // A bfcache restore revives the page with the module still loaded. Reset so a
  // second visit in the same tab gets its own row instead of silently vanishing.
  window.addEventListener(
    "pageshow",
    (e) => {
      if ((e as PageTransitionEvent).persisted) resetSessionStats();
    },
    { once: true },
  );
  track("session_summary", {
    pages_viewed: Math.max(stats.pages, s.views),
    max_scroll: stats.maxScroll,
    engaged_seconds: stats.engagedSeconds,
    cta_clicks: stats.ctaClicks,
    sections_seen: stats.sections.size,
    form_started: stats.formStarted,
    form_submitted: stats.formSubmitted,
    contact_clicked: stats.contactClicked,
    frustration_signals: stats.frustration,
    session_number: s.number,
    exit_page: window.location.pathname,
  });
}

// --------------------------------------------------------------------- public

/**
 * Records an event. Never throws, never blocks, safe to call during render
 * effects and event handlers.
 *
 * @returns the event_id, so a caller that also fires the server-side twin
 *          (Meta CAPI / GA4 Measurement Protocol) can pass the same id for
 *          deduplication.
 */
export function track(key: EventKey, params: EventParams = {}): string {
  // Widened to EventDef: the `as const` literal types in events.ts narrow `to`
  // to a fixed tuple, which makes .includes() reject sibling destinations.
  const def: EventDef = EVENTS[key];
  const eventId = typeof params.event_id === "string" ? params.event_id : newEventId();
  if (typeof window === "undefined") return eventId;

  bindLifecycleListeners();
  const { analytics, marketing } = consent();
  const payload = clean({ ...params, event_id: eventId });
  // Everything funnels through here, so the visit tally comes for free.
  if (def.name !== "session_summary") {
    // A tab left open past the 30-minute idle boundary starts a NEW session.
    // Close the previous tally and open a fresh one, or the second visit would
    // inherit the first one's numbers — or, worse, be dropped as "already
    // emitted".
    const current = getSession().id;
    if (stats.sessionId && stats.sessionId !== current) {
      emitSessionSummary();
      resetSessionStats(current);
    } else if (!stats.sessionId) {
      stats.sessionId = current;
    }
    updateStats(def.name, payload);
  }

  // --- GA4 -----------------------------------------------------------------
  // Sent unconditionally: with consent denied, Consent Mode v2 sends a
  // cookieless ping that Google uses for conversion modelling. Suppressing it
  // would lose the modelled conversions too.
  if (def.to.includes("ga4")) {
    gtag("event", def.name, payload);
  }

  // --- Meta Pixel ----------------------------------------------------------
  if (def.to.includes("meta") && def.meta && marketing) {
    fbq(def.meta.standard ? "track" : "trackCustom", def.meta.event, payload, {
      eventID: eventId,
    });
  }

  // --- first-party ---------------------------------------------------------
  if (def.to.includes("firstParty") && analytics) {
    queue.push({
      event: def.name,
      event_id: eventId,
      ts: Date.now(),
      path: window.location.pathname,
      params: payload,
    });
    if (queue.length >= MAX_BATCH) flush();
    else scheduleFlush();
  }

  return eventId;
}

/**
 * Marks a page view, including client-side route changes.
 *
 * gtag('config') runs once in <head>, and the App Router never reloads the
 * document — so GA4 was only ever told about the FIRST page of each visit and
 * its "Pages and screens" report silently undercounted everything else. The
 * explicit page_view below is what fixes that; `page_view_spa` remains our own
 * first-party mirror.
 */
let lastGa4Path = "";
export function trackPageView(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  bumpSessionViews();

  // Skip the very first call: gtag('config') already sent a page_view for the
  // landing page, and sending a second one would double-count it.
  if (lastGa4Path && lastGa4Path !== path) {
    gtag("event", "page_view", {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    });
  }
  lastGa4Path = path;

  track("page_view_spa", { page_path: path, page_title: title });
}

/**
 * Snapshot of the visitor's context, emitted once per session. Everything here
 * is derivable from a single event so later events stay small.
 */
export function trackSessionContext(): void {
  if (typeof window === "undefined") return;
  const s = getSession();
  if (s.views > 1) return; // already emitted this session
  const attr = attributionSummary();
  track("session_context", {
    ...attr,
    session_number: s.number,
    returning: s.number > 1,
    theme: document.documentElement.getAttribute("data-theme") ?? undefined,
    prefers_reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    connection:
      (navigator as unknown as { connection?: { effectiveType?: string } }).connection
        ?.effectiveType ?? undefined,
  });
  // An AI-referred visit is the payoff of the GEO work — promote it to GA4 as
  // its own event so it is visible without querying the first-party store.
  if (attr.referrer_class === "ai") {
    track("ai_referral", { ai_source: attr.ai_source, landing_page: attr.landing_page });
  }
}

/** Identity + Meta cookies for the server-side twin of a conversion. */
export function conversionContext(): {
  event_id: string;
  visitor_id: string;
  session_id: string;
  fbc?: string;
  fbp?: string;
  page_url: string;
} {
  const s = getSession();
  return {
    event_id: newEventId(),
    visitor_id: getVisitorId(),
    session_id: s.id,
    fbc: deriveFbc(),
    fbp: readFbp(),
    page_url: typeof window !== "undefined" ? window.location.href : "",
  };
}

/**
 * GA4's own client_id / session_id, read out of the gtag runtime. Required by
 * the Measurement Protocol: without the real ids, a server-side event lands in
 * a separate, sessionless user and the report double-counts.
 */
export function readGa4Ids(measurementId: string): Promise<{
  client_id?: string;
  session_id?: string;
}> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof (window as unknown as { gtag?: GtagFn }).gtag !== "function") {
      resolve({});
      return;
    }
    let clientId: string | undefined;
    let sessionId: string | undefined;
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve({ client_id: clientId, session_id: sessionId });
    };
    // gtag('get') invokes the callback asynchronously and silently never calls
    // it if the library failed to load — hence the timeout.
    const timer = setTimeout(done, 1200);
    let pending = 2;
    const settle = () => {
      if (--pending === 0) {
        clearTimeout(timer);
        done();
      }
    };
    gtag("get", measurementId, "client_id", (v: string) => {
      clientId = v;
      settle();
    });
    gtag("get", measurementId, "session_id", (v: string) => {
      sessionId = v;
      settle();
    });
  });
}
