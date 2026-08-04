// Conversion tracking — Google Ads + GA4 key events.
//
// This module owns the *money* events. Everything behavioural now lives in
// src/lib/analytics/; this file keeps the Google Ads specifics (conversion
// label, lead value, Enhanced Conversions, once-per-session guard) and the
// stable public API the forms and portfolio components already import.
//
// Attribution moved to analytics/attribution.ts, which additionally records
// first-touch and classifies AI/organic/social referrers. Re-exported here so
// existing imports keep working.

import { track, conversionContext, newEventId, flush } from "./analytics/client";
import { getAttribution } from "./analytics/attribution";

export { captureAttribution, getAttribution } from "./analytics/attribution";
export type { Attribution } from "./analytics/attribution";

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof fn === "function") fn(...args);
}

/**
 * Google Ads conversion: "Przesłanie formularza kontaktowego" (lead).
 * Account 561-045-3845. Fires only after marketing consent (Consent Mode v2).
 */
const ADS_CONVERSION_LEAD = "AW-18196600478/tYIqCM3A_rkcEJ6t6ORD";

const GA_MEASUREMENT_ID = "G-KT2R144BYG";

// Estimated value of one lead, in PLN. This is a Smart Bidding signal, NOT a
// reported statistic: a conservative expected value (avg project ≈ kilka tys. zł
// × niska szansa zamknięcia). Required on the GA4 generate_lead event since the
// April 2026 GA4 change — without value+currency the event silently fails to
// qualify as a conversion. Adjust as close-rate data accumulates.
export const LEAD_VALUE_PLN = 500;

function trackAdsConversion(eventId: string): void {
  gtag("event", "conversion", {
    send_to: ADS_CONVERSION_LEAD,
    value: LEAD_VALUE_PLN,
    currency: "PLN",
    // Helps Google Ads collapse a retried submit into a single conversion.
    transaction_id: eventId,
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
export function normPhone(p?: string): string | undefined {
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

/**
 * Everything the server needs to fire the *server-side* twin of this conversion
 * (Meta Conversions API + GA4 Measurement Protocol) and have it deduplicate
 * against the browser-side hit.
 *
 * Call this BEFORE posting the form, then pass the returned `event_id` into
 * trackLead() so the Meta Pixel fires with the identical id. Meta collapses a
 * browser event and a server event into one when `event_id` + `event_name`
 * match (48 h window).
 */
export async function prepareLeadConversion(): Promise<Record<string, string>> {
  const ctx = conversionContext();
  const out: Record<string, string> = {
    event_id: ctx.event_id,
    visitor_id: ctx.visitor_id,
    session_id: ctx.session_id,
    page_url: ctx.page_url,
  };
  if (ctx.fbc) out.fbc = ctx.fbc;
  if (ctx.fbp) out.fbp = ctx.fbp;

  // GA4's real client_id / session_id, read out of the gtag runtime. Without
  // them a Measurement Protocol hit lands as a new, sessionless user reporting
  // as "(not set) / (not set)" — worse than not sending it at all.
  try {
    const { readGa4Ids } = await import("./analytics/client");
    const ids = await readGa4Ids(GA_MEASUREMENT_ID);
    if (ids.client_id) out.ga_client_id = ids.client_id;
    if (ids.session_id) out.ga_session_id = ids.session_id;
  } catch {
    /* gtag blocked — the server skips the MP hit, which is the correct call */
  }
  return out;
}

/**
 * GA4 lead conversion event + Google Ads "Lead" conversion + Meta Pixel `Lead`.
 *
 * Form submit = primary Google Ads Lead conversion. Phone/email clicks = GA4-only
 * secondary signal. The Ads conversion fires at most once per browser session;
 * GA4 generate_lead fires on every submit (flagged `duplicate`).
 */
export function trackLead(detail: {
  form: string;
  method?: string;
  email?: string;
  phone?: string;
  /** From prepareLeadConversion() — keeps browser and server hits deduplicated. */
  eventId?: string;
  /** Seconds from first interaction with the form to submit. */
  seconds?: number;
}): void {
  const attr = getAttribution();
  const duplicate = hasAdsLeadFired();
  const eventId = detail.eventId ?? newEventId();

  // value + currency are REQUIRED for generate_lead to count as a GA4 key event
  // (GA4 change, April 2026). Without them the event is silently dropped from
  // conversion counting — a primary cause of the historical "0 konwersji".
  // track() also mirrors this to the Meta Pixel as a standard `Lead` event
  // carrying the same eventID, which deduplicates it against the CAPI hit.
  track("generate_lead", {
    event_id: eventId,
    form_location: detail.form,
    form_id: detail.form,
    method: detail.method,
    lead_source: attr.utm_source || (attr.gclid ? "google_ads" : "direct"),
    campaign: attr.utm_campaign,
    gclid: attr.gclid,
    referrer_class: attr.last?.referrer_class ?? attr.referrer_class,
    seconds_to_submit: detail.seconds,
    value: LEAD_VALUE_PLN,
    currency: "PLN",
    duplicate,
  });

  if (!duplicate) {
    // Enhanced Conversions for Leads (set on the Ads side as "Zarządzane za
    // pomocą tagu Google") — attach hashed user data before the conversion.
    setEnhancedUserData(detail.email, detail.phone);
    trackAdsConversion(eventId);
    markAdsLeadFired();
  } else if (process.env.NODE_ENV !== "production") {
    // Manual-test aid: a second submit in the same browser session intentionally
    // skips the Ads conversion (once-per-session guard). Without this note it
    // looks like a tracking failure. Test the Ads conversion in incognito / a
    // fresh tab to fire it again.
    console.info(
      "[tracking] Ads lead conversion skipped (duplicate within session). " +
        "Use a fresh tab/incognito to re-fire.",
    );
  }

  // A conversion is often the last thing that happens on the page — do not sit
  // on the batch timer.
  flush(true);
}

/**
 * GA4 event for clicks on phone / email links anywhere on the site.
 *
 * Kept for direct callers; AnalyticsTracker already catches every tel:/mailto:
 * click by delegation, so most code does not need to call this.
 */
export function trackContactClick(method: "phone" | "email", url: string): void {
  track("contact_click", { method, link_url: url });
}

/**
 * GA4 engagement event for clicks on portfolio/project links (cards, "view
 * project", live-site links). Uses the standard `select_content` event so it
 * shows up under recommended events. Not a conversion — pure engagement signal
 * that tells us which projects draw interest.
 */
export function trackPortfolioClick(slug: string, url: string): void {
  track("select_content", {
    content_type: "project",
    content_id: slug,
    link_url: url,
  });
}

/**
 * GA4 scroll-depth signal. Fires `scroll_depth` with the crossed threshold.
 * Deduplication and per-page reset live in AnalyticsTracker.
 */
export function trackScrollDepth(percent: 25 | 50 | 75 | 90 | 100): void {
  track("scroll_depth", { percent });
}
