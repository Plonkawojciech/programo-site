import { describe, it, expect } from "vitest";
import {
  buildSessions,
  sessionPath,
  buildFormFunnel,
  buildQualitySignals,
  buildConsentSummary,
  buildAiCrawlerSummary,
  countAiReferredSessions,
  attributionField,
  type SessionSummary,
} from "@/lib/analytics/query";
import type { EventBatch, StoredEvent } from "@/lib/analytics/store";

function ev(event: string, ts: number, params: Record<string, unknown> = {}, path = "/"): StoredEvent {
  return { event, event_id: `${event}-${ts}`, ts, path, params };
}

function batch(overrides: Partial<EventBatch> & { session_id: string; events: StoredEvent[] }): EventBatch {
  return {
    received: new Date(overrides.events[0]?.ts ?? Date.now()).toISOString(),
    visitor_id: "visitor-1",
    ...overrides,
  };
}

describe("buildSessions", () => {
  it("groups multiple batches of the same session and sorts events by ts", () => {
    const s1 = batch({
      session_id: "s1",
      page_views: 1,
      country: "PL",
      device: "mobile",
      browser: "Safari",
      events: [ev("page_view_spa", 1000), ev("form_view", 1200, { form_id: "hero" })],
    });
    const s2 = batch({
      session_id: "s1",
      page_views: 2,
      events: [ev("form_start", 1500, { form_id: "hero" }), ev("generate_lead", 2000, { form_id: "hero" })],
    });
    const other = batch({ session_id: "s2", events: [ev("page_view_spa", 5000)] });

    const sessions = buildSessions([other, s1, s2]);
    expect(sessions).toHaveLength(2);

    const s1session = sessions.find((s) => s.sessionId === "s1")!;
    expect(s1session.events.map((e) => e.event)).toEqual([
      "page_view_spa",
      "form_view",
      "form_start",
      "generate_lead",
    ]);
    expect(s1session.start).toBe(1000);
    expect(s1session.end).toBe(2000);
    expect(s1session.pageViews).toBe(2); // max across the session's batches
    expect(s1session.country).toBe("PL");
    expect(s1session.hasLead).toBe(true);
  });

  it("skips batches without a session_id and batches with no events", () => {
    const noSession = { ...batch({ session_id: "x", events: [ev("page_view_spa", 1) ] }), session_id: "" };
    const empty = batch({ session_id: "s-empty", events: [] });
    const real = batch({ session_id: "s-real", events: [ev("page_view_spa", 10)] });
    const sessions = buildSessions([noSession, empty, real]);
    expect(sessions.map((s) => s.sessionId)).toEqual(["s-real"]);
  });

  it("sorts sessions newest-first", () => {
    const early = batch({ session_id: "early", events: [ev("page_view_spa", 100)] });
    const late = batch({ session_id: "late", events: [ev("page_view_spa", 9000)] });
    const sessions = buildSessions([early, late]);
    expect(sessions.map((s) => s.sessionId)).toEqual(["late", "early"]);
  });

  it("sums engaged_time and takes the max scroll_depth", () => {
    const b = batch({
      session_id: "s1",
      events: [
        ev("page_view_spa", 1),
        ev("engaged_time", 2, { seconds: 12 }),
        ev("engaged_time", 3, { seconds: 8 }),
        ev("scroll_depth", 4, { percent: 25 }),
        ev("scroll_depth", 5, { percent: 75 }),
        ev("scroll_depth", 6, { percent: 50 }),
      ],
    });
    const [session] = buildSessions([b]);
    expect(session.engagedSeconds).toBe(20);
    expect(session.maxScrollPct).toBe(75);
  });

  it("flags quality events without duplicating repeats", () => {
    const b = batch({
      session_id: "s1",
      events: [
        ev("rage_click", 1, { element: "button", section: "oferta" }),
        ev("rage_click", 2, { element: "button", section: "oferta" }),
        ev("form_abandon", 3, {}),
      ],
    });
    const [session] = buildSessions([b]);
    expect(session.qualityFlags.sort()).toEqual(["form_abandon", "rage_click"]);
  });
});

describe("sessionPath", () => {
  const base: SessionSummary = {
    sessionId: "s1",
    visitorId: "v1",
    start: 0,
    end: 0,
    pageViews: 0,
    engagedSeconds: 0,
    maxScrollPct: 0,
    events: [],
    hasLead: false,
    qualityFlags: [],
  };

  it("renders page_view_spa as page_view and inlines the mapped param", () => {
    const session: SessionSummary = {
      ...base,
      events: [
        ev("page_view_spa", 1),
        ev("section_view", 2, { section: "oferta" }),
        ev("form_start", 3, { form_id: "hero" }),
        ev("form_error", 4, { field: "phone" }),
        ev("form_abandon", 5),
      ],
    };
    expect(sessionPath(session)).toEqual([
      "page_view",
      "section_view(oferta)",
      "form_start",
      "form_error(phone)",
      "form_abandon",
    ]);
  });

  it("hides noisy administrative events from the path", () => {
    const session: SessionSummary = {
      ...base,
      events: [
        ev("session_context", 1),
        ev("page_view_spa", 2),
        ev("scroll_depth", 3, { percent: 50 }),
        ev("web_vitals", 4, { metric_name: "LCP" }),
        ev("engaged_time", 5, { seconds: 10 }),
      ],
    };
    expect(sessionPath(session)).toEqual(["page_view"]);
  });
});

describe("buildFormFunnel", () => {
  function sessionWith(events: StoredEvent[]): SessionSummary {
    return {
      sessionId: Math.random().toString(36),
      visitorId: "v",
      start: events[0]?.ts ?? 0,
      end: events[events.length - 1]?.ts ?? 0,
      pageViews: 1,
      engagedSeconds: 0,
      maxScrollPct: 0,
      events,
      hasLead: events.some((e) => e.event === "generate_lead"),
      qualityFlags: [],
    };
  }

  it("computes step counts and a sessions-based abandonment rate", () => {
    const sessions = [
      sessionWith([ev("form_view", 1)]), // viewed only
      sessionWith([ev("form_view", 1), ev("form_start", 2)]), // started, abandoned
      sessionWith([ev("form_view", 1), ev("form_start", 2), ev("generate_lead", 3)]), // converted
    ];
    const funnel = buildFormFunnel(sessions);
    expect(funnel.viewSessions).toBe(3);
    expect(funnel.startSessions).toBe(2);
    expect(funnel.submitSessions).toBe(1);
    // 1 - (1 submit / 2 started) = 0.5 -- computed on SESSIONS, not by counting form_abandon events.
    expect(funnel.abandonmentRate).toBe(0.5);
  });

  it("never divides by zero when a step has no sessions", () => {
    const funnel = buildFormFunnel([]);
    expect(funnel.viewToStartRate).toBeNull();
    expect(funnel.abandonmentRate).toBeNull();
  });

  it("aggregates per-field completions, median seconds, skips and errors", () => {
    const sessions = [
      sessionWith([
        ev("form_field_complete", 1, { field: "name", seconds: 4 }),
        ev("form_field_complete", 2, { field: "phone", seconds: 10 }),
        ev("form_error", 3, { field: "phone", message: "Nieprawidłowy numer" }),
      ]),
      sessionWith([
        ev("form_field_complete", 1, { field: "name", seconds: 6 }),
        ev("form_field_skip", 2, { field: "budget" }),
        ev("form_error", 3, { field: "phone", message: "Nieprawidłowy numer" }),
      ]),
    ];
    const funnel = buildFormFunnel(sessions);
    const nameRow = funnel.fields.find((f) => f.field === "name")!;
    expect(nameRow.completions).toBe(2);
    expect(nameRow.medianSeconds).toBe(5); // median of [4, 6]

    const phoneRow = funnel.fields.find((f) => f.field === "phone")!;
    expect(phoneRow.completions).toBe(1);
    expect(phoneRow.errors).toBe(2);
    expect(phoneRow.errorMessages).toEqual([{ message: "Nieprawidłowy numer", count: 2 }]);

    const budgetRow = funnel.fields.find((f) => f.field === "budget")!;
    expect(budgetRow.skips).toBe(1);

    // The costliest field (errors+skips) sorts first.
    expect(funnel.fields[0].field).toBe("phone");
  });
});

describe("buildQualitySignals", () => {
  function sessionWith(events: StoredEvent[]): SessionSummary {
    return {
      sessionId: "s",
      visitorId: "v",
      start: 0,
      end: 0,
      pageViews: 1,
      engagedSeconds: 0,
      maxScrollPct: 0,
      events,
      hasLead: false,
      qualityFlags: [],
    };
  }

  it("groups rage/dead clicks by section+element WITHOUT corrupting elements that contain spaces", () => {
    // Regression guard: `element` is DOM text content (describe() in engagement.ts)
    // and routinely contains spaces, e.g. `button.cta"Zamów wycenę"`. A naive
    // "section element".split(" ") join/split would truncate this.
    const sessions = [
      sessionWith([
        ev("rage_click", 1, { element: 'button.cta"Zamów wycenę teraz"', section: "oferta" }),
        ev("rage_click", 2, { element: 'button.cta"Zamów wycenę teraz"', section: "oferta" }),
      ]),
    ];
    const quality = buildQualitySignals(sessions);
    expect(quality.rageClicks).toEqual([
      { section: "oferta", element: 'button.cta"Zamów wycenę teraz"', count: 2 },
    ]);
  });

  it("keeps distinct sections with the same element separate", () => {
    const sessions = [
      sessionWith([
        ev("dead_click", 1, { element: "div.card", section: "oferta" }),
        ev("dead_click", 2, { element: "div.card", section: "cennik" }),
      ]),
    ];
    const quality = buildQualitySignals(sessions);
    expect(quality.deadClicks).toHaveLength(2);
    expect(quality.deadClicks.map((c) => c.section).sort()).toEqual(["cennik", "oferta"]);
  });

  it("groups js_error by message and web_vitals by metric+rating", () => {
    const sessions = [
      sessionWith([
        ev("js_error", 1, { message: "TypeError: x is not a function" }),
        ev("js_error", 2, { message: "TypeError: x is not a function" }),
        ev("web_vitals", 3, { metric_name: "LCP", metric_rating: "good" }),
        ev("web_vitals", 4, { metric_name: "LCP", metric_rating: "poor" }),
        ev("web_vitals", 5, { metric_name: "CLS", metric_rating: "good" }),
      ]),
    ];
    const quality = buildQualitySignals(sessions);
    expect(quality.jsErrors).toEqual([{ message: "TypeError: x is not a function", count: 2 }]);

    const lcp = quality.webVitals.find((v) => v.metric === "LCP")!;
    expect(lcp.good).toBe(1);
    expect(lcp.poor).toBe(1);
    expect(lcp.total).toBe(2);
  });
});

describe("buildConsentSummary", () => {
  function sessionWith(events: StoredEvent[]): SessionSummary {
    return {
      sessionId: "s",
      visitorId: "v",
      start: 0,
      end: 0,
      pageViews: 1,
      engagedSeconds: 0,
      maxScrollPct: 0,
      events,
      hasLead: false,
      qualityFlags: [],
    };
  }

  it("tallies granted/denied per category when boolean params are present", () => {
    const sessions = [
      sessionWith([
        ev("consent_update", 1, { analytics: true, marketing: false }),
        ev("consent_update", 2, { analytics: false, marketing: false }),
      ]),
    ];
    const consent = buildConsentSummary(sessions);
    expect(consent.totalEvents).toBe(2);
    expect(consent.hasCategoryData).toBe(true);
    expect(consent.analyticsGranted).toBe(1);
    expect(consent.analyticsDenied).toBe(1);
    expect(consent.marketingDenied).toBe(2);
  });

  it("reports totalEvents without category data when params are unrecognised", () => {
    const sessions = [sessionWith([ev("consent_update", 1, { raw: "something" })])];
    const consent = buildConsentSummary(sessions);
    expect(consent.totalEvents).toBe(1);
    expect(consent.hasCategoryData).toBe(false);
  });

  it("is empty when no consent_update events exist at all", () => {
    const consent = buildConsentSummary([]);
    expect(consent.totalEvents).toBe(0);
    expect(consent.hasCategoryData).toBe(false);
  });
});

describe("buildAiCrawlerSummary", () => {
  it("splits bot totals from per-path breakdowns and sorts by volume", () => {
    const daily: { date: string; counts: Record<string, number> }[] = [
      { date: "2026-08-01", counts: { GPTBot: 3, "GPTBot|/oferta": 2, "GPTBot|/": 1 } },
      { date: "2026-08-02", counts: { GPTBot: 1, "GPTBot|/oferta": 1, ClaudeBot: 5, "ClaudeBot|/": 5 } },
    ];
    const bots = buildAiCrawlerSummary(daily);
    expect(bots.map((b) => b.bot)).toEqual(["ClaudeBot", "GPTBot"]); // higher total first
    const gptbot = bots.find((b) => b.bot === "GPTBot")!;
    expect(gptbot.total).toBe(4);
    expect(gptbot.paths).toEqual(
      expect.arrayContaining([
        { path: "/oferta", count: 3 },
        { path: "/", count: 1 },
      ]),
    );
  });
});

describe("countAiReferredSessions / attributionField", () => {
  it("counts sessions whose attribution.referrer_class is ai", () => {
    const s = (referrer_class?: string): SessionSummary => ({
      sessionId: Math.random().toString(36),
      visitorId: "v",
      start: 0,
      end: 0,
      pageViews: 1,
      engagedSeconds: 0,
      maxScrollPct: 0,
      events: [],
      hasLead: false,
      qualityFlags: [],
      attribution: referrer_class ? { referrer_class } : undefined,
    });
    const sessions = [s("ai"), s("search"), s("ai"), s(undefined)];
    expect(countAiReferredSessions(sessions)).toBe(2);
  });

  it("attributionField returns undefined for missing/empty values", () => {
    expect(attributionField(undefined, "source")).toBeUndefined();
    expect(attributionField({ source: "" }, "source")).toBeUndefined();
    expect(attributionField({ source: "google_ads" }, "source")).toBe("google_ads");
  });
});
