import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { HONEYPOT_FIELD } from "@/lib/form-challenge-shared";

export { HONEYPOT_FIELD };

/**
 * Keyless anti-bot for the lead forms — three layers, no third party, no
 * account to create, no env var that has to exist before it works:
 *
 *   1. Honeypot   — a text field humans never see. Filled in = bot. The
 *                   request is answered 200 and dropped, so the bot learns
 *                   nothing. See `isHoneypotTripped` + components/ui/honeypot.
 *   2. Challenge  — the page fetches a signed, timestamped token on mount
 *                   (GET /api/contact/challenge). The token has to come back
 *                   with the submission, at least MIN_AGE_MS after it was
 *                   issued (no human fills a form in under three seconds) and
 *                   at most MAX_AGE_MS after (a stale tab). Each nonce is
 *                   accepted once.
 *   3. Proof of work — the browser has to find a counter whose SHA-256 with
 *                   the token has DIFFICULTY_BITS leading zero bits. ~16k
 *                   hashes on average: a quarter-second on a phone, invisible
 *                   to a visitor, but a real CPU bill for anyone posting a
 *                   thousand times an hour — and generic form-spam bots do not
 *                   implement someone else's custom protocol at all.
 *
 * Signing key: FORM_CHALLENGE_SECRET if set, otherwise derived from a secret
 * production already has (CRM_WEBHOOK_SECRET → TELEGRAM_BOT_TOKEN →
 * KV_REST_API_TOKEN). Derived, not reused: the HMAC key is a SHA-256 of the
 * source with a fixed label, so a leaked challenge signature says nothing
 * about the source secret. A stable key matters on multi-instance hosting —
 * Vercel functions are many processes, and a token issued by one must verify
 * on another. With NO source at all the key is random per process, which is
 * correct on a single container and merely noisy on serverless (logged).
 *
 * Cloudflare Turnstile (lib/turnstile.ts) stays as an optional fourth layer
 * that the owner can switch on with keys later. This one needs nothing.
 */

export const MIN_AGE_MS = 3_000;
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;
export const DIFFICULTY_BITS = 14;

const DERIVATION_LABEL = "programo:form-challenge:v1:";

let cachedKey: Buffer | null = null;
function signingKey(): Buffer {
  if (cachedKey) return cachedKey;
  const explicit = process.env.FORM_CHALLENGE_SECRET;
  const source =
    explicit ||
    process.env.CRM_WEBHOOK_SECRET ||
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.KV_REST_API_TOKEN;
  if (source) {
    cachedKey = createHash("sha256").update(DERIVATION_LABEL + source).digest();
  } else {
    console.warn(
      "[form-challenge] no FORM_CHALLENGE_SECRET and no secret to derive one from — " +
        "using a per-process random key. Fine on one container; on serverless a token " +
        "issued by one instance will not verify on another.",
    );
    cachedKey = randomBytes(32);
  }
  return cachedKey;
}

/** Exposed for tests only — a new env needs a new key. */
export function _resetSigningKeyForTests() {
  cachedKey = null;
}

const b64u = (b: Buffer) => b.toString("base64url");
const sign = (payload: string) => b64u(createHmac("sha256", signingKey()).update(payload).digest());

export type Challenge = {
  token: string;
  /** Leading zero bits the client has to hit. */
  difficulty: number;
  /** Do not submit before this many ms have passed — the server will refuse. */
  minAgeMs: number;
};

export function issueChallenge(now = Date.now()): Challenge {
  const payload = b64u(Buffer.from(JSON.stringify({ iat: now, n: b64u(randomBytes(12)) })));
  return { token: `${payload}.${sign(payload)}`, difficulty: DIFFICULTY_BITS, minAgeMs: MIN_AGE_MS };
}

export type ChallengeVerdict =
  | { ok: true }
  | { ok: false; reason: "missing" | "malformed" | "bad_signature" | "too_fast" | "expired" | "bad_pow" | "replayed" };

// Nonces already spent, with their expiry. Single-instance state — on
// serverless this only guards replays within one warm function, and the
// PoW + MAX_AGE_MS carry the rest.
const spent = new Map<string, number>();
let lastPrune = 0;
function pruneSpent(now: number) {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [n, exp] of spent) if (exp <= now) spent.delete(n);
}

export function leadingZeroBits(digest: Buffer): number {
  let bits = 0;
  for (const byte of digest) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    bits += Math.clz32(byte) - 24;
    break;
  }
  return bits;
}

export function verifyChallenge(
  token: string | undefined,
  pow: number | undefined,
  now = Date.now(),
): ChallengeVerdict {
  if (!token) return { ok: false, reason: "missing" };
  const dot = token.indexOf(".");
  if (dot <= 0) return { ok: false, reason: "malformed" };
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return { ok: false, reason: "bad_signature" };
  }

  let iat: number, nonce: string;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { iat?: unknown; n?: unknown };
    if (typeof parsed.iat !== "number" || typeof parsed.n !== "string") throw new Error();
    iat = parsed.iat;
    nonce = parsed.n;
  } catch {
    return { ok: false, reason: "malformed" };
  }

  const age = now - iat;
  if (age < MIN_AGE_MS) return { ok: false, reason: "too_fast" };
  if (age > MAX_AGE_MS) return { ok: false, reason: "expired" };

  if (typeof pow !== "number" || !Number.isInteger(pow) || pow < 0) return { ok: false, reason: "bad_pow" };
  const digest = createHash("sha256").update(`${token}:${pow}`).digest();
  if (leadingZeroBits(digest) < DIFFICULTY_BITS) return { ok: false, reason: "bad_pow" };

  pruneSpent(now);
  if (spent.has(nonce)) return { ok: false, reason: "replayed" };
  spent.set(nonce, iat + MAX_AGE_MS);
  return { ok: true };
}

export function isHoneypotTripped(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const v = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof v === "string" && v.trim().length > 0;
}
