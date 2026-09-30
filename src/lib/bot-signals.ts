"use client";

/**
 * Behaviour signals attached to every lead submission — the browser half of
 * lib/bot-score.ts. Counts only (no keystrokes, no coordinates, no content),
 * so nothing here is personal data.
 *
 * Why: the junk leads of Sept 2026 came through a real, automated browser.
 * It runs our JavaScript, so the honeypot, the proof of work and the UA filter
 * all pass. What such a script rarely fakes is a person: keys pressed, a
 * pointer that moved, time spent on the page.
 */

type Counts = { kd: number; pm: number; pd: number; ts: number; sc: number; paste: number };
const counts: Counts = { kd: 0, pm: 0, pd: 0, ts: 0, sc: 0, paste: 0 };
const startedAt = typeof performance !== "undefined" ? performance.now() : 0;
let installed = false;

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const opts = { passive: true, capture: true } as const;
  // Only trusted events: a script calling dispatchEvent() does not count.
  const bump = (k: keyof Counts) => (e: Event) => {
    if (e.isTrusted) counts[k]++;
  };
  window.addEventListener("keydown", bump("kd"), opts);
  window.addEventListener("pointermove", bump("pm"), opts);
  window.addEventListener("pointerdown", bump("pd"), opts);
  window.addEventListener("touchstart", bump("ts"), opts);
  window.addEventListener("scroll", bump("sc"), opts);
  window.addEventListener("paste", bump("paste"), opts);
}
install();

export type BotSignals = {
  wd: boolean;
  kd: number;
  pm: number;
  pd: number;
  ts: number;
  sc: number;
  paste: number;
  ms: number;
  tz: string;
  lang: string;
  sw: number;
  sh: number;
};

export function collectBotSignals(): BotSignals {
  install();
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    /* ignore */
  }
  return {
    wd: navigator.webdriver === true,
    ...counts,
    ms: Math.round(performance.now() - startedAt),
    tz,
    lang: navigator.language || "",
    sw: window.screen?.width ?? 0,
    sh: window.screen?.height ?? 0,
  };
}
