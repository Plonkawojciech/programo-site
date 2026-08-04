// Behavioural signals: the things that tell us *why* a visit did not convert.
//
// Clarity records these too, but only as a video you have to sit and watch. Here
// they become queryable events, so "which section makes people bounce" is a
// filter, not an afternoon.
//
// Everything below is passive: no polling loops, all listeners passive, all
// observers disconnected on cleanup.

import { track } from "./client";

/** Clicks closer than this (px) count as "the same spot" for rage detection. */
const RAGE_RADIUS_PX = 32;
const RAGE_WINDOW_MS = 900;
const RAGE_THRESHOLD = 3;

/** How long we wait for the DOM to react before calling a click "dead". */
const DEAD_CLICK_WAIT_MS = 500;

/** Idle after this long without input; engaged time stops accruing. */
const IDLE_AFTER_MS = 15_000;

const INTERACTIVE_SELECTOR =
  'a,button,input,textarea,select,label,summary,details,[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="switch"],[contenteditable="true"],[tabindex]:not([tabindex="-1"])';

function describe(el: Element | null): string {
  if (!el) return "unknown";
  const parts: string[] = [el.tagName.toLowerCase()];
  const id = el.getAttribute("id");
  if (id) parts.push(`#${id}`);
  const cls = el.getAttribute("class");
  if (cls) {
    const first = cls.split(/\s+/).filter(Boolean).slice(0, 2).join(".");
    if (first) parts.push(`.${first}`);
  }
  const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
  if (text) parts.push(`"${text}"`);
  return parts.join("").slice(0, 120);
}

/** Nearest named section, from `data-section` or the closest id'd ancestor. */
function sectionOf(el: Element | null): string | undefined {
  const named = el?.closest?.("[data-section]");
  if (named) return named.getAttribute("data-section") || undefined;
  const withId = el?.closest?.("section[id],div[id]");
  return withId?.getAttribute("id") || undefined;
}

// ------------------------------------------------------------ rage/dead click

function initClickQuality(): () => void {
  let recent: { x: number; y: number; t: number }[] = [];
  let ragedAt = 0;

  const onClick = (e: MouseEvent) => {
    const now = Date.now();
    const target = e.target as Element | null;

    // --- rage click ---------------------------------------------------------
    recent = recent.filter((c) => now - c.t < RAGE_WINDOW_MS);
    recent.push({ x: e.clientX, y: e.clientY, t: now });
    const cluster = recent.filter(
      (c) => Math.hypot(c.x - e.clientX, c.y - e.clientY) <= RAGE_RADIUS_PX,
    );
    if (cluster.length >= RAGE_THRESHOLD && now - ragedAt > RAGE_WINDOW_MS) {
      ragedAt = now;
      recent = [];
      track("rage_click", {
        element: describe(target),
        section: sectionOf(target),
        clicks: cluster.length,
      });
      return; // a rage click is never also reported as a dead click
    }

    // --- dead click ---------------------------------------------------------
    // Interactive elements are exempt. For the rest, watch for any DOM change
    // or navigation in the next 500 ms; silence means the click did nothing.
    if (target?.closest?.(INTERACTIVE_SELECTOR)) return;
    if (window.getSelection()?.toString()) return; // text selection, not a click

    let reacted = false;
    const observer = new MutationObserver(() => {
      reacted = true;
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    const startPath = window.location.pathname;
    window.setTimeout(() => {
      observer.disconnect();
      if (reacted || window.location.pathname !== startPath) return;
      track("dead_click", {
        element: describe(target),
        section: sectionOf(target),
      });
    }, DEAD_CLICK_WAIT_MS);
  };

  document.addEventListener("click", onClick, { capture: true, passive: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}

// ----------------------------------------------------------------- exit intent

function initExitIntent(): () => void {
  let fired = false;
  const onLeave = (e: MouseEvent) => {
    // Only the top edge — sideways/downward exits are usually not abandonment.
    if (fired || e.clientY > 8 || e.relatedTarget) return;
    fired = true;
    track("exit_intent", {
      scroll_pct: Math.round(
        (window.scrollY /
          Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) *
          100,
      ),
    });
  };
  // Coarse pointers (touch) have no meaningful mouseout — skip entirely.
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mouseout", onLeave, { passive: true });
  }
  return () => document.removeEventListener("mouseout", onLeave);
}

// ---------------------------------------------------------------- engaged time

/**
 * Seconds the visitor was actually present: tab visible AND some input within
 * the last 15 s. Reported on page hide and on route change, so a long read
 * followed by a bounce is distinguishable from a tab left open overnight.
 */
function initEngagedTime(getPath: () => string): () => void {
  let engagedMs = 0;
  let lastTick = Date.now();
  let lastInput = Date.now();
  let reportedPath = getPath();

  const active = () =>
    document.visibilityState === "visible" && Date.now() - lastInput < IDLE_AFTER_MS;

  const tick = () => {
    const now = Date.now();
    if (active()) engagedMs += now - lastTick;
    lastTick = now;
  };

  const interval = window.setInterval(tick, 1000);

  const onInput = () => {
    lastInput = Date.now();
  };
  const inputEvents: (keyof DocumentEventMap)[] = [
    "pointerdown",
    "keydown",
    "scroll",
    "pointermove",
    "touchstart",
  ];
  for (const ev of inputEvents) {
    document.addEventListener(ev, onInput, { passive: true });
  }

  const report = () => {
    tick();
    const seconds = Math.round(engagedMs / 1000);
    if (seconds < 2) return;
    track("engaged_time", { seconds, page_path: reportedPath });
    engagedMs = 0;
    reportedPath = getPath();
  };

  const onHide = () => {
    if (document.visibilityState === "hidden") report();
  };
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", report);

  return () => {
    report();
    window.clearInterval(interval);
    for (const ev of inputEvents) document.removeEventListener(ev, onInput);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", report);
  };
}

// --------------------------------------------------------------- section views

/**
 * Fires once per section per page for any element carrying `data-section`,
 * after it has been at least half visible for a full second. The dwell filter
 * keeps fast scrolls from marking the whole page as "seen".
 */
function initSectionViews(): () => void {
  const seen = new Set<string>();
  const timers = new Map<Element, number>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const name = entry.target.getAttribute("data-section");
        if (!name || seen.has(name)) continue;
        if (entry.isIntersecting) {
          const id = window.setTimeout(() => {
            seen.add(name);
            observer.unobserve(entry.target);
            track("section_view", { section: name });
          }, 1000);
          timers.set(entry.target, id);
        } else {
          const id = timers.get(entry.target);
          if (id) {
            window.clearTimeout(id);
            timers.delete(entry.target);
          }
        }
      }
    },
    { threshold: 0.5 },
  );

  for (const el of document.querySelectorAll("[data-section]")) observer.observe(el);

  // Sections mount late (framer-motion reveals, route transitions) — watch for
  // new ones instead of only scanning once.
  const mutation = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.hasAttribute?.("data-section")) observer.observe(node);
        node.querySelectorAll?.("[data-section]").forEach((el) => observer.observe(el));
      }
    }
  });
  mutation.observe(document.body, { childList: true, subtree: true });

  return () => {
    for (const id of timers.values()) window.clearTimeout(id);
    observer.disconnect();
    mutation.disconnect();
  };
}

// -------------------------------------------------------------- copied contact

/** Selecting and copying a phone number or e-mail is high intent with no click. */
function initCopyContact(): () => void {
  const onCopy = () => {
    const text = window.getSelection()?.toString().trim() ?? "";
    if (!text || text.length > 120) return;
    const digits = text.replace(/\D/g, "");
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      track("copy_contact", { method: "email" });
    } else if (digits.length >= 9 && /^[+\d\s()-]+$/.test(text)) {
      track("copy_contact", { method: "phone" });
    }
  };
  document.addEventListener("copy", onCopy, { passive: true });
  return () => document.removeEventListener("copy", onCopy);
}

// ---------------------------------------------------------------- error signal

function initErrorCapture(): () => void {
  const onError = (e: ErrorEvent) => {
    track("js_error", {
      message: String(e.message).slice(0, 200),
      source: `${e.filename ?? ""}:${e.lineno ?? 0}`.slice(0, 200),
    });
  };
  const onRejection = (e: PromiseRejectionEvent) => {
    track("js_error", {
      message: `unhandledrejection: ${String(e.reason).slice(0, 180)}`,
      source: "promise",
    });
  };
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}

/**
 * Starts every behavioural listener. Call once, from the globally mounted
 * AnalyticsTracker. Returns a cleanup that fully unwinds them.
 */
export function initEngagement(getPath: () => string): () => void {
  if (typeof window === "undefined") return () => {};
  const cleanups = [
    initClickQuality(),
    initExitIntent(),
    initEngagedTime(getPath),
    initSectionViews(),
    initCopyContact(),
    initErrorCapture(),
  ];
  return () => cleanups.forEach((fn) => fn());
}
