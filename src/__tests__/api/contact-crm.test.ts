import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { createHash } from "node:crypto";

// Contract with the CRM review inbox (crm_programo/docs/forms-intake.md),
// 2026-10-03: every submission is forwarded to /api/forms/intake with its
// verdict, reasons, signals, IP and user agent — rejected ones included, so a
// filter that is too strict shows up as a real person in the CRM spam instead
// of disappearing.

vi.mock("@/lib/leads", () => ({
  storeLead: vi.fn().mockResolvedValue(true),
  storeRejected: vi.fn().mockResolvedValue(undefined),
  isRepeatSubmission: async () => false,
  getRedis: () => null,
}));
vi.mock("@/lib/analytics/server/lead-conversions", () => ({
  dispatchLeadConversions: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: vi.fn() };
});

const CRM_URL = "https://crm.programo.pl/api/forms/intake";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0 Safari/537.36";
const HUMAN = { wd: false, kd: 22, pm: 140, pd: 3, ts: 0, sc: 4, paste: 0, ms: 40_000, tz: "Europe/Warsaw", lang: "pl-PL", sw: 1440, sh: 900 };

const lead = {
  name: "Jan Kowalski",
  phone: "509 123 434",
  email: "jan@kowalski-budownictwo.pl",
  subject: "Wycena projektu",
  message: "Potrzebujemy nowej strony firmowej z formularzem wyceny.",
  consent: true as const,
  form_id: "contact_page",
  page_url: "https://programo.pl/kontakt",
  utm_source: "google",
  gclid: "abc123",
};

async function solved() {
  const { issueChallenge, leadingZeroBits, DIFFICULTY_BITS, MIN_AGE_MS } = await import("@/lib/form-challenge");
  const { token } = issueChallenge(Date.now() - MIN_AGE_MS - 1_000);
  for (let pow = 0; ; pow++) {
    const d = createHash("sha256").update(`${token}:${pow}`).digest();
    if (leadingZeroBits(d) >= DIFFICULTY_BITS) return { challenge: token, pow };
  }
}

async function send(body: Record<string, unknown>, opts: { challenge?: boolean } = {}) {
  vi.resetModules();
  const { POST } = await import("@/app/api/contact/route");
  const payload = { sig: HUMAN, ...body, ...(opts.challenge === false ? {} : await solved()) };
  const req = new NextRequest("https://programo.pl/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "user-agent": UA, origin: "https://programo.pl", "x-forwarded-for": "203.0.113.9" },
    body: JSON.stringify(payload),
  });
  return POST(req);
}

let fetchMock: ReturnType<typeof vi.fn>;
const crmCalls = () => fetchMock.mock.calls.filter(([url]) => String(url) === CRM_URL);
const crmBody = () => JSON.parse(crmCalls()[0][1].body as string);

describe("/api/contact → CRM review inbox", () => {
  const originalFetch = globalThis.fetch;
  beforeEach(() => {
    process.env.CRM_WEBHOOK_SECRET = "test-crm-secret";
    delete process.env.CRM_WEBHOOK_URL;
    delete process.env.TELEGRAM_BOT_TOKEN;
    fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.CRM_WEBHOOK_SECRET;
  });

  it("forwards a clean lead with form, page, verdict, signals, IP and user agent", async () => {
    const res = await send(lead);
    expect(res.status).toBe(200);
    expect(crmCalls()).toHaveLength(1);
    expect(crmCalls()[0][1].headers).toMatchObject({ "X-Webhook-Secret": "test-crm-secret" });
    expect(crmBody()).toMatchObject({
      source: "programo.pl",
      formId: "contact_page",
      pageUrl: "https://programo.pl/kontakt",
      name: "Jan Kowalski",
      phone: "509 123 434",
      verdict: "clean",
      verdictReasons: [],
      signals: { honeypot: false, challenge: "ok", turnstile: "off", repeat: false, bot: "clean", content: "clean" },
      utm: { utm_source: "google", gclid: "abc123" },
      ip: "203.0.113.9",
      userAgent: UA,
    });
    expect(typeof crmBody().signals.behaviour).toBe("string");
  });

  it("forwards a suspicious lead too (it used to stay on Telegram only)", async () => {
    await send({ ...lead, message: "Nasza strona: www.kowalski-budownictwo.pl, chcemy nową." });
    expect(crmBody()).toMatchObject({ verdict: "suspicious", verdictReasons: ["link w treści"] });
  });

  it("forwards a content rejection as rejected with the stage", async () => {
    const res = await send({ ...lead, phone: "+48 600 100 200" });
    expect(await res.json()).toEqual({ success: true, counted: false });
    expect(crmBody()).toMatchObject({
      verdict: "rejected",
      signals: { stage: "content", content: "drop", challenge: "ok", honeypot: false },
    });
    expect(crmBody().verdictReasons[0]).toMatch(/numer przykładowy/);
  });

  it("forwards a honeypot hit as rejected", async () => {
    await send({ ...lead, company_website: "http://spam.example" });
    expect(crmBody()).toMatchObject({ verdict: "rejected", verdictReasons: ["wypełnione ukryte pole"], signals: { stage: "honeypot", honeypot: true } });
  });

  it("forwards a failed challenge as rejected and still answers 403", async () => {
    const res = await send(lead, { challenge: false });
    expect(res.status).toBe(403);
    expect(crmBody()).toMatchObject({ verdict: "rejected", signals: { stage: "challenge", challenge: "missing" } });
  });

  it("uses CRM_WEBHOOK_URL when set and skips forwarding without a secret", async () => {
    process.env.CRM_WEBHOOK_URL = "https://crm.test/api/forms/intake";
    await send(lead);
    expect(fetchMock.mock.calls.some(([url]) => String(url) === "https://crm.test/api/forms/intake")).toBe(true);
    delete process.env.CRM_WEBHOOK_URL;
    fetchMock.mockClear();
    delete process.env.CRM_WEBHOOK_SECRET;
    process.env.FORM_CHALLENGE_SECRET = "challenge-only";
    await send(lead);
    delete process.env.FORM_CHALLENGE_SECRET;
    expect(crmCalls()).toHaveLength(0);
  });
});
