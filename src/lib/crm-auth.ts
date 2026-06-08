import crypto from "node:crypto";
import type { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// CRM auth — single-secret, "mega secure".
//
// The GitHub repo is PUBLIC, so NOTHING is hardcoded. The whole scheme is
// driven by exactly one required env var:
//
//   CRM_PASSWORD — the shared founder password (REQUIRED; no insecure default)
//   CRM_EMAIL    — optional; if set, the email is also checked at login
//
// Sessions use a SELF-EXPIRING SIGNED token:
//
//   token = base64url(payloadJson) + "." + base64url(HMAC-SHA256(payloadJson, key))
//
// where payloadJson encodes an `exp` (unix ms) timestamp and the HMAC key is
// DERIVED from CRM_PASSWORD: sha256("programo-crm::v2::" + CRM_PASSWORD).
// Rotating CRM_PASSWORD therefore invalidates every outstanding session.
//
// verifyToken:
//   (a) splits safely (rejects missing/extra "." and malformed parts),
//   (b) recomputes the HMAC and compares TIMING-SAFE over equal-length digests,
//   (c) parses the payload, validates its full shape (v/iat/exp), and rejects
//       if expired, not-yet-valid, or carrying an absurd far-future expiry
//       (defense in depth / clock-skew bound).
//
// If CRM_PASSWORD is unset, verifyCreds / issueToken / verifyToken all fail.
// The wall clock is read inside functions at request time, never at module load.
// Secrets and tokens are NEVER logged.
// ---------------------------------------------------------------------------

export const CRM_COOKIE = "crm_session";

const KEY_DERIVATION_PREFIX = "programo-crm::v2::";
const TOKEN_VERSION = 2;
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days
const MAX_AGE_MS = MAX_AGE_SECONDS * 1000;
// Tolerated clock skew between issuer and verifier when sanity-checking `exp`.
const CLOCK_SKEW_MS = 60 * 1000; // 1 minute

interface SessionPayload {
  /** Schema version, lets us evolve the payload safely. */
  v: number;
  /** Issued-at, unix epoch milliseconds. */
  iat: number;
  /** Expiry, unix epoch milliseconds. */
  exp: number;
}

/** base64url-encode a UTF-8 string (no padding). */
function b64urlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

/**
 * Derive the HMAC signing key from CRM_PASSWORD. Returns null when the secret
 * is missing so every caller can fail closed (no insecure default).
 */
function deriveKey(): Buffer | null {
  const password = process.env.CRM_PASSWORD;
  if (!password) return null;
  return crypto
    .createHash("sha256")
    .update(KEY_DERIVATION_PREFIX + password)
    .digest();
}

/** HMAC-SHA256(message, derivedKey) as a Buffer, or null if no secret. */
function sign(message: string): Buffer | null {
  const key = deriveKey();
  if (!key) return null;
  return crypto.createHmac("sha256", key).update(message, "utf8").digest();
}

/**
 * Timing-safe equality that does not leak length: both inputs are hashed to a
 * fixed 32-byte digest first, then compared with crypto.timingSafeEqual.
 */
function safeEqualString(a: string, b: string): boolean {
  const ah = crypto.createHash("sha256").update(a, "utf8").digest();
  const bh = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(ah, bh);
}

/** Timing-safe equality over two Buffers (guards the equal-length throw). */
function safeEqualBuffer(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
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
    ? safeEqualString(
        (email || "").trim().toLowerCase(),
        expectedEmail.trim().toLowerCase()
      )
    : true; // if CRM_EMAIL unset, only the password gates access

  const passwordOk = safeEqualString(password || "", expectedPassword);

  // Always evaluate both before returning so timing does not reveal which
  // factor failed.
  return emailOk && passwordOk;
}

/**
 * Issue a fresh self-expiring signed session token.
 * Returns "" if CRM_PASSWORD is unset (no insecure default).
 */
function issueToken(): string {
  const now = Date.now(); // request-time clock, never module-level
  const payload: SessionPayload = {
    v: TOKEN_VERSION,
    iat: now,
    exp: now + MAX_AGE_MS,
  };
  const payloadJson = JSON.stringify(payload);
  const sig = sign(payloadJson);
  if (!sig) return "";
  return `${b64urlEncode(payloadJson)}.${sig.toString("base64url")}`;
}

/** True only for a finite, positive number. */
function isPositiveFinite(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/**
 * Verify a self-expiring signed session token.
 * Fails closed on: missing token, unset secret, malformed structure, bad
 * signature, malformed payload, wrong version, not-yet-valid / expired, or an
 * absurd far-future expiry.
 */
export function verifyToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;

  // (a) Split safely: exactly one "." separating exactly two non-empty parts.
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [encodedPayload, encodedSig] = parts;
  if (!encodedPayload || !encodedSig) return false;

  // Decode the payload from base64url back to its exact JSON bytes. We must
  // recompute the HMAC over the SAME bytes that were signed, so re-encode and
  // confirm the round-trip matches the wire value (rejects non-canonical input
  // and any bytes that are not valid UTF-8).
  let payloadJson: string;
  let providedSig: Buffer;
  try {
    payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
    if (b64urlEncode(payloadJson) !== encodedPayload) return false;
    providedSig = Buffer.from(encodedSig, "base64url");
  } catch {
    return false;
  }
  if (providedSig.length === 0) return false;

  // (b) Recompute HMAC and compare TIMING-SAFE over equal-length digests.
  const expectedSig = sign(payloadJson);
  if (!expectedSig) return false; // CRM_PASSWORD unset → always invalid
  if (!safeEqualBuffer(providedSig, expectedSig)) return false;

  // (c) Parse payload; reject if malformed. JSON.parse is wrapped so attacker
  // input can never throw past this point and 500 the request.
  let parsed: unknown;
  try {
    parsed = JSON.parse(payloadJson);
  } catch {
    return false;
  }
  if (typeof parsed !== "object" || parsed === null) return false;
  const payload = parsed as Partial<SessionPayload>;

  // Full shape validation (defense in depth — the signature already covers it).
  if (payload.v !== TOKEN_VERSION) return false;
  if (!isPositiveFinite(payload.iat)) return false;
  if (!isPositiveFinite(payload.exp)) return false;

  const now = Date.now(); // request-time clock
  // Not-yet-valid (issued in the future beyond skew) → reject.
  if (payload.iat > now + CLOCK_SKEW_MS) return false;
  // Absurd far-future expiry (beyond max lifetime + skew) → reject.
  if (payload.exp > now + MAX_AGE_MS + CLOCK_SKEW_MS) return false;
  // Expired → reject.
  return now < payload.exp;
}

/** Attach the httpOnly self-expiring session cookie to a response. */
export function setSessionCookie(res: NextResponse): void {
  res.cookies.set(CRM_COOKIE, issueToken(), {
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
