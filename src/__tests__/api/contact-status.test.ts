import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// The bug this pins: /api/contact returned 500 for a lead that was already
// durably stored, whenever the last notification channel failed.
//
// The cost was doubled and invisible. The visitor saw "wysyłka nie powiodła
// się" for a message sitting safely in Redis and in the CRM — and because the
// form returns before trackLead() on a non-ok response, the Google Ads and Meta
// conversions never fired either. So one Telegram outage lost the lead in the
// inbox AND poisoned the bidding signal, while the lead itself was fine.
//
// The rule now: the HTTP status follows PERSISTENCE. Notifications are a
// convenience layered on top of it.

const storeLead = vi.fn();

vi.mock("@/lib/leads", () => ({
  storeLead: (...args: unknown[]) => storeLead(...args),
}));

// Conversions are dispatched via after(); irrelevant to the status contract.
vi.mock("@/lib/analytics/server/lead-conversions", () => ({
  dispatchLeadConversions: vi.fn().mockResolvedValue(undefined),
}));

// `after` refuses to run outside a real request scope. That is a constraint of
// the test environment, not of the route — stub it and keep NextResponse real.
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: vi.fn() };
});

const validLead = {
  name: "Jan Kowalski",
  phone: "509 123 434",
  email: "jan@example.com",
  subject: "Wycena projektu",
  consent: true as const,
};

/** NextRequest, not Request — the route reads request.cookies. */
function post(body: unknown): NextRequest {
  return new NextRequest("https://programo.pl/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "user-agent": "vitest" },
    body: JSON.stringify(body),
  });
}

/** Fresh module per test — the route keeps an in-process rate-limit map. */
async function loadRoute() {
  vi.resetModules();
  const mod = await import("@/app/api/contact/route");
  return mod.POST;
}

describe("/api/contact — status follows persistence, not notification", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    storeLead.mockReset();
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "123";
    delete process.env.CRM_WEBHOOK_SECRET;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it("returns 200 when the lead is stored even though Telegram fails", async () => {
    storeLead.mockResolvedValue(true);
    // Telegram down.
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response("nope", { status: 500 }),
    ) as unknown as typeof fetch;

    const POST = await loadRoute();
    const res = await POST(post(validLead));

    expect(res.status, "a stored lead is not a failed submission").toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(storeLead).toHaveBeenCalledOnce();
  });

  it("returns 500 only when nothing persisted AND nothing notified", async () => {
    storeLead.mockResolvedValue(false); // no Redis
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response("nope", { status: 500 }),
    ) as unknown as typeof fetch;

    const POST = await loadRoute();
    const res = await POST(post(validLead));

    expect(res.status).toBe(500);
  });

  it("returns 200 when Telegram delivers even if the store is unavailable", async () => {
    storeLead.mockResolvedValue(false);
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    ) as unknown as typeof fetch;

    const POST = await loadRoute();
    const res = await POST(post(validLead));

    expect(res.status).toBe(200);
  });

  it("still rejects an invalid payload before touching any channel", async () => {
    storeLead.mockResolvedValue(true);
    const POST = await loadRoute();
    const res = await POST(post({ ...validLead, consent: false }));

    expect(res.status).toBe(400);
    expect(storeLead).not.toHaveBeenCalled();
  });
});
