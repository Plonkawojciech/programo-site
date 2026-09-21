import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyTurnstile, isTurnstileEnforced } from "@/lib/turnstile";

const SITE = "1x00000000000000000000AA";
const SECRET = "1x0000000000000000000000000000000AA";

function mockSiteverify(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("Turnstile gate", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("is a no-op when neither key is set", async () => {
    expect(isTurnstileEnforced()).toBe(false);
    const fetchMock = mockSiteverify({ success: false });
    expect(await verifyTurnstile(undefined, "1.2.3.4")).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is a no-op with only the secret — a half-configured deploy must not 403 every form", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET);
    expect(isTurnstileEnforced()).toBe(false);
    expect(await verifyTurnstile(undefined, "1.2.3.4")).toEqual({ ok: true });
  });

  describe("when both keys are set", () => {
    beforeEach(() => {
      vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", SITE);
      vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET);
    });

    it("rejects a submission without a token", async () => {
      const fetchMock = mockSiteverify({ success: true });
      expect(await verifyTurnstile(undefined, "1.2.3.4")).toEqual({ ok: false, reason: "missing" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("accepts a token Cloudflare confirms, forwarding secret + ip", async () => {
      const fetchMock = mockSiteverify({ success: true });
      expect(await verifyTurnstile("tok", "1.2.3.4")).toEqual({ ok: true });
      const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(sent).toEqual({ secret: SECRET, response: "tok", remoteip: "1.2.3.4" });
    });

    it("omits remoteip when the ip is unknown", async () => {
      const fetchMock = mockSiteverify({ success: true });
      await verifyTurnstile("tok", "unknown");
      const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(sent).not.toHaveProperty("remoteip");
    });

    it("rejects a token Cloudflare refuses", async () => {
      mockSiteverify({ success: false, "error-codes": ["invalid-input-response"] });
      expect(await verifyTurnstile("bad", "1.2.3.4")).toEqual({ ok: false, reason: "rejected" });
    });

    it("fails open on a Cloudflare 5xx", async () => {
      mockSiteverify({}, 503);
      expect(await verifyTurnstile("tok", "1.2.3.4")).toEqual({ ok: true });
    });

    it("fails open when siteverify is unreachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
      expect(await verifyTurnstile("tok", "1.2.3.4")).toEqual({ ok: true });
    });
  });
});
