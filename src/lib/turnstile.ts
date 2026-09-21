/**
 * Cloudflare Turnstile — server-side half. The browser half lives in
 * src/components/ui/turnstile.tsx; both are no-ops until BOTH env vars are set:
 *
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  — public, ships in the page, renders the widget
 *   TURNSTILE_SECRET_KEY            — server only, used here to verify tokens
 *
 * Enforcement is gated on the pair, not on the secret alone: a secret without
 * a site key would make the server demand a token the page never renders, and
 * every form on the site would 403 at once. Setting one var by mistake must
 * not be able to take the lead pipeline down.
 *
 * Added 2026-09-21 because the forms were collecting junk submissions faster
 * than real leads. Turnstile was chosen over reCAPTCHA because it needs no
 * cookie consent tie-in (no tracking, no ad-profile side channel) and the
 * managed mode almost never shows a puzzle to a real visitor.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Keep in sync with the timeout the forms tolerate on /api/contact. */
const SITEVERIFY_TIMEOUT_MS = 5_000;

export function isTurnstileEnforced(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}

export type TurnstileVerdict =
  | { ok: true }
  | { ok: false; reason: "missing" | "rejected" };

/**
 * Verifies a token the browser widget produced. Tokens are single-use and
 * expire after 300 s, so the client resets its widget after every submit.
 *
 * Fails OPEN on transport errors (Cloudflare unreachable, 5xx, timeout) and
 * CLOSED on an explicit `success: false`. A visitor cannot trigger the
 * transport path from outside, so it is not a bypass — while a Cloudflare
 * outage that silently dropped every real lead for an hour would cost more
 * than the spam it let through. Flip `TRANSPORT_FAILURE_VERDICT` to fail
 * closed if that trade-off ever changes.
 */
const TRANSPORT_FAILURE_VERDICT: TurnstileVerdict = { ok: true };

export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<TurnstileVerdict> {
  if (!isTurnstileEnforced()) return { ok: true };
  if (!token) return { ok: false, reason: "missing" };

  const body: Record<string, string> = {
    secret: process.env.TURNSTILE_SECRET_KEY as string,
    response: token,
  };
  // The IP is optional and only tightens the check; "unknown" would be sent
  // as a literal string and rejected as malformed.
  if (ip && ip !== "unknown") body.remoteip = ip;

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[turnstile] siteverify HTTP ${res.status} — failing open`);
      return TRANSPORT_FAILURE_VERDICT;
    }
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success === true) return { ok: true };
    console.warn("[turnstile] rejected:", data["error-codes"] ?? []);
    return { ok: false, reason: "rejected" };
  } catch (e) {
    console.error("[turnstile] siteverify unreachable — failing open:", e);
    return TRANSPORT_FAILURE_VERDICT;
  }
}
