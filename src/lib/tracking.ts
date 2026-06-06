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

function trackAdsConversion(): void {
  gtag("event", "conversion", {
    send_to: ADS_CONVERSION_LEAD,
    value: 1.0,
    currency: "PLN",
  });
}

/** GA4 lead conversion event + Google Ads conversion. `form` identifies the source form. */
export function trackLead(detail: { form: string; method?: string }): void {
  const attr = getAttribution();
  gtag("event", "generate_lead", {
    form_location: detail.form,
    method: detail.method,
    lead_source: attr.utm_source || (attr.gclid ? "google_ads" : "direct"),
    campaign: attr.utm_campaign,
    gclid: attr.gclid,
  });
  trackAdsConversion();
}

/** GA4 event for clicks on phone / email links anywhere on the site, + Google Ads conversion. */
export function trackContactClick(method: "phone" | "email", url: string): void {
  gtag("event", "contact_click", { method, link_url: url });
  trackAdsConversion();
}
