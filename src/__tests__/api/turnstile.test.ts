import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyTurnstile, isTestDeliveryIsolated } from "@/lib/turnstile";
const SITE = "0x4AAAAAAALiveSite";
const SECRET = "live-secret";
function mockVerify(body: unknown, status = 200) {
  const mock = vi.fn().mockResolvedValue({ ok: status === 200, json: async () => body });
  vi.stubGlobal("fetch", mock); return mock;
}
beforeEach(() => { vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", SITE); vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET); vi.stubEnv("NEXT_PUBLIC_TURNSTILE_TEST_MODE", "false"); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("mandatory Turnstile verification", () => {
  it("rejects absent and half-configured keys without fetching", async () => {
    const mock = mockVerify({ success: true });
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(await verifyTurnstile("tok", "unknown")).toEqual({ ok: false, reason: "configuration" });
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    expect(await verifyTurnstile(undefined, "unknown")).toEqual({ ok: false, reason: "configuration" });
    expect(mock).not.toHaveBeenCalled();
  });
  it("rejects missing tokens", async () => {
    expect(await verifyTurnstile(undefined, "unknown")).toEqual({ ok: false, reason: "missing" });
  });
  it("accepts matching live hostname and action, with IP", async () => {
    const mock = mockVerify({ success: true, hostname: "v3.programo.pl", action: "contact" });
    expect(await verifyTurnstile("tok", "203.0.113.9", "v3.programo.pl")).toEqual({ ok: true });
    expect(JSON.parse(mock.mock.calls[0][1].body)).toEqual({ secret: SECRET, response: "tok", remoteip: "203.0.113.9" });
  });
  it.each([{ success: false }, { success: true, hostname: "evil.example", action: "contact" }, { success: true, hostname: "programo.pl", action: "other" }])("rejects provider denial or mismatched metadata: %j", async (body) => {
    mockVerify(body); expect(await verifyTurnstile("tok", "unknown")).toEqual({ ok: false, reason: "rejected" });
  });
  it("fails closed on HTTP errors, invalid JSON and network outage", async () => {
    mockVerify({}, 503); expect((await verifyTurnstile("tok", "unknown"))).toEqual({ ok: false, reason: "unavailable" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await verifyTurnstile("tok", "unknown")).toEqual({ ok: false, reason: "unavailable" });
  });
  it("only accepts official dummy keys under explicit nonproduction deployment", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "1x0000000000000000000000000000000AA");
    mockVerify({ success: true });
    expect(await verifyTurnstile("XXXX.DUMMY.TOKEN.XXXX", "unknown", "localhost")).toEqual({ ok: false, reason: "configuration" });
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_TEST_MODE", "true"); vi.stubEnv("PROGRAMO_DEPLOYMENT_ENV", "preview");
    expect(await verifyTurnstile("XXXX.DUMMY.TOKEN.XXXX", "unknown", "localhost")).toEqual({ ok: true });
    expect(await verifyTurnstile("XXXX.DUMMY.TOKEN.XXXX", "unknown", "programo.pl")).toEqual({ ok: false, reason: "configuration" });
    vi.stubEnv("PROGRAMO_DEPLOYMENT_ENV", "production");
    expect(await verifyTurnstile("XXXX.DUMMY.TOKEN.XXXX", "unknown", "v3.programo.pl")).toEqual({ ok: false, reason: "configuration" });
  });
  it("never permits dummy-key delivery to live providers", () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_TEST_MODE", "true"); vi.stubEnv("CRM_WEBHOOK_SECRET", "fixture-only");
    vi.stubEnv("CRM_INTAKE_URL", "https://crm.programo.pl/api/forms/intake");
    expect(isTestDeliveryIsolated()).toBe(false);
    vi.stubEnv("CRM_INTAKE_URL", "http://preview-intake:4100/api/form-intake");
    expect(isTestDeliveryIsolated()).toBe(true);
    vi.stubEnv("KV_REST_API_URL", "https://live-store.example");
    expect(isTestDeliveryIsolated()).toBe(false);
  });
});
