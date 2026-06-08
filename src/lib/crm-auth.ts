import crypto from "node:crypto";
import type { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// CRM auth — simple but real.
//
// Credentials live in env (NEVER hardcoded):
//   CRM_EMAIL    — expected biuro@programo.pl
//   CRM_PASSWORD — the shared founder password
//
// The session cookie holds an HMAC-SHA256 of a fixed message keyed by
// CRM_PASSWORD. Changing CRM_PASSWORD invalidates all old sessions (acceptable
// for a 2-founder internal tool). If CRM_PASSWORD is unset, auth always fails
// (no insecure default).
// ---------------------------------------------------------------------------

export const CRM_COOKIE = "crm_session";
const SESSION_MESSAGE = "programo-crm-v1";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/** Timing-safe string equality (length-independent). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // Compare equal-length digests to avoid leaking length; hash both first.
  const ah = crypto.createHash("sha256").update(ab).digest();
  const bh = crypto.createHash("sha256").update(bb).digest();
  return crypto.timingSafeEqual(ah, bh);
}

/**
 * Verify login credentials against env. Email is case-insensitive + trimmed.
 * Returns false if CRM_PASSWORD is unset (no insecure default).
 */
export function verifyCreds(email: string, password: string): boolean {
  const expectedEmail = process.env.CRM_EMAIL;
  const expectedPassword = process.env.CRM_PASSWORD;

  if (!expectedPassword) return false; // never allow login without a configured secret

  const emailOk = expectedEmail
    ? safeEqual(
        (email || "").trim().toLowerCase(),
        expectedEmail.trim().toLowerCase()
      )
    : true; // if CRM_EMAIL unset, only the password gates access

  const passwordOk = safeEqual(password || "", expectedPassword);

  return emailOk && passwordOk;
}

/** Compute the session token = HMAC-SHA256(SESSION_MESSAGE, key=CRM_PASSWORD). */
export function sessionToken(): string {
  const key = process.env.CRM_PASSWORD;
  if (!key) return "";
  return crypto.createHmac("sha256", key).update(SESSION_MESSAGE).digest("hex");
}

/** Verify a session token, timing-safe, against the freshly recomputed value. */
export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = sessionToken();
  if (!expected) return false; // CRM_PASSWORD unset → always invalid
  return safeEqual(token, expected);
}

/** Attach the httpOnly session cookie to a response. */
export function setSessionCookie(res: NextResponse): void {
  res.cookies.set(CRM_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Clear the session cookie on a response. */
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(CRM_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
