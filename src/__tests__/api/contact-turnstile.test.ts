import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
const storeLead = vi.fn().mockResolvedValue(true);
const conversion = vi.fn();
vi.mock("@/lib/leads", () => ({ storeLead: (...args: unknown[]) => storeLead(...args), storeRejected: vi.fn(), isRepeatSubmission: async () => false, getRedis: () => null }));
vi.mock("@/lib/analytics/server/lead-conversions", () => ({ dispatchLeadConversions: (...args: unknown[]) => conversion(...args) }));
vi.mock("next/server", async importOriginal => ({ ...await importOriginal<typeof import("next/server")>(), after: (callback: () => void) => callback() }));
const payload = { name: "TEST", phone: "509123434", consent: true, form_id: "hero-phone", turnstileToken: "token", sig: { kd: 12, pd: 2, ms: 40000, tz: "Europe/Warsaw" } };
async function send(body: Record<string, unknown> = payload, internalUrl = "https://v3.programo.pl/api/contact", host?: string) {
  vi.resetModules();
  const { POST } = await import("@/app/api/contact/route");
  return POST(new NextRequest(internalUrl, { method: "POST", headers: { origin: "https://v3.programo.pl", "user-agent": "Mozilla/5.0 HeadlessChrome/120.0", "Content-Type": "application/json", ...(host ? { host } : {}) }, body: JSON.stringify(body) }));
}
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "0x4AAAAAAALiveSite"); vi.stubEnv("TURNSTILE_SECRET_KEY", "live-secret");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_TEST_MODE", "false"); vi.stubEnv("CRM_WEBHOOK_SECRET", "");
  vi.stubEnv("TELEGRAM_BOT_TOKEN", ""); vi.stubEnv("MS_GRAPH_CLIENT_SECRET", "");
  storeLead.mockClear(); conversion.mockClear();
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("HTTP handler mandatory gate", () => {
  it("validates the public Host when standalone Next uses its internal bind URL", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "v3.programo.pl", action: "contact" }))));
    expect((await send(payload, "http://0.0.0.0:3000/api/contact", "v3.programo.pl")).status).toBe(200);
    expect(storeLead).toHaveBeenCalledOnce();
  });
  it("rejects a foreign or malformed Host before provider verification or persistence", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    expect((await send(payload, "http://0.0.0.0:3000/api/contact", "evil.example")).status).toBe(403);
    expect((await send(payload, "http://0.0.0.0:3000/api/contact", "evil.example@v3.programo.pl")).status).toBe(403);
    expect(fetch).not.toHaveBeenCalled(); expect(storeLead).not.toHaveBeenCalled();
  });
  it("never stores or forwards a provider-rejected token", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false })));
    vi.stubGlobal("fetch", fetch);
    expect((await send()).status).toBe(403);
    expect(fetch).toHaveBeenCalledOnce(); expect(storeLead).not.toHaveBeenCalled(); expect(conversion).not.toHaveBeenCalled();
  });
  it("returns retryable 503 on missing keys and provider outage", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect((await send()).status).toBe(503);
    vi.stubEnv("TURNSTILE_SECRET_KEY", "live-secret"); vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await send()).status).toBe(503); expect(storeLead).not.toHaveBeenCalled();
  });
  it("accepts keyboard or assistive input without legacy proof of work, preserves it for review", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "v3.programo.pl", action: "contact" }))));
    const response = await send({ ...payload, sig: { kd: 0, pd: 0, ms: 40000, tz: "Europe/Warsaw" } });
    expect(response.status).toBe(200); expect(await response.json()).toEqual({ success: true, counted: false });
    expect(storeLead).toHaveBeenCalledOnce(); expect(storeLead.mock.calls[0][0].verdict).toBe("suspicious");
  });
  it("persists a genuine two-link brief for review instead of rejecting it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "v3.programo.pl", action: "contact" }))));
    const response = await send({ ...payload, message: "Podobają nam się https://jedmar.pl i https://innochem.pl jako referencje." });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, counted: false });
    expect(storeLead).toHaveBeenCalledOnce();
    expect(storeLead.mock.calls[0][0]).toMatchObject({ verdict: "suspicious", verdictReasons: ["2 linki w treści"] });
    expect(conversion).not.toHaveBeenCalled();
  });
  it("blocks dummy-key deployment if delivery points at live CRM", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "1x0000000000000000000000000000000AA");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_TEST_MODE", "true"); vi.stubEnv("PROGRAMO_DEPLOYMENT_ENV", "preview");
    vi.stubEnv("CRM_WEBHOOK_SECRET", "fixture-only"); vi.stubEnv("CRM_INTAKE_URL", "https://crm.programo.pl/api/forms/intake");
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetch);
    expect((await send({ ...payload, turnstileToken: "XXXX.DUMMY.TOKEN.XXXX" })).status).toBe(503); expect(fetch).toHaveBeenCalledOnce(); expect(storeLead).not.toHaveBeenCalled();
  });
});
