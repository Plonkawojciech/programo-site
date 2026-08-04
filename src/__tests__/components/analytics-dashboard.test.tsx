import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalyticsDashboard from "@/app/crm/analytics/AnalyticsDashboard";
import type { AnalyticsDashboardData, SessionSummary } from "@/lib/analytics/query";

/** The value <p> is the label's next sibling inside the same stat card. */
function statValue(labelText: string): string | null {
  const label = screen.getByText(labelText);
  return label.nextElementSibling?.textContent ?? null;
}

function session(overrides: Partial<SessionSummary> = {}): SessionSummary {
  return {
    sessionId: "sess-1",
    visitorId: "visitor-1",
    start: Date.parse("2026-08-01T10:00:00.000Z"),
    end: Date.parse("2026-08-01T10:05:00.000Z"),
    pageViews: 3,
    engagedSeconds: 96,
    maxScrollPct: 80,
    country: "PL",
    device: "mobile",
    browser: "Safari",
    os: "iOS",
    attribution: { source: "google_ads", referrer_class: "search" },
    events: [
      { event: "page_view_spa", event_id: "e1", ts: 1, path: "/", params: {} },
      { event: "section_view", event_id: "e2", ts: 2, path: "/", params: { section: "oferta" } },
      { event: "form_start", event_id: "e3", ts: 3, path: "/", params: { form_id: "hero" } },
      { event: "generate_lead", event_id: "e4", ts: 4, path: "/", params: { form_id: "hero" } },
    ],
    hasLead: true,
    qualityFlags: [],
    ...overrides,
  };
}

function baseData(overrides: Partial<AnalyticsDashboardData> = {}): AnalyticsDashboardData {
  return {
    configured: true,
    sessions: [session()],
    funnel: {
      viewSessions: 15,
      startSessions: 9,
      submitSessions: 3,
      failedSessions: 0,
      viewToStartRate: 9 / 15,
      startToSubmitRate: 3 / 9,
      abandonmentRate: 1 - 3 / 9,
      fields: [
        {
          field: "phone",
          completions: 2,
          medianSeconds: 5,
          skips: 1,
          errors: 2,
          errorMessages: [{ message: "Nieprawidłowy numer telefonu", count: 2 }],
        },
      ],
    },
    quality: {
      rageClicks: [{ section: "oferta", element: 'button "Zamów wycenę"', count: 3 }],
      deadClicks: [],
      jsErrors: [{ message: "TypeError: cannot read x", count: 1 }],
      webVitals: [{ metric: "LCP", good: 4, needsImprovement: 1, poor: 0, unknown: 0, total: 5 }],
    },
    consent: {
      totalEvents: 170,
      analyticsGranted: 61,
      analyticsDenied: 24,
      marketingGranted: 33,
      marketingDenied: 52,
      hasCategoryData: true,
    },
    aiCrawlers: [{ bot: "GPTBot", total: 12, paths: [{ path: "/oferta", count: 8 }] }],
    aiReferredSessions: 2,
    batchCount: 42,
    ...overrides,
  };
}

describe("AnalyticsDashboard - not configured", () => {
  it("shows a friendly message instead of crashing when Redis is not set up", () => {
    render(<AnalyticsDashboard data={baseData({ configured: false, sessions: [] })} />);
    expect(screen.getByText("Magazyn zdarzeń nieskonfigurowany")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /wróć do leadów/i })).toHaveAttribute("href", "/crm");
  });
});

describe("AnalyticsDashboard - configured, with injected data", () => {
  it("renders the session row with source, device, badges and the readable event path", () => {
    render(<AnalyticsDashboard data={baseData()} />);
    expect(screen.getByText("PL")).toBeInTheDocument();
    expect(screen.getByText(/mobile - Safari/)).toBeInTheDocument();
    expect(screen.getByText("Lead")).toBeInTheDocument();
    expect(
      screen.getByText("page_view → section_view(oferta) → form_start → generate_lead"),
    ).toBeInTheDocument();
    // Full per-event table is present in the DOM for the expandable row.
    expect(screen.getAllByText("form_start").length).toBeGreaterThan(0);
  });

  it("marks quality-flagged sessions", () => {
    render(
      <AnalyticsDashboard
        data={baseData({ sessions: [session({ qualityFlags: ["rage_click", "form_abandon"] })] })}
      />,
    );
    expect(screen.getByText("rage_click")).toBeInTheDocument();
    expect(screen.getByText("form_abandon")).toBeInTheDocument();
  });

  it("renders the funnel steps and the sessions-based abandonment rate", () => {
    render(<AnalyticsDashboard data={baseData()} />);
    expect(statValue("Formularz widoczny")).toBe("15");
    expect(statValue("Rozpoczęty")).toBe("9");
    expect(statValue("Wysłany")).toBe("3");
    // 1 - (3 submitted / 9 started), computed on sessions -- not by counting form_abandon events.
    expect(screen.getByText("67%")).toBeInTheDocument();
  });

  it("renders the per-field funnel table with completions, median time, skips and errors", () => {
    render(<AnalyticsDashboard data={baseData()} />);
    expect(screen.getByText("phone")).toBeInTheDocument();
    expect(screen.getByText("5 s")).toBeInTheDocument();
    expect(screen.getByText(/Nieprawidłowy numer telefonu ×2/)).toBeInTheDocument();
  });

  it("renders quality signals: rage clicks, js errors and a web vitals distribution", () => {
    render(<AnalyticsDashboard data={baseData()} />);
    expect(screen.getByText('button "Zamów wycenę"')).toBeInTheDocument();
    expect(screen.getByText("TypeError: cannot read x")).toBeInTheDocument();
    expect(screen.getByText("LCP")).toBeInTheDocument();
  });

  it("renders AI crawler hits and the AI-referred human session count", () => {
    render(<AnalyticsDashboard data={baseData()} />);
    expect(screen.getByText("GPTBot")).toBeInTheDocument();
    expect(screen.getByText(/2 sesje ludzkie/)).toBeInTheDocument();
  });

  it("renders the consent breakdown as the stated denominator", () => {
    render(<AnalyticsDashboard data={baseData()} />);
    expect(screen.getByText("Zgody")).toBeInTheDocument();
    expect(statValue("Analityka - zgoda")).toBe("61");
    expect(statValue("Analityka - odmowa")).toBe("24");
    expect(statValue("Marketing - zgoda")).toBe("33");
    expect(statValue("Marketing - odmowa")).toBe("52");
  });

  it("shows an explicit empty state for consent when no consent_update events exist yet", () => {
    render(
      <AnalyticsDashboard
        data={baseData({
          consent: {
            totalEvents: 0,
            analyticsGranted: 0,
            analyticsDenied: 0,
            marketingGranted: 0,
            marketingDenied: 0,
            hasCategoryData: false,
          },
        })}
      />,
    );
    expect(screen.getByText(/Brak zarejestrowanych zdarzeń consent_update/)).toBeInTheDocument();
  });

  it("shows an empty state for sessions instead of an empty page", () => {
    render(<AnalyticsDashboard data={baseData({ sessions: [] })} />);
    expect(screen.getByText("Brak zarejestrowanych sesji.")).toBeInTheDocument();
  });
});
