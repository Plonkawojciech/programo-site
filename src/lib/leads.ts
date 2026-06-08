import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Lead store — Upstash Redis (best-effort).
//
// Leads from the contact form are pushed onto a capped Redis list so the
// internal CRM at /crm has data to show. Storage is BEST-EFFORT: if Redis is
// not configured (no env) or is down, storeLead() silently no-ops so the
// contact form (email/Telegram) never breaks.
// ---------------------------------------------------------------------------

const LEADS_KEY = "programo:leads";
const MAX_LEADS = 500;

export type Lead = {
  id: string;
  ts: string; // ISO timestamp — passed in by the caller (never Date.now at module load)
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  projectType: string;
  budget: string;
  consentTimestamp: string;
  // Ad attribution
  gclid: string;
  gbraid: string;
  wbraid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  landing_page: string;
  referrer: string;
  first_seen: string;
};

/**
 * Build an Upstash Redis client from env. Supports either var pair:
 *  - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *  - KV_REST_API_URL        + KV_REST_API_TOKEN  (Vercel KV naming)
 * Returns null if neither pair is configured.
 */
export function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

/** Whether a lead store is configured (for friendly UI messaging). */
export function isLeadStoreConfigured(): boolean {
  return getRedis() !== null;
}

/**
 * Persist a lead. Best-effort: swallows all errors, never throws.
 * No-ops if Redis is not configured.
 */
export async function storeLead(lead: Lead): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.lpush(LEADS_KEY, JSON.stringify(lead));
    await redis.ltrim(LEADS_KEY, 0, MAX_LEADS - 1);
  } catch (e) {
    // Best-effort — never let lead storage affect the request.
    console.error("[leads] storeLead failed:", e);
  }
}

/**
 * Fetch the most recent leads (newest first). Returns [] if no Redis or on error.
 */
export async function getLeads(limit = 200): Promise<Lead[]> {
  const redis = getRedis();
  if (!redis) return [];

  try {
    const rows = await redis.lrange<string | Lead>(LEADS_KEY, 0, limit - 1);
    const leads: Lead[] = [];
    for (const row of rows) {
      try {
        // Upstash may auto-deserialize JSON strings into objects.
        const lead = typeof row === "string" ? (JSON.parse(row) as Lead) : row;
        if (lead && typeof lead === "object") leads.push(lead as Lead);
      } catch {
        // Skip unparseable entries.
      }
    }
    return leads;
  } catch (e) {
    console.error("[leads] getLeads failed:", e);
    return [];
  }
}
