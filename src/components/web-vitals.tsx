"use client";

// Field performance, measured on real visitors' devices.
//
// PageSpeed Insights scores a lab run on a simulated mid-tier phone. This
// reports what actually happened, per page, on the hardware and network people
// really used — the only version of the number Google ranks on.

import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/lib/analytics/client";

/** Google's "good" / "poor" thresholds (2026). */
const THRESHOLDS: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function rate(name: string, value: number): string {
  const t = THRESHOLDS[name];
  if (!t) return "unknown";
  if (value <= t[0]) return "good";
  if (value <= t[1]) return "needs-improvement";
  return "poor";
}

// Defined at module scope on purpose. Next.js warns that a changing callback
// reference makes useReportWebVitals report the same metric more than once —
// an inline arrow would be a new function on every render. Everything it needs
// (the path) is read from `location` at call time instead of from a hook.
const report: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  const rating = metric.rating ?? rate(metric.name, metric.value);

  // GA4's generic `value` carries the DELTA, not the full value: web-vitals
  // emits several updates per page for CLS/INP, and analytics back-ends sum
  // event values. Summing deltas reconstructs the real total; summing full
  // values would inflate CLS several-fold. metric_value keeps the full number
  // for per-event reporting.
  const deltaForValue =
    metric.name === "CLS" ? Math.round(metric.delta * 1000) : Math.round(metric.delta);

  track("web_vitals", {
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value),
    metric_delta: deltaForValue,
    metric_rating: rating,
    navigation_type: metric.navigationType,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    value: deltaForValue,
  });
};

export default function WebVitals() {
  useReportWebVitals(report);
  return null;
}
