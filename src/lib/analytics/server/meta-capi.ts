// Meta Conversions API — the server-side half of the Meta conversion signal.
//
// Why both pixel and CAPI: the browser pixel is blocked by ad blockers, ITP and
// flaky networks; the server hit always lands. Meta collapses the two into one
// event when `event_id` + `event_name` match (48 h window), so the pair
// increases coverage without double-counting.
//
// RODO: this fires ONLY when the visitor granted marketing consent, verified
// server-side from the consent cookie — never from a flag in the request body,
// which is a claim by the client rather than evidence. Reading `_fbp`/`_fbc`
// is itself access to information stored on the visitor's device, so a
// "server-side therefore exempt" reading does not hold in the EEA.
//
// Terminology: Meta renamed "Pixel" to "Dataset" in Events Manager. The number
// is the same one `fbq('init', ...)` takes.

const GRAPH_VERSION = "v25.0";

/** Meta standard events we send. Kept as a union so pixel and CAPI cannot drift. */
export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "Contact"
  | "Lead"
  | "Schedule"
  | "CompleteRegistration"
  | "SubmitApplication"
  | "InitiateCheckout";

export type MetaUserInput = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  zip?: string | null;
  /** Our own stable visitor id. Meta recommends sending it alongside event_id. */
  externalId?: string | null;
  // --- never hashed ---
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
};

export type MetaEventInput = {
  eventName: MetaEventName;
  /** Must be byte-identical to the browser pixel's eventID. */
  eventId: string;
  /** Unix SECONDS (not ms). Meta rejects the whole request if older than 7 days. */
  eventTime?: number;
  eventSourceUrl: string;
  user: MetaUserInput;
  customData?: Record<string, unknown>;
};

export type CapiResult =
  | { ok: true; eventsReceived: number; fbtraceId?: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; status: number; body: string };

// ------------------------------------------------------------- normalisation

/** SHA-256 hex via Web Crypto — available in both node and edge runtimes. */
async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normEmail(v?: string | null): string | undefined {
  const s = v?.trim().toLowerCase();
  return s && s.includes("@") ? s : undefined;
}

/**
 * Meta's phone rule: digits only, no leading zeros, country code REQUIRED.
 *
 * Note this is deliberately NOT the same normalisation as the one used for
 * Google Enhanced Conversions, which wants E.164 *with* the leading "+".
 * Sending Google's format here silently lowers the match rate.
 *   "+48 601 234 567" → "48601234567"
 *   "0048601234567"   → "48601234567"
 *   "601 234 567"     → "48601234567"  (bare Polish national number)
 */
export function normPhonePl(v?: string | null): string | undefined {
  if (!v) return undefined;
  let d = v.replace(/\D/g, "").replace(/^0+/, "");
  if (d.length === 9) d = `48${d}`;
  return d.length >= 10 && d.length <= 15 ? d : undefined;
}

/**
 * Names: lowercase, punctuation stripped. Polish diacritics are KEPT — Meta's
 * spec says special characters must be UTF-8 encoded, not transliterated, so
 * "łukasz" must not become "lukasz".
 */
export function normName(v?: string | null): string | undefined {
  const s = v
    ?.trim()
    .toLowerCase()
    .replace(/[.,'"`^~()\-_]/g, "")
    .replace(/\s+/g, " ");
  return s || undefined;
}

/** City: lowercase, no punctuation AND no spaces ("Nowy Sącz" → "nowysącz"). */
export function normCity(v?: string | null): string | undefined {
  const s = v?.trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  return s || undefined;
}

/** Postcode: lowercase, no spaces or dashes ("61-001" → "61001"). */
export function normZip(v?: string | null): string | undefined {
  const s = v?.trim().toLowerCase().replace(/[\s-]/g, "");
  return s || undefined;
}

async function buildUserData(u: MetaUserInput): Promise<Record<string, unknown>> {
  const hash = async (v?: string) => (v ? [await sha256Hex(v)] : undefined);

  const ud: Record<string, unknown> = {
    em: await hash(normEmail(u.email)),
    ph: await hash(normPhonePl(u.phone)),
    fn: await hash(normName(u.firstName)),
    ln: await hash(normName(u.lastName)),
    ct: await hash(normCity(u.city)),
    zp: await hash(normZip(u.zip)),
    country: await hash("pl"),
    external_id: await hash(u.externalId ?? undefined),
    // Hashing any of the four below destroys matching outright — Meta expects
    // them in the clear. This is the single most common CAPI mistake.
    client_ip_address: u.clientIpAddress,
    client_user_agent: u.clientUserAgent,
    fbc: u.fbc,
    fbp: u.fbp,
  };

  return Object.fromEntries(Object.entries(ud).filter(([, v]) => v !== undefined));
}

// -------------------------------------------------------------------- sending

export function isMetaCapiConfigured(): boolean {
  return Boolean(process.env.META_DATASET_ID && process.env.META_CAPI_ACCESS_TOKEN);
}

export async function sendMetaEvent(input: MetaEventInput): Promise<CapiResult> {
  const datasetId = process.env.META_DATASET_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  // Only ever set in dev/staging. Meta requires it for events to show up in
  // Test Events, and requires it ABSENT on production payloads.
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!datasetId || !accessToken) {
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: String(input.eventId), // must be a string, not a number
        event_source_url: input.eventSourceUrl,
        action_source: "website" as const,
        user_data: await buildUserData(input.user),
        ...(input.customData ? { custom_data: input.customData } : {}),
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${datasetId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(1500), // Meta's own recommendation
    });

    const body = await res.text();
    if (!res.ok) {
      console.error(`[meta-capi] ${input.eventName} FAILED http=${res.status} body=${body}`);
      return { ok: false, status: res.status, body };
    }

    const json = JSON.parse(body) as {
      events_received?: number;
      messages?: unknown[];
      fbtrace_id?: string;
    };
    // A non-empty `messages` array is a warning worth reading even on 200.
    const warn = json.messages?.length ? ` messages=${JSON.stringify(json.messages)}` : "";
    console.log(
      `[meta-capi] ${input.eventName} ok received=${json.events_received} event_id=${input.eventId} fbtrace=${json.fbtrace_id}${warn}`,
    );
    return { ok: true, eventsReceived: json.events_received ?? 0, fbtraceId: json.fbtrace_id };
  } catch (e) {
    console.error(`[meta-capi] ${input.eventName} exception:`, e);
    return { ok: false, status: 0, body: String(e) };
  }
}

// ------------------------------------------------------------------- helpers

/**
 * Rebuilds Meta's `fbc` value from an `fbclid` in the landing URL when the
 * pixel never got to write the `_fbc` cookie (e.g. the visitor accepted the
 * consent banner after landing). Format is fixed by Meta:
 * `fb.<subdomainIndex>.<creationTimeMs>.<fbclid>` — index 1 for a cookie on the
 * registrable domain, and the timestamp is in MILLISECONDS, unlike event_time.
 */
export function buildFbcFromUrl(pageUrl: string, firstSeenMs = Date.now()): string | undefined {
  try {
    const fbclid = new URL(pageUrl).searchParams.get("fbclid");
    return fbclid ? `fb.1.${firstSeenMs}.${fbclid}` : undefined;
  } catch {
    return undefined;
  }
}

export type Consent = { analytics: boolean; marketing: boolean };

/**
 * Reads the consent decision from our first-party cookie. Absent or unparseable
 * cookie means no consent — fail closed, always.
 */
export function readConsentCookie(raw?: string): Consent {
  if (!raw) return { analytics: false, marketing: false };
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Consent>;
    return { analytics: parsed.analytics === true, marketing: parsed.marketing === true };
  } catch {
    return { analytics: false, marketing: false };
  }
}
