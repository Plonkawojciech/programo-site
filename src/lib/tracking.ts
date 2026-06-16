// Client-side attribution + GA4 event helpers.
//
// - Captures Google Ads click IDs (gclid/gbraid/wbraid) and UTM params on landing
//   and persists them, so a lead submitted on a *different* page still carries its
//   ad source. We can then tell which keyword/campaign produced each lead.
// - Fires GA4 events (generate_lead, contact_click). Consent Mode v2 (set in
//   layout.tsx) governs how the data is stored/used, so events are sent
//   unconditionally and modeled correctly when consent is denied.

export type Attribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
};

const STORAGE_KEY = "programo-attribution";

const PARAM_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof fn === "function") fn(...args);
}

function safeParse(raw: string): Attribution {
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? (obj as Attribution) : {};
  } catch {
    return {};
  }
}

/**
 * Read campaign params from the current URL and persist them. Overwrites stored
 * attribution only when a NEW campaign/click id is present (latest ad click wins);
 * otherwise leaves the existing touch intact. Safe to call on every page mount.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const incoming: Attribution = {};
    let hasCampaign = false;
    for (const key of PARAM_KEYS) {
      const val = params.get(key);
      if (val) {
        incoming[key] = val.slice(0, 300);
        hasCampaign = true;
      }
    }
    if (!hasCampaign) return; // organic / internal navigation — keep existing

    const prevRaw = window.localStorage.getItem(STORAGE_KEY);
    const prev: Attribution = prevRaw ? safeParse(prevRaw) : {};

    const next: Attribution = {
      ...incoming,
      landing_page: window.location.pathname,
      referrer: document.referrer || prev.referrer || "",
      first_seen: prev.first_seen || new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore storage/parse errors */
  }
}

/** Returns the stored attribution (after syncing any params still in the URL). */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    captureAttribution();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? safeParse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Google Ads conversion: "Przesłanie formularza kontaktowego" (lead).
 * Account 561-045-3845. Fires only after marketing consent (Consent Mode v2).
 */
const ADS_CONVERSION_LEAD = "AW-18196600478/tYIqCM3A_rkcEJ6t6ORD";

// Estimated value of one lead, in PLN. This is a Smart Bidding signal, NOT a
// reported statistic: a conservative expected value (avg project ≈ kilka tys. zł
// × niska szansa zamknięcia). Required on the GA4 generate_lead event since the
// April 2026 GA4 change — without value+currency the event silently fails to
// qualify as a conversion. Adjust as close-rate data accumulates.
const LEAD_VALUE_PLN = 500;

function trackAdsConversion(): void {
  gtag("event", "conversion", {
    send_to: ADS_CONVERSION_LEAD,
    value: LEAD_VALUE_PLN,
    currency: "PLN",
  });
}

// Once-per-session guard for the Google Ads "Lead" conversion. Multiple lead
// forms can live on one page (e.g. the compact catcher + the full QuickContact);
// the same person submitting both must NOT double-count the Ads conversion or it
// poisons Smart Bidding. GA4 generate_lead still fires every time (with a
// `duplicate` flag) so analytics keep full fidelity. NOTE: the Ads conversion
// action should also be set to count "One" in the panel as a second line of defence.
const ADS_LEAD_FIRED_KEY = "programo-lead-fired";

function hasAdsLeadFired(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(ADS_LEAD_FIRED_KEY) === "1";
  } catch {
    return false;
  }
}

function markAdsLeadFired(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ADS_LEAD_FIRED_KEY, "1");
  } catch {
    /* ignore storage errors */
  }
}

/**
 * GA4 lead conversion event + Google Ads "Lead" conversion. `form` identifies the source form.
 *
 * Form submit = primary Google Ads Lead conversion. Phone/email clicks = GA4-only secondary
 * signal; a dedicated Ads call-click conversion action can be added later. The Ads conversion
 * fires at most once per browser session; GA4 generate_lead fires on every submit.
 */
/** True only if the visitor granted MARKETING consent (Consent Mode v2). */
function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const s = window.localStorage.getItem("programo-consent-v1");
    if (!s) return false;
    const c = JSON.parse(s);
    return !!(c && c.marketing);
  } catch {
    return false;
  }
}

function normEmail(e?: string): string | undefined {
  if (!e) return undefined;
  const v = e.trim().toLowerCase();
  return v.includes("@") && v.length <= 320 ? v : undefined;
}

/** Normalize a PL/intl phone to E.164 (best-effort) for Enhanced Conversions. */
function normPhone(p?: string): string | undefined {
  if (!p) return undefined;
  let d = p.replace(/[^\d+]/g, "");
  if (d.startsWith("00")) d = "+" + d.slice(2);
  if (d.startsWith("+")) return d.length >= 10 ? d : undefined;
  if (d.length === 9) return "+48" + d; // bare PL national number
  if (d.startsWith("48") && d.length === 11) return "+" + d;
  return d.length >= 10 ? "+" + d : undefined;
}

/**
 * Enhanced Conversions for Leads — provide user-provided data so Google Ads can
 * match the lead to the ad click even with cookies denied. gtag hashes it
 * (SHA-256) before transmission. RODO: only sent when MARKETING consent is
 * granted; otherwise we send nothing.
 */
function setEnhancedUserData(email?: string, phone?: string): void {
  if (!hasMarketingConsent()) return;
  const ud: Record<string, string> = {};
  const e = normEmail(email);
  if (e) ud.email = e;
  const ph = normPhone(phone);
  if (ph) ud.phone_number = ph;
  if (Object.keys(ud).length === 0) return;
  gtag("set", "user_data", ud);
}

export function trackLead(detail: {
  form: string;
  method?: string;
  email?: string;
  phone?: string;
}): void {
  const attr = getAttribution();
  const duplicate = hasAdsLeadFired();
  // value + currency are REQUIRED for generate_lead to count as a GA4 key event
  // (GA4 change, April 2026). Without them the event is silently dropped from
  // conversion counting — a primary cause of the historical "0 konwersji".
  gtag("event", "generate_lead", {
    form_location: detail.form,
    method: detail.method,
    lead_source: attr.utm_source || (attr.gclid ? "google_ads" : "direct"),
    campaign: attr.utm_campaign,
    gclid: attr.gclid,
    value: LEAD_VALUE_PLN,
    currency: "PLN",
    duplicate,
  });
  if (!duplicate) {
    // Enhanced Conversions for Leads (set on the Ads side as "Zarządzane za
    // pomocą tagu Google") — attach hashed user data before the conversion.
    setEnhancedUserData(detail.email, detail.phone);
    trackAdsConversion();
    markAdsLeadFired();
  } else if (process.env.NODE_ENV !== "production") {
    // Manual-test aid: a second submit in the same browser session intentionally
    // skips the Ads conversion (once-per-session guard). Without this note it
    // looks like a tracking failure. Test the Ads conversion in incognito / a
    // fresh tab to fire it again.
    console.info(
      "[tracking] Ads lead conversion skipped (duplicate within session). " +
        "Use a fresh tab/incognito to re-fire."
    );
  }
}

/**
 * GA4 event for clicks on phone / email links anywhere on the site.
 *
 * Form submit = primary Google Ads Lead conversion. Phone/email clicks = GA4-only secondary
 * signal; a dedicated Ads call-click conversion action can be added later. Deliberately does
 * NOT fire the Google Ads "Lead" conversion label so the primary lead signal stays clean.
 */
export function trackContactClick(method: "phone" | "email", url: string): void {
  gtag("event", "contact_click", { method, link_url: url });
}
