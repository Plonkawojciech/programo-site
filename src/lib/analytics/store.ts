// First-party event store — Upstash Redis, best-effort.
//
// Why store events ourselves when GA4 exists: GA4 samples, aggregates, applies
// thresholding on small audiences (a report over 20 sessions is often just
// blank), and cannot be queried per visitor. At programo.pl's volume the raw
// event log IS the analysis — a few hundred sessions a month fits comfortably
// in a capped Redis list and answers questions GA4 will not.
//
// Same contract as lib/leads.ts: never throws, no-ops without Redis config.

import { getRedis } from "@/lib/leads";

// Raw batches, newest first.
//
// Sizing note, because the first estimate here was wrong by an order of
// magnitude: one real visit produces a batch every few seconds plus one on each
// page hide and each phone click, so it is easily 10–20 batches — not one. At
// 800 the buffer held roughly 40 sessions, which also meant an unauthenticated
// caller could evict every genuine session with a short loop. The funnel maths
// in query.ts reads `form_start` and `generate_lead` from different batches of
// the same session, so eviction did not just lose data, it produced conversion
// rates above 100%.
const EVENTS_KEY = "programo:events";
const MAX_BATCHES = 5000;

/** Per-day rollups, so the dashboard never has to scan the raw list. */
const DAILY_PREFIX = "programo:events:daily:";
const DAILY_TTL_SECONDS = 60 * 60 * 24 * 400; // ~13 months of history

export type StoredEvent = {
  event: string;
  event_id: string;
  ts: number;
  path: string;
  params: Record<string, unknown>;
};

export type EventBatch = {
  /** Server-assigned receipt time (ISO). Client clocks lie. */
  received: string;
  visitor_id: string;
  session_id: string;
  session_number?: number;
  page_views?: number;
  tz_offset?: number;
  screen?: string;
  viewport?: string;
  language?: string;
  /** Derived server-side from the User-Agent, never trusted from the client. */
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  attribution?: Record<string, unknown>;
  events: StoredEvent[];
};

function dayKey(iso: string): string {
  return DAILY_PREFIX + iso.slice(0, 10);
}

/**
 * Persist one batch and bump the day's counters.
 *
 * Command budget matters on Upstash's free tier, so this is deliberately
 * 3 commands per batch (push, trim, one pipelined counter block) regardless of
 * how many events the batch carries.
 */
export async function storeEventBatch(batch: EventBatch): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const pipe = redis.multi();
    pipe.lpush(EVENTS_KEY, JSON.stringify(batch));
    pipe.ltrim(EVENTS_KEY, 0, MAX_BATCHES - 1);

    const key = dayKey(batch.received);
    const counts = new Map<string, number>();
    for (const e of batch.events) {
      counts.set(e.event, (counts.get(e.event) ?? 0) + 1);
      // Per-page counts for the two events worth breaking down by page.
      if (e.event === "page_view_spa" || e.event === "generate_lead") {
        const field = `${e.event}|${e.path}`;
        counts.set(field, (counts.get(field) ?? 0) + 1);
      }
    }
    for (const [field, n] of counts) pipe.hincrby(key, field, n);
    pipe.hincrby(key, "__batches", 1);
    pipe.expire(key, DAILY_TTL_SECONDS);

    await pipe.exec();
  } catch (e) {
    console.error("[analytics] storeEventBatch failed:", e);
  }
}

/**
 * Rate limit shared across serverless instances.
 *
 * The in-process Map this replaces was decorative: every lambda instance kept
 * its own counter and a cold start reset it to zero, so the effective limit was
 * "120 × however many instances happen to be warm". A single Redis INCR with an
 * expiry is one command and actually holds.
 *
 * Fails OPEN when Redis is unavailable — analytics must never become the reason
 * a visitor's request errors.
 */
export async function isRateLimited(
  ip: string,
  limit = 200,
  windowSeconds = 300,
): Promise<boolean> {
  const redis = getRedis();
  if (!redis || ip === "unknown") return false;
  try {
    const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
    const key = `programo:rl:${bucket}:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return count > limit;
  } catch {
    return false;
  }
}

/** Most recent batches, newest first. [] without Redis or on error. */
export async function getEventBatches(limit = 300): Promise<EventBatch[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const rows = await redis.lrange<string | EventBatch>(EVENTS_KEY, 0, limit - 1);
    const out: EventBatch[] = [];
    for (const row of rows) {
      try {
        const b = typeof row === "string" ? (JSON.parse(row) as EventBatch) : row;
        if (b && typeof b === "object" && Array.isArray(b.events)) out.push(b);
      } catch {
        /* skip unparseable */
      }
    }
    return out;
  } catch (e) {
    console.error("[analytics] getEventBatches failed:", e);
    return [];
  }
}

/** Daily rollups for the last `days` days, oldest first. */
export async function getDailyCounts(
  days = 30,
  today = new Date(),
): Promise<{ date: string; counts: Record<string, number> }[]> {
  const redis = getRedis();
  if (!redis) return [];
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86_400_000);
    dates.push(d.toISOString().slice(0, 10));
  }
  try {
    const results = await Promise.all(
      dates.map((d) => redis.hgetall<Record<string, string | number>>(DAILY_PREFIX + d)),
    );
    return dates.map((date, i) => {
      const raw = results[i] ?? {};
      const counts: Record<string, number> = {};
      for (const [k, v] of Object.entries(raw)) {
        const n = typeof v === "number" ? v : parseInt(String(v), 10);
        if (Number.isFinite(n)) counts[k] = n;
      }
      return { date, counts };
    });
  } catch (e) {
    console.error("[analytics] getDailyCounts failed:", e);
    return [];
  }
}

// ---------------------------------------------------------------------------
// AI crawler log — which answer engines actually fetch the site, and what.
// Kept separate from human events: different volume, different questions.
// ---------------------------------------------------------------------------

const AI_HITS_KEY = "programo:ai-crawlers:";

export async function recordAiCrawlerHit(
  bot: string,
  path: string,
  isoDate: string,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const key = AI_HITS_KEY + isoDate.slice(0, 10);
    const pipe = redis.multi();
    pipe.hincrby(key, bot, 1);
    pipe.hincrby(key, `${bot}|${path}`.slice(0, 200), 1);
    pipe.expire(key, DAILY_TTL_SECONDS);
    await pipe.exec();
  } catch (e) {
    console.error("[analytics] recordAiCrawlerHit failed:", e);
  }
}

/** AI-crawler hit counts for the last `days` days, oldest first. */
export async function getAiCrawlerHits(
  days = 30,
  today = new Date(),
): Promise<{ date: string; counts: Record<string, number> }[]> {
  const redis = getRedis();
  if (!redis) return [];
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(new Date(today.getTime() - i * 86_400_000).toISOString().slice(0, 10));
  }
  try {
    const results = await Promise.all(
      dates.map((d) => redis.hgetall<Record<string, string | number>>(AI_HITS_KEY + d)),
    );
    return dates.map((date, i) => {
      const raw = results[i] ?? {};
      const counts: Record<string, number> = {};
      for (const [k, v] of Object.entries(raw)) {
        const n = typeof v === "number" ? v : parseInt(String(v), 10);
        if (Number.isFinite(n)) counts[k] = n;
      }
      return { date, counts };
    });
  } catch (e) {
    console.error("[analytics] getAiCrawlerHits failed:", e);
    return [];
  }
}
