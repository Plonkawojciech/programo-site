// Contract + guards for /api/collect. Lives outside the route module because an
// App Router route may only export handlers (see lib/contact-schema.ts).

import { z } from "zod/v4";
import { EVENTS } from "./events";

/** Only names declared in the taxonomy are accepted — no free-form events. */
const KNOWN_EVENT_NAMES: Set<string> = new Set(
  Object.values(EVENTS).map((e) => e.name as string),
);

const paramValue = z.union([z.string().max(500), z.number(), z.boolean(), z.null()]);

/**
 * Paths are used as Redis hash field names in the daily rollups, so an
 * unconstrained string is an unbounded-growth vector: a script can mint a
 * million distinct 500-character paths and inflate the day's hash without ever
 * tripping the event-name whitelist. Real routes are short and boring.
 */
const pathSchema = z
  .string()
  .max(120)
  .regex(/^\/[a-zA-Z0-9\-_/]*$/, "path must be a plain route");

/**
 * Client clocks lie, and `ts` orders the session list in the dashboard — an
 * unbounded value pins a fabricated session to the top forever. Anything more
 * than a day out is not a clock skew, it is noise.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const tsSchema = z
  .number()
  .int()
  .refine((t) => Math.abs(t - Date.now()) <= DAY_MS, "timestamp out of range");

const eventSchema = z.object({
  event: z.string().max(40).refine((n) => KNOWN_EVENT_NAMES.has(n), {
    message: "unknown event name",
  }),
  event_id: z.string().max(100),
  ts: tsSchema,
  path: pathSchema,
  params: z.record(z.string().max(60), paramValue).optional(),
});

export const collectSchema = z.object({
  visitor_id: z.string().max(100),
  session_id: z.string().max(100),
  session_number: z.number().int().min(0).max(100000).optional(),
  page_views: z.number().int().min(0).max(100000).optional(),
  tz_offset: z.number().int().min(-900).max(900).optional(),
  screen: z.string().max(20).optional(),
  viewport: z.string().max(20).optional(),
  language: z.string().max(20).optional(),
  attribution: z.record(z.string().max(60), paramValue.optional()).optional(),
  // Matches MAX_BATCH in analytics/client.ts, with headroom.
  events: z.array(eventSchema).min(1).max(50),
});

export type CollectPayload = z.infer<typeof collectSchema>;

// ------------------------------------------------------------- UA inspection

const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|headless|phantomjs|puppeteer|playwright|lighthouse|pagespeed|gtmetrix|curl\/|wget|python-requests|axios\/|go-http-client|java\/|scrapy|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|facebookexternalhit|preview/i;

/** Cheap first-pass bot filter. Not security — just keeps the store readable. */
export function isLikelyBot(ua: string): boolean {
  if (!ua) return true; // real browsers always send one
  return BOT_PATTERN.test(ua);
}

export type AgentInfo = { device: string; browser: string; os: string };

/**
 * Minimal UA parsing. Deliberately not a library: we need four buckets for
 * segmentation, not a fingerprint, and a UA database is a dependency that ages
 * badly.
 */
export function parseUserAgent(ua: string): AgentInfo {
  const s = ua.toLowerCase();

  const device = /ipad|tablet|playbook|silk/.test(s)
    ? "tablet"
    : /mobi|iphone|ipod|android.*mobile|windows phone/.test(s)
      ? "mobile"
      : "desktop";

  const os = /windows nt/.test(s)
    ? "Windows"
    : /iphone|ipad|ipod|ios/.test(s)
      ? "iOS"
      : /mac os x/.test(s)
        ? "macOS"
        : /android/.test(s)
          ? "Android"
          : /linux/.test(s)
            ? "Linux"
            : "other";

  // Order matters: Edge and Opera both claim Chrome, Chrome claims Safari.
  const browser = /edg\//.test(s)
    ? "Edge"
    : /opr\/|opera/.test(s)
      ? "Opera"
      : /samsungbrowser/.test(s)
        ? "Samsung Internet"
        : /firefox\/|fxios/.test(s)
          ? "Firefox"
          : /chrome\/|crios/.test(s)
            ? "Chrome"
            : /safari\//.test(s)
              ? "Safari"
              : "other";

  return { device, browser, os };
}
