import { describe, it, expect } from "vitest";
import { EVENTS, EV, type EventDef } from "@/lib/analytics/events";
import { collectSchema, isLikelyBot, parseUserAgent } from "@/lib/analytics/collect-schema";
import { classifyReferrer } from "@/lib/analytics/attribution";
import {
  normEmail,
  normPhonePl,
  normName,
  normCity,
  normZip,
  buildFbcFromUrl,
  readConsentCookie,
} from "@/lib/analytics/server/meta-capi";
import { identifyBot, isAiBot } from "@/lib/analytics/ai-crawlers";

// The analytics layer is mostly pure functions guarding subtle, easy-to-break
// contracts (GA4 name limits, Meta's hashing rules, consent fail-closed).
// Those are exactly the things that break silently in production, so they are
// pinned here rather than checked by hand.

describe("event taxonomy", () => {
  it("every event declares a name, destinations and a rationale", () => {
    for (const [key, def] of Object.entries(EVENTS)) {
      expect(def.name, `${key}.name`).toBeTruthy();
      expect(def.to.length, `${key}.to`).toBeGreaterThan(0);
      expect(def.why.length, `${key}.why`).toBeGreaterThan(20);
    }
  });

  it("event names respect GA4's 40-character limit and snake_case", () => {
    for (const [key, def] of Object.entries(EVENTS)) {
      expect(def.name.length, `${key} too long`).toBeLessThanOrEqual(40);
      expect(def.name, `${key} not snake_case`).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it("event names are unique", () => {
    const names = Object.values(EVENTS).map((d) => d.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("EV keys mirror the taxonomy keys", () => {
    expect(Object.keys(EV).sort()).toEqual(Object.keys(EVENTS).sort());
  });

  it("events routed to Meta declare how to map them", () => {
    // Widened to EventDef: the `as const` literal types narrow `to` to a fixed
    // tuple per event, which makes .includes() reject sibling destinations.
    for (const [key, d] of Object.entries(EVENTS)) {
      const def: EventDef = d;
      if (def.to.includes("meta")) {
        expect(def.meta, `${key} goes to meta without a mapping`).toBeDefined();
        expect(def.meta!.event).toBeTruthy();
      }
    }
  });

  it("the lead conversion reaches GA4, Meta and our own store", () => {
    const lead: EventDef = EVENTS.generate_lead;
    expect(lead.to).toEqual(expect.arrayContaining(["ga4", "meta", "firstParty"]));
    expect(lead.meta?.event).toBe("Lead");
    expect(lead.meta?.standard).toBe(true);
  });
});

describe("/api/collect contract", () => {
  const now = Date.now();
  const valid = {
    visitor_id: "v-1",
    session_id: "s-1",
    events: [{ event: "scroll_depth", event_id: "e-1", ts: now, path: "/", params: { percent: 50 } }],
  };

  it("accepts a well-formed batch", () => {
    expect(collectSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects event names outside the taxonomy", () => {
    const res = collectSchema.safeParse({
      ...valid,
      events: [{ event: "definitely_not_real", event_id: "e", ts: now, path: "/" }],
    });
    expect(res.success).toBe(false);
  });

  it("rejects a path that is not a plain route", () => {
    // Paths become Redis hash fields in the daily rollups, so a free-form
    // string is an unbounded-growth vector, not a cosmetic issue.
    for (const path of ["/x?" + "a".repeat(400), "//evil.com", "/<script>", "not-a-path", "/" + "a".repeat(200)]) {
      const res = collectSchema.safeParse({
        ...valid,
        events: [{ event: "scroll_depth", event_id: "e", ts: now, path }],
      });
      expect(res.success, `should reject ${path.slice(0, 30)}`).toBe(false);
    }
    expect(
      collectSchema.safeParse({
        ...valid,
        events: [{ event: "scroll_depth", event_id: "e", ts: now, path: "/projects/estalo" }],
      }).success,
    ).toBe(true);
  });

  it("rejects timestamps that are not from roughly now", () => {
    // ts orders the dashboard session list; unbounded values pin a fabricated
    // session to the top forever.
    for (const ts of [0, 1, 99999999999999, now - 5 * 86400_000]) {
      const res = collectSchema.safeParse({
        ...valid,
        events: [{ event: "scroll_depth", event_id: "e", ts, path: "/" }],
      });
      expect(res.success, `should reject ts=${ts}`).toBe(false);
    }
  });

  it("rejects an empty batch and caps an oversized one", () => {
    expect(collectSchema.safeParse({ ...valid, events: [] }).success).toBe(false);
    const many = Array.from({ length: 60 }, (_, i) => ({
      event: "scroll_depth",
      event_id: `e${i}`,
      ts: now,
      path: "/",
    }));
    expect(collectSchema.safeParse({ ...valid, events: many }).success).toBe(false);
  });
});

describe("bot filtering and UA parsing", () => {
  it("treats an empty user agent as a bot", () => {
    expect(isLikelyBot("")).toBe(true);
  });

  it("catches common crawlers and tooling", () => {
    for (const ua of ["Googlebot/2.1", "python-requests/2.31", "HeadlessChrome/120", "curl/8.4"]) {
      expect(isLikelyBot(ua), ua).toBe(true);
    }
  });

  it("lets a real browser through", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    expect(isLikelyBot(ua)).toBe(false);
    expect(parseUserAgent(ua)).toEqual({ device: "desktop", browser: "Chrome", os: "macOS" });
  });

  it("does not misread Edge or Opera as Chrome", () => {
    expect(parseUserAgent("Mozilla/5.0 Chrome/120 Safari/537.36 Edg/120").browser).toBe("Edge");
    expect(parseUserAgent("Mozilla/5.0 Chrome/120 Safari/537.36 OPR/106").browser).toBe("Opera");
  });

  it("detects mobile and tablet", () => {
    expect(parseUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148").device).toBe("mobile");
    expect(parseUserAgent("Mozilla/5.0 (iPad; CPU OS 17_0) Safari").device).toBe("tablet");
  });
});

describe("referrer classification", () => {
  it("recognises AI assistants — the whole point of the GEO work", () => {
    for (const url of [
      "https://chatgpt.com/c/abc",
      "https://www.perplexity.ai/search?q=x",
      "https://claude.ai/chat/1",
      "https://copilot.microsoft.com/",
    ]) {
      expect(classifyReferrer(url).class, url).toBe("ai");
    }
    expect(classifyReferrer("https://chatgpt.com/").aiSource).toBe("chatgpt.com");
  });

  it("separates search, social, referral and direct", () => {
    expect(classifyReferrer("https://www.google.pl/search?q=x").class).toBe("search");
    expect(classifyReferrer("https://www.linkedin.com/feed").class).toBe("social");
    expect(classifyReferrer("https://example.com/blog").class).toBe("referral");
    expect(classifyReferrer("").class).toBe("direct");
    expect(classifyReferrer("not a url").class).toBe("direct");
  });

  it("marks our own domain as internal, not referral", () => {
    expect(classifyReferrer("https://programo.pl/oferta", "programo.pl").class).toBe("internal");
    expect(classifyReferrer("https://programo.pl/oferta", "www.programo.pl").class).toBe("internal");
  });
});

describe("Meta CAPI normalisation", () => {
  it("formats phones Meta's way: digits, country code, no leading zeros", () => {
    // Deliberately NOT E.164 — Google Enhanced Conversions wants the leading
    // "+", Meta wants it gone. Mixing the two silently lowers the match rate.
    expect(normPhonePl("+48 601 234 567")).toBe("48601234567");
    expect(normPhonePl("0048601234567")).toBe("48601234567");
    expect(normPhonePl("601 234 567")).toBe("48601234567");
    expect(normPhonePl("601-234-567")).toBe("48601234567");
    expect(normPhonePl("123")).toBeUndefined();
    expect(normPhonePl(null)).toBeUndefined();
  });

  it("keeps Polish diacritics in names — Meta wants UTF-8, not transliteration", () => {
    expect(normName("Łukasz")).toBe("łukasz");
    expect(normName("  Anna-Maria  ")).toBe("annamaria");
    expect(normName("")).toBeUndefined();
  });

  it("strips spaces from city and punctuation from postcode", () => {
    expect(normCity("Nowy Sącz")).toBe("nowysącz");
    expect(normCity("Poznań")).toBe("poznań");
    expect(normZip("61-001")).toBe("61001");
  });

  it("lowercases and validates e-mail", () => {
    expect(normEmail("  Jan.Kowalski@Example.PL ")).toBe("jan.kowalski@example.pl");
    expect(normEmail("not-an-email")).toBeUndefined();
  });

  it("builds fbc in Meta's exact format, with milliseconds", () => {
    const fbc = buildFbcFromUrl("https://programo.pl/?fbclid=ABC123", 1700000000000);
    expect(fbc).toBe("fb.1.1700000000000.ABC123");
    expect(buildFbcFromUrl("https://programo.pl/")).toBeUndefined();
    expect(buildFbcFromUrl("nonsense")).toBeUndefined();
  });
});

describe("server-side consent gate", () => {
  it("fails closed on a missing or unparseable cookie", () => {
    expect(readConsentCookie(undefined)).toEqual({ analytics: false, marketing: false });
    expect(readConsentCookie("garbage")).toEqual({ analytics: false, marketing: false });
    expect(readConsentCookie("")).toEqual({ analytics: false, marketing: false });
  });

  it("reads a real decision, and treats anything but true as false", () => {
    const raw = encodeURIComponent(JSON.stringify({ analytics: true, marketing: false }));
    expect(readConsentCookie(raw)).toEqual({ analytics: true, marketing: false });
    const sneaky = encodeURIComponent(JSON.stringify({ analytics: "yes", marketing: 1 }));
    expect(readConsentCookie(sneaky)).toEqual({ analytics: false, marketing: false });
  });
});

describe("AI crawler identification", () => {
  it("distinguishes answering crawlers from training crawlers", () => {
    // This distinction decides whether blocking a bot costs us citations.
    expect(identifyBot("Mozilla/5.0 (compatible; OAI-SearchBot/1.0)")?.purpose).toBe("answer");
    expect(identifyBot("Mozilla/5.0 (compatible; GPTBot/1.1)")?.purpose).toBe("training");
    expect(identifyBot("Mozilla/5.0 (compatible; ClaudeBot/1.0)")?.purpose).toBe("training");
    expect(identifyBot("Mozilla/5.0 (compatible; Claude-SearchBot/1.0)")?.purpose).toBe("answer");
  });

  it("matches the more specific pattern first", () => {
    // "ChatGPT-User" must not be swallowed by a looser OpenAI pattern, and
    // "Applebot-Extended" must not be read as plain "Applebot".
    expect(identifyBot("Mozilla/5.0 ChatGPT-User/1.0")?.name).toBe("ChatGPT-User");
    expect(identifyBot("Mozilla/5.0 (compatible; Applebot-Extended/0.1)")?.name).toBe("Applebot-Extended");
    expect(identifyBot("Mozilla/5.0 (compatible; Applebot/0.1)")?.name).toBe("Applebot");
  });

  it("ignores ordinary browsers", () => {
    expect(identifyBot("Mozilla/5.0 (Macintosh) Chrome/120 Safari/537.36")).toBeNull();
    expect(identifyBot(null)).toBeNull();
    expect(isAiBot(null)).toBe(false);
  });

  it("counts search engines as bots but not as AI vendors", () => {
    const google = identifyBot("Mozilla/5.0 (compatible; Googlebot/2.1)");
    expect(google?.vendor).toBe("Google");
    expect(isAiBot(google)).toBe(false);
  });
});

describe("Meta CAPI request contract", () => {
  // Validates the exact shape Meta requires, without a network call, so the
  // integration is known-correct before real credentials exist. Getting this
  // wrong is normally discovered by staring at Events Manager for an afternoon.
  async function captureRequest(): Promise<{ url: string; payload: Record<string, unknown> }> {
    const original = globalThis.fetch;
    let captured: { url: string; payload: Record<string, unknown> } | null = null;
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      captured = { url: String(url), payload: JSON.parse(String(init.body)) };
      return new Response(JSON.stringify({ events_received: 1, messages: [], fbtrace_id: "t" }), {
        status: 200,
      });
    }) as unknown as typeof fetch;

    process.env.META_DATASET_ID = "111222333";
    process.env.META_CAPI_ACCESS_TOKEN = "test-token";
    delete process.env.META_TEST_EVENT_CODE;

    const { sendMetaEvent } = await import("@/lib/analytics/server/meta-capi");
    await sendMetaEvent({
      eventName: "Lead",
      eventId: "evt-abc",
      eventSourceUrl: "https://programo.pl/kontakt?fbclid=XYZ",
      user: {
        email: " Jan.Kowalski@Example.PL ",
        phone: "+48 601 234 567",
        firstName: "Łukasz",
        lastName: "Nowak",
        externalId: "visitor-1",
        clientIpAddress: "1.2.3.4",
        clientUserAgent: "Mozilla/5.0",
        fbp: "fb.1.123.456",
        fbc: "fb.1.123.XYZ",
      },
      customData: { value: 500, currency: "PLN" },
    });

    globalThis.fetch = original;
    return captured!;
  }

  it("posts to the pinned Graph version and dataset", async () => {
    const { url } = await captureRequest();
    expect(url).toContain("https://graph.facebook.com/v25.0/111222333/events");
  });

  it("sends the required server-event fields", async () => {
    const { payload } = await captureRequest();
    const event = (payload.data as Record<string, unknown>[])[0];
    expect(event.event_name).toBe("Lead");
    expect(event.action_source).toBe("website");
    expect(event.event_source_url).toContain("programo.pl");
    // Must be a STRING — a number here silently breaks deduplication.
    expect(typeof event.event_id).toBe("string");
    // Seconds, not milliseconds. Meta rejects the whole request if it looks
    // older than 7 days, which is what a ms value would look like.
    const now = Math.floor(Date.now() / 1000);
    expect(Math.abs((event.event_time as number) - now)).toBeLessThan(60);
  });

  it("hashes match keys and leaves cookies, IP and UA in the clear", async () => {
    const { payload } = await captureRequest();
    const ud = (payload.data as Record<string, unknown>[])[0].user_data as Record<string, unknown>;
    for (const key of ["em", "ph", "fn", "ln", "country", "external_id"]) {
      expect((ud[key] as string[])[0], `${key} should be a SHA-256 hex digest`).toMatch(/^[a-f0-9]{64}$/);
    }
    // Hashing any of these destroys matching outright.
    expect(ud.client_ip_address).toBe("1.2.3.4");
    expect(ud.client_user_agent).toBe("Mozilla/5.0");
    expect(ud.fbp).toBe("fb.1.123.456");
    expect(ud.fbc).toBe("fb.1.123.XYZ");
  });

  it("omits test_event_code unless explicitly set", async () => {
    const { payload } = await captureRequest();
    // Meta requires it absent on production payloads.
    expect(payload.test_event_code).toBeUndefined();
  });

  it("skips entirely when credentials are missing", async () => {
    delete process.env.META_DATASET_ID;
    delete process.env.META_CAPI_ACCESS_TOKEN;
    const { sendMetaEvent } = await import("@/lib/analytics/server/meta-capi");
    const res = await sendMetaEvent({
      eventName: "Lead",
      eventId: "x",
      eventSourceUrl: "https://programo.pl/",
      user: {},
    });
    expect(res).toEqual({ ok: false, skipped: true, reason: "not_configured" });
  });
});
