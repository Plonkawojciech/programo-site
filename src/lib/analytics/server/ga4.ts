// GA4 Measurement Protocol — server-side conversion signal.
//
// Purpose and its limits, stated plainly:
//
//  - This does NOT rescue events from ad blockers. The client_id comes from
//    gtag; if gtag was blocked there is no id, and an event without one lands as
//    a brand-new anonymous user with no attribution. We skip those on purpose.
//  - What it DOES buy: the event survives the visitor closing the tab mid-submit,
//    it is only sent after the server has accepted the lead (so form spam never
//    inflates conversions), and it opens the door to later CRM-side events.
//
// Deduplication: GA4's Measurement Protocol has no generic dedup mechanism
// (only `transaction_id` on `purchase`). Sending the same event name from both
// browser and server would therefore double-count. The server deliberately uses
// a DIFFERENT event name — `generate_lead_verified` — which is a separate,
// server-truth metric rather than a duplicate of the client's `generate_lead`.

const EU_ENDPOINT = "https://region1.google-analytics.com/mp/collect";
const DEBUG_ENDPOINT = "https://www.google-analytics.com/debug/mp/collect";

export type Ga4ServerEvent = {
  name: string;
  params: Record<string, string | number | boolean | undefined>;
};

export type Ga4SendInput = {
  clientId?: string;
  sessionId?: string;
  events: Ga4ServerEvent[];
  /** Sends to the validation endpoint and logs the result instead of reporting. */
  debug?: boolean;
};

export type Ga4SendResult =
  | { ok: true; skipped?: false; status: number }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; status: number; error?: string };

function config(): { measurementId: string; apiSecret: string } | null {
  const measurementId = process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA4_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return null;
  return { measurementId, apiSecret };
}

/** True when the Measurement Protocol is configured and will actually send. */
export function isGa4ServerConfigured(): boolean {
  return config() !== null;
}

/**
 * Sends events to GA4 server-side.
 *
 * Every event gets `engagement_time_msec` — without it GA4 drops the event from
 * several reports and never counts the session as engaged. `session_id` must be
 * the real one read from gtag on the client, or the hit reports as
 * `(not set) / (not set)` instead of joining the visitor's real session.
 */
export async function sendGa4ServerEvents(input: Ga4SendInput): Promise<Ga4SendResult> {
  const cfg = config();
  if (!cfg) return { ok: false, skipped: true, reason: "not_configured" };
  if (!input.clientId) {
    // Without the browser's client_id the hit cannot be joined to the visit.
    // A detached, attribution-less conversion is worse than no conversion.
    return { ok: false, skipped: true, reason: "no_client_id" };
  }

  const payload = {
    client_id: input.clientId,
    timestamp_micros: String(Date.now() * 1000), // must be within 72 h
    events: input.events.slice(0, 25).map((e) => ({
      name: e.name,
      params: {
        ...(input.sessionId ? { session_id: input.sessionId } : {}),
        engagement_time_msec: 1,
        ...clean(e.params),
      },
    })),
  };

  const base = input.debug ? DEBUG_ENDPOINT : EU_ENDPOINT;
  const url = `${base}?measurement_id=${encodeURIComponent(cfg.measurementId)}&api_secret=${encodeURIComponent(cfg.apiSecret)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    if (input.debug) {
      // The production endpoint returns 2xx for malformed payloads too; only
      // the debug endpoint actually validates.
      const text = await res.text().catch(() => "");
      console.log(`[ga4-mp] debug validation: ${text}`);
    }

    if (!res.ok) {
      return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    }
    console.log(
      `[ga4-mp] sent ${payload.events.length} event(s): ${payload.events.map((e) => e.name).join(", ")}`,
    );
    return { ok: true, status: res.status };
  } catch (e) {
    console.error("[ga4-mp] send failed:", e);
    return { ok: false, status: 0, error: String(e) };
  }
}

function clean(
  params: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    // MP truncates parameter values at 100 characters.
    out[k] = typeof v === "string" ? v.slice(0, 100) : v;
  }
  return out;
}

/**
 * The server's own record that a lead passed validation and was delivered.
 * Named differently from the client's `generate_lead` on purpose — see the
 * deduplication note at the top of this file.
 */
export async function sendVerifiedLead(input: {
  clientId?: string;
  sessionId?: string;
  leadId: string;
  value: number;
  formId?: string;
  leadSource?: string;
  channel?: string;
}): Promise<Ga4SendResult> {
  return sendGa4ServerEvents({
    clientId: input.clientId,
    sessionId: input.sessionId,
    events: [
      {
        name: "generate_lead_verified",
        params: {
          currency: "PLN",
          value: input.value,
          lead_id: input.leadId,
          form_id: input.formId,
          lead_source: input.leadSource,
          channel: input.channel,
        },
      },
    ],
  });
}
