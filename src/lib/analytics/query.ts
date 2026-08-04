// Server-side aggregation for the internal analytics reader at /crm/analytics.
//
// Everything below the "Redis" marker is a PURE function: batches/events in,
// aggregates out. Only getAnalyticsDashboardData touches Redis — that split
// keeps the aggregation logic unit-testable without a live store, and keeps
// the heavy lifting on the server so the client never receives 800 raw batches.
//
// Philosophy (see docs/plans or the task brief): at a few hundred sessions a
// month, a trend chart shows noise dressed up as a signal. This groups the raw
// event log into sessions and lets a human read it line by line instead.

import { isLeadStoreConfigured } from "@/lib/leads";
import {
  getAiCrawlerHits,
  getEventBatches,
  type EventBatch,
  type StoredEvent,
} from "./store";

const MAX_BATCHES = 800;
const AI_CRAWLER_DAYS = 30;

// --------------------------------------------------------------------- utils

function asNumber(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function asString(v: unknown): string | undefined {
  if (typeof v === "string" && v.length > 0) return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

function asBoolish(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === 1) return true;
  if (v === "false" || v === 0) return false;
  return undefined;
}

function firstDefined<T>(values: (T | undefined)[]): T | undefined {
  return values.find((v) => v !== undefined && v !== null && v !== "");
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Reads a field out of an attribution blob (attribution/query.ts#attributionSummary shape). */
export function attributionField(
  attribution: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  return asString(attribution?.[key]);
}

// ------------------------------------------------------------------ sessions

export type SessionSummary = {
  sessionId: string;
  visitorId: string;
  /** First/last event ts (client clock, ms) in this session. */
  start: number;
  end: number;
  pageViews: number;
  engagedSeconds: number;
  maxScrollPct: number;
  country?: string;
  device?: string;
  browser?: string;
  os?: string;
  attribution?: Record<string, unknown>;
  /** All events across every batch of this session, sorted ascending by ts. */
  events: StoredEvent[];
  hasLead: boolean;
  /** Distinct of: rage_click, dead_click, js_error, form_abandon. */
  qualityFlags: string[];
};

const QUALITY_EVENTS = new Set(["rage_click", "dead_click", "js_error", "form_abandon"]);

/**
 * Groups batches by session_id (one session is usually several batches — the
 * client flushes every few seconds) and derives per-session metrics.
 */
export function buildSessions(batches: EventBatch[]): SessionSummary[] {
  const bySession = new Map<string, EventBatch[]>();
  for (const b of batches) {
    if (!b.session_id) continue;
    const list = bySession.get(b.session_id) ?? [];
    list.push(b);
    bySession.set(b.session_id, list);
  }

  const sessions: SessionSummary[] = [];
  for (const [sessionId, group] of bySession) {
    const events = group.flatMap((b) => b.events).sort((a, b) => a.ts - b.ts);
    if (events.length === 0) continue;

    const engagedSeconds = events
      .filter((e) => e.event === "engaged_time")
      .reduce((sum, e) => sum + (asNumber(e.params?.seconds) ?? 0), 0);
    const maxScrollPct = events
      .filter((e) => e.event === "scroll_depth")
      .reduce((max, e) => Math.max(max, asNumber(e.params?.percent) ?? 0), 0);

    sessions.push({
      sessionId,
      visitorId: group[0].visitor_id,
      start: events[0].ts,
      end: events[events.length - 1].ts,
      pageViews: Math.max(0, ...group.map((b) => b.page_views ?? 0)),
      engagedSeconds,
      maxScrollPct,
      country: firstDefined(group.map((b) => b.country)),
      device: firstDefined(group.map((b) => b.device)),
      browser: firstDefined(group.map((b) => b.browser)),
      os: firstDefined(group.map((b) => b.os)),
      attribution: firstDefined(group.map((b) => b.attribution)),
      events,
      hasLead: events.some((e) => e.event === "generate_lead"),
      qualityFlags: Array.from(
        new Set(events.filter((e) => QUALITY_EVENTS.has(e.event)).map((e) => e.event)),
      ),
    });
  }

  // Newest first — this is a reader, not a report, so the most recent activity
  // belongs at the top.
  return sessions.sort((a, b) => b.start - a.start);
}

// -------------------------------------------------------------- event labels

/** Param to surface inline for a given event, when it exists. */
const PATH_PARAM_KEYS: Record<string, string> = {
  section_view: "section",
  form_error: "field",
  form_field_complete: "field",
  form_field_skip: "field",
  cta_click: "cta",
  contact_click: "method",
  copy_contact: "method",
  select_content: "content_id",
  rage_click: "element",
  dead_click: "element",
  ai_referral: "ai_source",
  language_switch: "to",
  theme_switch: "to",
};

/** Cosmetic renames for the session path — internal event name vs. what reads well. */
const DISPLAY_NAMES: Record<string, string> = {
  page_view_spa: "page_view",
};

/** Noisy/administrative events that would drown the readable path in repeats. */
const PATH_HIDDEN_EVENTS = new Set([
  "scroll_depth",
  "web_vitals",
  "engaged_time",
  "session_context",
]);

export function eventLabel(e: StoredEvent): string {
  const name = DISPLAY_NAMES[e.event] ?? e.event;
  const paramKey = PATH_PARAM_KEYS[e.event];
  const raw = paramKey ? asString(e.params?.[paramKey]) : undefined;
  return raw ? `${name}(${raw.slice(0, 28)})` : name;
}

/** Ordered, readable event path for a session's collapsed row. */
export function sessionPath(session: SessionSummary): string[] {
  return session.events.filter((e) => !PATH_HIDDEN_EVENTS.has(e.event)).map(eventLabel);
}

// --------------------------------------------------------------- form funnel

export type FieldFunnelRow = {
  field: string;
  completions: number;
  medianSeconds: number | null;
  skips: number;
  errors: number;
  errorMessages: { message: string; count: number }[];
};

export type FormFunnel = {
  viewSessions: number;
  startSessions: number;
  submitSessions: number;
  failedSessions: number;
  viewToStartRate: number | null;
  startToSubmitRate: number | null;
  /** Set when the event log was truncated mid-session, so rates understate. */
  truncated?: boolean;
  /** 1 - (sessions with generate_lead / sessions with form_start). Sessions, not events. */
  abandonmentRate: number | null;
  fields: FieldFunnelRow[];
};

export function buildFormFunnel(sessions: SessionSummary[]): FormFunnel {
  const has = (s: SessionSummary, name: string) => s.events.some((e) => e.event === name);
  const viewSessions = sessions.filter((s) => has(s, "form_view")).length;
  const startSessions = sessions.filter((s) => has(s, "form_start")).length;
  const submitSessions = sessions.filter((s) => has(s, "generate_lead")).length;
  const failedSessions = sessions.filter((s) => has(s, "form_submit_failed")).length;

  type FieldAcc = { completions: number; seconds: number[]; skips: number; errors: Map<string, number> };
  const byField = new Map<string, FieldAcc>();
  const ensure = (field: string): FieldAcc => {
    let row = byField.get(field);
    if (!row) {
      row = { completions: 0, seconds: [], skips: 0, errors: new Map() };
      byField.set(field, row);
    }
    return row;
  };

  for (const e of sessions.flatMap((s) => s.events)) {
    if (e.event === "form_field_complete") {
      const row = ensure(asString(e.params?.field) ?? "(nieznane)");
      row.completions += 1;
      const seconds = asNumber(e.params?.seconds);
      if (seconds !== undefined) row.seconds.push(seconds);
    } else if (e.event === "form_field_skip") {
      ensure(asString(e.params?.field) ?? "(nieznane)").skips += 1;
    } else if (e.event === "form_error") {
      const row = ensure(asString(e.params?.field) ?? "(nieznane)");
      const message = asString(e.params?.message) ?? "(brak treści)";
      row.errors.set(message, (row.errors.get(message) ?? 0) + 1);
    }
  }

  /**
   * Clamped to [0,1] on purpose.
   *
   * Numerator and denominator come from different batches of the same session,
   * and the raw event log is a capped ring buffer — so the batch carrying
   * `form_start` can be evicted while the one carrying `generate_lead` survives.
   * Unclamped, that produced a dashboard reading "300% conversion from form
   * start" and "-200% abandonment", which is worse than a missing number: it
   * looks like a finding.
   */
  const rate = (num: number, den: number): number | null =>
    den > 0 ? Math.max(0, Math.min(1, num / den)) : null;

  /** True when the log has been truncated mid-session and rates are suspect. */
  const truncated = submitSessions > startSessions || startSessions > viewSessions;

  const fields: FieldFunnelRow[] = Array.from(byField.entries())
    .map(([field, row]) => {
      const errorMessages = Array.from(row.errors.entries())
        .map(([message, count]) => ({ message, count }))
        .sort((a, b) => b.count - a.count);
      return {
        field,
        completions: row.completions,
        medianSeconds: median(row.seconds),
        skips: row.skips,
        errors: errorMessages.reduce((sum, m) => sum + m.count, 0),
        errorMessages,
      };
    })
    // Costliest field first: errors + skips is the signal "this field loses leads".
    .sort((a, b) => b.errors + b.skips - (a.errors + a.skips) || b.completions - a.completions);

  return {
    viewSessions,
    startSessions,
    submitSessions,
    failedSessions,
    viewToStartRate: rate(startSessions, viewSessions),
    startToSubmitRate: rate(submitSessions, startSessions),
    abandonmentRate:
      startSessions > 0 ? Math.max(0, Math.min(1, 1 - submitSessions / startSessions)) : null,
    truncated,
    fields,
  };
}

// ---------------------------------------------------------------- quality

export type ClickIssue = { element: string; section: string; count: number };
export type JsErrorRow = { message: string; count: number };
export type WebVitalRow = {
  metric: string;
  good: number;
  needsImprovement: number;
  poor: number;
  unknown: number;
  total: number;
};

export type QualitySignals = {
  rageClicks: ClickIssue[];
  deadClicks: ClickIssue[];
  jsErrors: JsErrorRow[];
  webVitals: WebVitalRow[];
};

function groupClicks(events: StoredEvent[], eventName: string): ClickIssue[] {
  // Nested by section then element -- avoids inventing a join delimiter for a
  // key that has to round-trip back into two independent strings (`element`
  // is DOM text content and can contain almost anything).
  const bySection = new Map<string, Map<string, number>>();
  for (const e of events) {
    if (e.event !== eventName) continue;
    const element = asString(e.params?.element) ?? "(nieznany element)";
    const section = asString(e.params?.section) ?? "(brak sekcji)";
    const elements = bySection.get(section) ?? new Map<string, number>();
    elements.set(element, (elements.get(element) ?? 0) + 1);
    bySection.set(section, elements);
  }
  const out: ClickIssue[] = [];
  for (const [section, elements] of bySection) {
    for (const [element, count] of elements) out.push({ section, element, count });
  }
  return out.sort((a, b) => b.count - a.count);
}

export function buildQualitySignals(sessions: SessionSummary[]): QualitySignals {
  const events = sessions.flatMap((s) => s.events);

  const jsErrorMap = new Map<string, number>();
  for (const e of events) {
    if (e.event !== "js_error") continue;
    const message = asString(e.params?.message) ?? "(brak komunikatu)";
    jsErrorMap.set(message, (jsErrorMap.get(message) ?? 0) + 1);
  }

  const vitalsMap = new Map<
    string,
    { good: number; needsImprovement: number; poor: number; unknown: number }
  >();
  for (const e of events) {
    if (e.event !== "web_vitals") continue;
    const metric = asString(e.params?.metric_name) ?? "unknown";
    const rating = asString(e.params?.metric_rating) ?? "unknown";
    const row = vitalsMap.get(metric) ?? { good: 0, needsImprovement: 0, poor: 0, unknown: 0 };
    if (rating === "good") row.good += 1;
    else if (rating === "needs-improvement") row.needsImprovement += 1;
    else if (rating === "poor") row.poor += 1;
    else row.unknown += 1;
    vitalsMap.set(metric, row);
  }

  return {
    rageClicks: groupClicks(events, "rage_click"),
    deadClicks: groupClicks(events, "dead_click"),
    jsErrors: Array.from(jsErrorMap.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count),
    webVitals: Array.from(vitalsMap.entries())
      .map(([metric, r]) => ({ metric, ...r, total: r.good + r.needsImprovement + r.poor + r.unknown }))
      .sort((a, b) => a.metric.localeCompare(b.metric)),
  };
}

// ------------------------------------------------------------------ consent

export type ConsentSummary = {
  totalEvents: number;
  analyticsGranted: number;
  analyticsDenied: number;
  marketingGranted: number;
  marketingDenied: number;
  /** False when consent_update fires but carries no analytics/marketing booleans yet. */
  hasCategoryData: boolean;
};

export function buildConsentSummary(sessions: SessionSummary[]): ConsentSummary {
  const events = sessions.flatMap((s) => s.events).filter((e) => e.event === "consent_update");
  let analyticsGranted = 0;
  let analyticsDenied = 0;
  let marketingGranted = 0;
  let marketingDenied = 0;
  let hasCategoryData = false;

  for (const e of events) {
    const analytics = asBoolish(e.params?.analytics);
    if (analytics !== undefined) {
      hasCategoryData = true;
      if (analytics) analyticsGranted += 1;
      else analyticsDenied += 1;
    }
    const marketing = asBoolish(e.params?.marketing);
    if (marketing !== undefined) {
      hasCategoryData = true;
      if (marketing) marketingGranted += 1;
      else marketingDenied += 1;
    }
  }

  return {
    totalEvents: events.length,
    analyticsGranted,
    analyticsDenied,
    marketingGranted,
    marketingDenied,
    hasCategoryData,
  };
}

// -------------------------------------------------------------- AI crawlers

export type AiCrawlerBot = {
  bot: string;
  total: number;
  paths: { path: string; count: number }[];
};

/** Turns getAiCrawlerHits' daily rollups (bot + bot|path keys) into a per-bot summary. */
export function buildAiCrawlerSummary(
  daily: { date: string; counts: Record<string, number> }[],
): AiCrawlerBot[] {
  const bots = new Map<string, { total: number; paths: Map<string, number> }>();
  for (const day of daily) {
    for (const [key, count] of Object.entries(day.counts)) {
      const sep = key.indexOf("|");
      if (sep === -1) {
        const row = bots.get(key) ?? { total: 0, paths: new Map() };
        row.total += count;
        bots.set(key, row);
      } else {
        const bot = key.slice(0, sep);
        const path = key.slice(sep + 1);
        const row = bots.get(bot) ?? { total: 0, paths: new Map() };
        row.paths.set(path, (row.paths.get(path) ?? 0) + count);
        bots.set(bot, row);
      }
    }
  }
  return Array.from(bots.entries())
    .map(([bot, row]) => ({
      bot,
      total: row.total,
      paths: Array.from(row.paths.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.total - a.total);
}

/** Human sessions whose (last-touch) referrer classified as an AI assistant. */
export function countAiReferredSessions(sessions: SessionSummary[]): number {
  return sessions.filter((s) => attributionField(s.attribution, "referrer_class") === "ai").length;
}

// --------------------------------------------------------------------- redis

export type AnalyticsDashboardData = {
  configured: boolean;
  sessions: SessionSummary[];
  funnel: FormFunnel;
  quality: QualitySignals;
  consent: ConsentSummary;
  aiCrawlers: AiCrawlerBot[];
  aiReferredSessions: number;
  batchCount: number;
};

/**
 * Fetches and aggregates everything the /crm/analytics page needs. Only this
 * function touches Redis — best-effort like the rest of lib/leads.ts and
 * lib/analytics/store.ts: no Redis configured means an empty-but-valid result,
 * never a throw.
 */
export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const configured = isLeadStoreConfigured();
  if (!configured) {
    const empty: SessionSummary[] = [];
    return {
      configured: false,
      sessions: empty,
      funnel: buildFormFunnel(empty),
      quality: buildQualitySignals(empty),
      consent: buildConsentSummary(empty),
      aiCrawlers: [],
      aiReferredSessions: 0,
      batchCount: 0,
    };
  }

  const [batches, aiDaily] = await Promise.all([
    getEventBatches(MAX_BATCHES),
    getAiCrawlerHits(AI_CRAWLER_DAYS),
  ]);
  const sessions = buildSessions(batches);

  return {
    configured: true,
    sessions,
    funnel: buildFormFunnel(sessions),
    quality: buildQualitySignals(sessions),
    consent: buildConsentSummary(sessions),
    aiCrawlers: buildAiCrawlerSummary(aiDaily),
    aiReferredSessions: countAiReferredSessions(sessions),
    batchCount: batches.length,
  };
}
