// Server-side twin of a lead conversion: Meta CAPI + GA4 Measurement Protocol.
//
// Runs AFTER the response has been sent (see `after()` in the contact route), so
// the visitor never waits on a third-party API. Everything here is best-effort
// and can only ever log — a Meta outage must not turn a delivered lead into an
// error the visitor sees.
//
// Consent is checked here, from the cookie, once, for both destinations.

import { sendVerifiedLead } from "./ga4";
import {
  buildFbcFromUrl,
  isMetaCapiConfigured,
  readConsentCookie,
  sendMetaEvent,
} from "./meta-capi";

export type LeadConversionInput = {
  /** Raw value of our consent cookie, straight from the request. */
  consentCookie?: string;
  /** Shared with the browser pixel so Meta deduplicates the pair. */
  eventId?: string;
  leadId: string;
  formId?: string;
  leadValuePln: number;
  email?: string;
  phone?: string;
  fullName?: string;
  pageUrl?: string;
  /** Our own visitor id — Meta recommends external_id alongside event_id. */
  visitorId?: string;
  /** Meta browser cookies, read from the request. */
  fbp?: string;
  fbc?: string;
  /** GA4's real ids, read from gtag on the client. */
  gaClientId?: string;
  gaSessionId?: string;
  clientIp?: string;
  userAgent?: string;
  leadSource?: string;
  channel?: string;
};

/** Splits "Jan Kowalski" into first/last for Meta's fn/ln match keys. */
function splitName(full?: string): { first?: string; last?: string } {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { first: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function dispatchLeadConversions(input: LeadConversionInput): Promise<void> {
  const consent = readConsentCookie(input.consentCookie);

  // --- Meta Conversions API ------------------------------------------------
  // Marketing consent only. Reading _fbp/_fbc is access to information stored
  // on the visitor's device, so "it happens on the server" does not exempt it.
  if (!consent.marketing) {
    console.log(`[lead-conv] Meta CAPI skipped — no marketing consent (lead=${input.leadId})`);
  } else if (!isMetaCapiConfigured()) {
    console.log("[lead-conv] Meta CAPI skipped — META_DATASET_ID / META_CAPI_ACCESS_TOKEN not set");
  } else {
    const { first, last } = splitName(input.fullName);
    await sendMetaEvent({
      eventName: "Lead",
      eventId: input.eventId ?? input.leadId,
      eventSourceUrl: input.pageUrl || "https://programo.pl/kontakt",
      user: {
        email: input.email,
        phone: input.phone,
        firstName: first,
        lastName: last,
        externalId: input.visitorId,
        clientIpAddress: input.clientIp,
        clientUserAgent: input.userAgent,
        fbp: input.fbp,
        fbc: input.fbc ?? (input.pageUrl ? buildFbcFromUrl(input.pageUrl) : undefined),
      },
      customData: {
        value: input.leadValuePln,
        currency: "PLN",
        content_name: input.formId ?? "contact-form",
        content_category: "lead-form",
      },
    }).catch((e) => console.error("[lead-conv] Meta CAPI threw:", e));
  }

  // --- GA4 Measurement Protocol -------------------------------------------
  // Analytics consent, and only when the browser handed us GA4's real ids —
  // without them the hit lands as a new, sessionless user and reports as
  // "(not set)", which is worse than not sending it.
  if (!consent.analytics) {
    console.log(`[lead-conv] GA4 MP skipped — no analytics consent (lead=${input.leadId})`);
  } else {
    const res = await sendVerifiedLead({
      clientId: input.gaClientId,
      sessionId: input.gaSessionId,
      leadId: input.leadId,
      value: input.leadValuePln,
      formId: input.formId,
      leadSource: input.leadSource,
      channel: input.channel,
    }).catch((e) => {
      console.error("[lead-conv] GA4 MP threw:", e);
      return null;
    });
    if (res && "skipped" in res && res.skipped) {
      console.log(`[lead-conv] GA4 MP skipped — ${res.reason} (lead=${input.leadId})`);
    }
  }
}
