// Campaign attribution: which click brought this visitor, and which one brought
// them the FIRST time.
//
// The previous implementation stored a single flat "latest campaign wins" blob.
// That loses the discovery channel entirely: someone finds us via Perplexity in
// May and converts through a branded Google Ads click in July, and the lead is
// filed 100% to Ads. We now keep first-touch AND last-touch, plus a classified
// referrer, so the CRM record answers "where did this person come from" honestly.
//
// The legacy flat fields (gclid, utm_*, landing_page, referrer, first_seen) are
// still written at the top level of the same storage key so /api/contact and the
// existing CRM keep working unchanged.

const STORAGE_KEY = "programo-attribution";

/** Ad-platform click identifiers we recognise, in priority order. */
export const CLICK_IDS = [
  "gclid", // Google Ads
  "gbraid", // Google Ads, iOS web-to-app
  "wbraid", // Google Ads, iOS app-to-web
  "fbclid", // Meta
  "msclkid", // Microsoft Ads
  "ttclid", // TikTok
  "li_fat_id", // LinkedIn
  "twclid", // X/Twitter
] as const;

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
] as const;

const PARAM_KEYS = [...CLICK_IDS, ...UTM_KEYS] as const;
type ParamKey = (typeof PARAM_KEYS)[number];

/** Referrer buckets. `ai` is the one we care most about right now. */
export type ReferrerClass =
  | "direct"
  | "ai"
  | "search"
  | "social"
  | "referral"
  | "internal";

/**
 * Hosts of AI assistants and answer engines that send real humans.
 * Matched as suffixes against the referrer hostname.
 */
const AI_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "openai.com",
  "perplexity.ai",
  "claude.ai",
  "copilot.microsoft.com",
  "bing.com/chat",
  "gemini.google.com",
  "bard.google.com",
  "you.com",
  "phind.com",
  "poe.com",
  "mistral.ai",
  "chat.deepseek.com",
  "grok.com",
  "x.ai",
  "kagi.com",
  "andisearch.com",
  "iask.ai",
  "komo.ai",
  "exa.ai",
];

const SEARCH_HOSTS = [
  "google.",
  "bing.com",
  "duckduckgo.com",
  "yahoo.",
  "yandex.",
  "ecosia.org",
  "startpage.com",
  "brave.com",
  "seznam.cz",
  "onet.pl",
  "wp.pl",
  "interia.pl",
];

const SOCIAL_HOSTS = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "lnkd.in",
  "t.co",
  "twitter.com",
  "x.com",
  "youtube.com",
  "tiktok.com",
  "reddit.com",
  "news.ycombinator.com",
  "github.com",
  "wykop.pl",
  "threads.net",
  "pinterest.",
  "messenger.com",
];

/** Classify a referrer URL. Exported so the server can reuse the same rules. */
export function classifyReferrer(
  referrer: string,
  selfHost?: string,
): { class: ReferrerClass; host: string; aiSource?: string } {
  if (!referrer) return { class: "direct", host: "" };
  let host = "";
  let full = "";
  try {
    const u = new URL(referrer);
    host = u.hostname.toLowerCase().replace(/^www\./, "");
    full = host + u.pathname.toLowerCase();
  } catch {
    return { class: "direct", host: "" };
  }
  if (selfHost && host === selfHost.replace(/^www\./, "")) {
    return { class: "internal", host };
  }
  const ai = AI_HOSTS.find((h) => host === h || host.endsWith("." + h) || full.startsWith(h));
  if (ai) return { class: "ai", host, aiSource: ai };
  if (SEARCH_HOSTS.some((h) => host.includes(h))) return { class: "search", host };
  if (SOCIAL_HOSTS.some((h) => host === h || host.endsWith("." + h) || host.includes(h))) {
    return { class: "social", host };
  }
  return { class: "referral", host };
}

/** One acquisition touch. */
export type Touch = Partial<Record<ParamKey, string>> & {
  referrer?: string;
  referrer_class?: ReferrerClass;
  referrer_host?: string;
  ai_source?: string;
  landing_page?: string;
  ts?: string;
};

/**
 * Stored attribution. Flat legacy fields sit alongside `first`/`last` so older
 * consumers (/api/contact, CRM) keep reading exactly what they read before.
 */
export type Attribution = Touch & {
  first_seen?: string;
  first?: Touch;
  last?: Touch;
  visits?: number;
};

function safeParse(raw: string): Attribution {
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? (obj as Attribution) : {};
  } catch {
    return {};
  }
}

/**
 * Attribution is a marketing identifier plus a history of where someone came
 * from. Storing it is exactly the kind of access to a visitor's device that
 * requires consent — "it is only a UUID" or "it is only a referrer" does not
 * exempt it. So nothing is persisted until ANALYTICS consent is granted; before
 * that it lives in memory for the life of the page and disappears with it.
 *
 * The campaign that brought someone here is still captured in memory, so a
 * visitor who lands from an ad and accepts the banner keeps full attribution —
 * we just never write it down before they say yes.
 */
let memAttribution: Attribution | null = null;

function canPersist(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("programo-consent-v1");
    if (!raw) return false;
    const c = JSON.parse(raw) as { analytics?: boolean };
    return !!c?.analytics;
  } catch {
    return false;
  }
}

function read(): Attribution {
  if (typeof window === "undefined") return {};
  if (!canPersist()) return memAttribution ?? {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return safeParse(raw);
    // Consent just arrived — promote whatever we gathered in memory.
    return memAttribution ?? {};
  } catch {
    return memAttribution ?? {};
  }
}

function write(a: Attribution): void {
  memAttribution = a;
  if (!canPersist()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* private mode / quota */
  }
}

/**
 * Writes the in-memory attribution to storage. Called the moment analytics
 * consent is granted.
 *
 * Without this, a visitor who lands from an ad and accepts the banner keeps the
 * gclid only for the life of that page: the form on the same page still carries
 * it (reads fall back to memory), but the next page load starts blank and a
 * conversion two clicks later reports as "direct". Nothing else re-writes
 * attribution until the next external touch, which for that visitor never comes.
 */
export function persistPendingAttribution(): void {
  if (typeof window === "undefined" || !memAttribution || !canPersist()) return;
  try {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memAttribution));
    }
  } catch {
    /* private mode / quota */
  }
}

/** Wipes stored attribution. Called when analytics consent is withdrawn. */
export function clearAttribution(): void {
  memAttribution = null;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Builds the touch described by the current URL + referrer. */
function currentTouch(): { touch: Touch; hasCampaign: boolean } {
  const params = new URLSearchParams(window.location.search);
  const touch: Touch = {};
  let hasCampaign = false;

  for (const key of PARAM_KEYS) {
    const val = params.get(key);
    if (val) {
      touch[key] = val.slice(0, 300);
      hasCampaign = true;
    }
  }

  const ref = document.referrer || "";
  const cls = classifyReferrer(ref, window.location.hostname);
  touch.referrer = ref.slice(0, 500);
  touch.referrer_class = cls.class;
  touch.referrer_host = cls.host;
  if (cls.aiSource) touch.ai_source = cls.aiSource;
  touch.landing_page = window.location.pathname.slice(0, 500);
  touch.ts = new Date().toISOString();

  // An AI or organic referrer is a real acquisition touch even with no UTM on
  // the URL — that is exactly the GEO traffic we are trying to measure.
  //
  // BUT: in the App Router, `document.referrer` does NOT change on client-side
  // navigation. Without the guard below, the second page view of a visit looks
  // like a brand-new organic touch from the same referrer, overwrites the stored
  // campaign, and the gclid is gone — so a lead from a paid click gets filed as
  // "direct" and never reconciles with Google Ads. Referrer alone only counts as
  // a new touch when we have nothing at all yet.
  const isFirstTouchOfVisit = !read().first;
  if (
    isFirstTouchOfVisit &&
    (cls.class === "ai" || cls.class === "search" || cls.class === "social" || cls.class === "referral")
  ) {
    hasCampaign = true;
  }
  return { touch, hasCampaign };
}

/**
 * Reads campaign params + referrer from the current page and merges them into
 * storage. First touch is written once and never overwritten; last touch is
 * replaced whenever a new external touch appears. Internal navigation changes
 * nothing. Safe to call on every page mount.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const prev = read();
    const { touch, hasCampaign } = currentTouch();

    // Internal navigation (no params, referrer is us or empty) — leave as is.
    if (!hasCampaign && prev.first) return;

    const first = prev.first ?? touch;
    // A visit, not a page view. captureAttribution runs on every mount and every
    // route change, so an unconditional increment counted one visit five times.
    // 30 minutes of inactivity is the same boundary GA4 uses for a session, so
    // our "visits" and GA4's "sessions" stay comparable.
    const lastTs = prev.last?.ts ? Date.parse(prev.last.ts) : 0;
    const isNewVisit = !prev.first || !lastTs || Date.now() - lastTs > 30 * 60 * 1000;

    const next: Attribution = {
      // Flat fields = last touch, merged OVER the previous ones rather than
      // replacing them. This is what keeps a gclid alive: a later touch that
      // carries no click id must not erase the one that brought the visitor
      // here, or a paid lead reports as organic. A genuinely new campaign still
      // wins, because its own value is present in `touch`.
      ...prev,
      ...touch,
      first,
      last: touch,
      first_seen: prev.first_seen || first.ts || touch.ts,
      // Visits, not page views. captureAttribution runs on every mount and on
      // every route change, so incrementing unconditionally counted a single
      // visit five times.
      visits: isNewVisit ? (prev.visits ?? 0) + 1 : (prev.visits ?? 1),
    };
    write(next);
  } catch {
    /* ignore storage/parse errors */
  }
}

/** Stored attribution, after syncing anything still present in the URL. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    captureAttribution();
    return read();
  } catch {
    return {};
  }
}

/**
 * Meta's `fbc` cookie value, derived from an `fbclid` in the URL when the Pixel
 * has not yet written `_fbc` itself. Format is fixed by Meta:
 * `fb.<subdomainIndex>.<creationTimeMs>.<fbclid>` — subdomainIndex is 1 for a
 * cookie set on the registrable domain.
 */
export function deriveFbc(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const cookie = readCookie("_fbc");
  if (cookie) return cookie;
  const attr = read();
  const fbclid = new URLSearchParams(window.location.search).get("fbclid") || attr.last?.fbclid || attr.fbclid;
  if (!fbclid) return undefined;
  const ts = attr.last?.ts ? Date.parse(attr.last.ts) : Date.now();
  return `fb.1.${Number.isFinite(ts) ? ts : Date.now()}.${fbclid}`;
}

/** Meta's browser id cookie, written by the Pixel. Undefined before it loads. */
export function readFbp(): string | undefined {
  return readCookie("_fbp");
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Compact attribution summary attached to every first-party event. */
export function attributionSummary(): Record<string, string | number | undefined> {
  const a = read();
  const last = a.last ?? a;
  const first = a.first ?? last;
  return {
    source: last.utm_source || (last.gclid || last.gbraid || last.wbraid ? "google_ads" : last.referrer_host || "direct"),
    medium: last.utm_medium,
    campaign: last.utm_campaign,
    term: last.utm_term,
    content: last.utm_content,
    referrer_class: last.referrer_class,
    ai_source: last.ai_source,
    first_source: first.utm_source || first.referrer_host || "direct",
    first_referrer_class: first.referrer_class,
    first_seen: a.first_seen,
    visits: a.visits,
    landing_page: last.landing_page,
  };
}
