import { describe, it, expect, beforeEach, vi } from "vitest";
import { createHash } from "node:crypto";
import {
  issueChallenge,
  verifyChallenge,
  isHoneypotTripped,
  leadingZeroBits,
  MIN_AGE_MS,
  MAX_AGE_MS,
  DIFFICULTY_BITS,
  HONEYPOT_FIELD,
  _resetSigningKeyForTests,
} from "@/lib/form-challenge";

/** Same grind the browser does, in node. */
function solve(token: string): number {
  for (let c = 0; ; c++) {
    const d = createHash("sha256").update(`${token}:${c}`).digest();
    if (leadingZeroBits(d) >= DIFFICULTY_BITS) return c;
  }
}

describe("keyless form challenge", () => {
  const T0 = 1_700_000_000_000;
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("CRM_WEBHOOK_SECRET", "test-crm-secret");
    _resetSigningKeyForTests();
  });

  it("accepts a solved challenge submitted after the minimum age", () => {
    const { token } = issueChallenge(T0);
    const pow = solve(token);
    expect(verifyChallenge(token, pow, T0 + MIN_AGE_MS + 1)).toEqual({ ok: true });
  });

  it("rejects a missing or malformed token", () => {
    expect(verifyChallenge(undefined, 1, T0)).toEqual({ ok: false, reason: "missing" });
    expect(verifyChallenge("nodot", 1, T0)).toEqual({ ok: false, reason: "malformed" });
  });

  it("rejects a token signed with a different key", () => {
    const { token } = issueChallenge(T0);
    const pow = solve(token);
    vi.stubEnv("CRM_WEBHOOK_SECRET", "another-secret");
    _resetSigningKeyForTests();
    expect(verifyChallenge(token, pow, T0 + MIN_AGE_MS + 1)).toEqual({ ok: false, reason: "bad_signature" });
  });

  it("rejects a submission faster than a human can type", () => {
    const { token } = issueChallenge(T0);
    const pow = solve(token);
    expect(verifyChallenge(token, pow, T0 + MIN_AGE_MS - 1)).toEqual({ ok: false, reason: "too_fast" });
  });

  it("rejects a stale token", () => {
    const { token } = issueChallenge(T0);
    const pow = solve(token);
    expect(verifyChallenge(token, pow, T0 + MAX_AGE_MS + 1)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects a wrong or absent proof of work", () => {
    const { token } = issueChallenge(T0);
    const pow = solve(token);
    const wrong = pow === 0 ? 1 : pow - 1;
    // The chance a neighbouring counter also solves 14 bits is 1 in 16384.
    expect(verifyChallenge(token, wrong, T0 + MIN_AGE_MS + 1).ok).toBe(false);
    expect(verifyChallenge(token, undefined, T0 + MIN_AGE_MS + 1)).toEqual({ ok: false, reason: "bad_pow" });
    expect(verifyChallenge(token, -1, T0 + MIN_AGE_MS + 1)).toEqual({ ok: false, reason: "bad_pow" });
  });

  it("accepts each nonce once", () => {
    const { token } = issueChallenge(T0);
    const pow = solve(token);
    expect(verifyChallenge(token, pow, T0 + MIN_AGE_MS + 1)).toEqual({ ok: true });
    expect(verifyChallenge(token, pow, T0 + MIN_AGE_MS + 2)).toEqual({ ok: false, reason: "replayed" });
  });

  it("derives a stable key from an existing production secret", () => {
    const { token } = issueChallenge(T0);
    const pow = solve(token);
    // A fresh process with the same env must verify what the last one issued.
    _resetSigningKeyForTests();
    expect(verifyChallenge(token, pow, T0 + MIN_AGE_MS + 1)).toEqual({ ok: true });
  });

  it("honeypot trips only on a non-empty value", () => {
    expect(isHoneypotTripped({})).toBe(false);
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: "" })).toBe(false);
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: "   " })).toBe(false);
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: "http://spam.example" })).toBe(true);
    expect(isHoneypotTripped(null)).toBe(false);
  });

  it("counts leading zero bits", () => {
    expect(leadingZeroBits(Buffer.from([0, 0, 0xff]))).toBe(16);
    expect(leadingZeroBits(Buffer.from([0, 0x03]))).toBe(14);
    expect(leadingZeroBits(Buffer.from([0x80]))).toBe(0);
  });
});
