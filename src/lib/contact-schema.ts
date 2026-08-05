// Request contract + helpers for /api/contact.
//
// These live outside the route file on purpose: a Next.js App Router route
// module may only export route handlers and a small set of config keys, so
// exporting the schema from route.ts fails `next build`'s generated type check.
// The tests import from here.

import { z } from "zod/v4";

// A phone number with enough digits to actually dial is a complete lead on its
// own — the homepage hero asks for a number first and treats every other field
// as a bonus. Below this threshold the normal rules apply.
const PHONE_MIN_DIGITS = 9;

export const contactSchema = z
  .object({
    // Required in practice, but enforced in the superRefine below so it can be
    // waived for a dialable phone. See the `name` rule at the bottom.
    name: z.string().max(120, "Name too long").optional().or(z.literal("")),
    email: z.string().email("Nieprawidłowy adres email").optional().or(z.literal("")),
    phone: z.string().max(30, "Phone too long").optional().or(z.literal("")),
    subject: z
      .enum(["Współpraca", "Wycena projektu", "Pytanie techniczne", "Inne"])
      .optional()
      .default("Inne"),
    message: z
      .string()
      .max(2000, "Message must be at most 2000 characters")
      .optional()
      .or(z.literal("")),
    // Lead qualification (chips on the form) — optional
    projectType: z.string().max(60).optional().or(z.literal("")),
    budget: z.string().max(60).optional().or(z.literal("")),
    consent: z.literal(true, { message: "Consent is required" }),
    consentTimestamp: z.string().datetime().optional(),
    // Ad attribution (captured client-side) — all optional
    gclid: z.string().max(300).optional(),
    gbraid: z.string().max(300).optional(),
    wbraid: z.string().max(300).optional(),
    // Non-Google click ids, needed for Meta CAPI / Microsoft offline conversions
    fbclid: z.string().max(300).optional(),
    msclkid: z.string().max(300).optional(),
    ttclid: z.string().max(300).optional(),
    li_fat_id: z.string().max(300).optional(),
    twclid: z.string().max(300).optional(),
    utm_source: z.string().max(300).optional(),
    utm_medium: z.string().max(300).optional(),
    utm_campaign: z.string().max(300).optional(),
    utm_term: z.string().max(300).optional(),
    utm_content: z.string().max(300).optional(),
    utm_id: z.string().max(300).optional(),
    landing_page: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
    referrer_class: z.string().max(40).optional(),
    referrer_host: z.string().max(255).optional(),
    ai_source: z.string().max(80).optional(),
    first_seen: z.string().max(40).optional(),
    // First-touch summary — which channel originally found us
    first_source: z.string().max(300).optional(),
    first_referrer_class: z.string().max(40).optional(),
    visits: z.number().int().min(0).max(100000).optional(),
    // Conversion plumbing: shared id for pixel/CAPI dedup + Meta browser cookies
    // + GA4's real ids, so the server-side twin joins this visit instead of
    // inventing a new user.
    event_id: z.string().max(100).optional(),
    visitor_id: z.string().max(100).optional(),
    session_id: z.string().max(100).optional(),
    fbc: z.string().max(300).optional(),
    fbp: z.string().max(300).optional(),
    ga_client_id: z.string().max(100).optional(),
    ga_session_id: z.string().max(100).optional(),
    page_url: z.string().max(1000).optional(),
    form_id: z.string().max(80).optional(),
  })
  .refine(
    (d) => Boolean((d.email && d.email.length) || (d.phone && d.phone.length)),
    { message: "Podaj e-mail lub numer telefonu.", path: ["email"] },
  )
  .superRefine((d, ctx) => {
    // A dialable phone is a complete lead on its own, so the name becomes a
    // bonus. Everything else stays exactly as it was: this rule only ever
    // widens what the endpoint accepts, never narrows it.
    const digits = (d.phone ?? "").replace(/\D/g, "");
    if (digits.length >= PHONE_MIN_DIGITS) return;
    if (!d.name?.trim()) {
      ctx.addIssue({ code: "custom", path: ["name"], message: "Name is required" });
    }
  });

export type ContactPayload = z.infer<typeof contactSchema>;

// In-memory rate limiter: IP -> timestamps[]
export const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT) {
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

/** Escapes HTML so a submitted value can never inject markup into the e-mail. */
export function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
