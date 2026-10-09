import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

const identity = vi.hoisted(() => ({
  getSession: vi.fn(() => ({ id: "synthetic-session", number: 1, views: 1 })),
  getVisitorId: vi.fn(() => "synthetic-visitor"),
  bumpSessionViews: vi.fn(),
}));
const attribution = vi.hoisted(() => ({
  attributionSummary: vi.fn(() => ({})),
  deriveFbc: vi.fn(),
  readFbp: vi.fn(),
}));
vi.mock("@/lib/analytics/identity", () => identity);
vi.mock("@/lib/analytics/attribution", () => attribution);

let windowListeners: MockInstance<typeof window.addEventListener>;
let documentListeners: MockInstance<typeof document.addEventListener>;
const fetchMock = vi.fn().mockResolvedValue({ ok: true });
const beaconMock = vi.fn(() => true);
const gtagMock = vi.fn();
const fbqMock = vi.fn();

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.stubEnv("NEXT_PUBLIC_PROGRAMO_DEPLOYMENT_ENV", "production");
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("navigator", { language: "pl-PL", sendBeacon: beaconMock });
  window.gtag = gtagMock;
  window.fbq = fbqMock;
  localStorage.setItem("programo-consent-v1", JSON.stringify({ analytics: true, marketing: true, decided: true }));
  windowListeners = vi.spyOn(window, "addEventListener");
  documentListeners = vi.spyOn(document, "addEventListener");
});

afterEach(() => {
  // Module resets do not remove DOM listeners; remove only this test's calls.
  for (const [type, listener, options] of windowListeners.mock.calls) window.removeEventListener(type, listener, options);
  for (const [type, listener, options] of documentListeners.mock.calls) document.removeEventListener(type, listener, options);
  delete window.gtag;
  delete window.fbq;
  localStorage.removeItem("programo-consent-v1");
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("preview analytics isolation", () => {
  it("does not record or send after Accept all, a timer, explicit flush or page hide", async () => {
    vi.stubEnv("NEXT_PUBLIC_PROGRAMO_DEPLOYMENT_ENV", "preview");
    const client = await import("@/lib/analytics/client");
    expect(client.track("consent_update", { analytics: true, marketing: true, event_id: "accepted-consent" })).toBe("accepted-consent");
    client.track("generate_lead", { event_id: "synthetic-lead" });
    client.trackPageView("/");
    client.trackPageView("/cennik");
    client.trackSessionContext();
    client.flush();
    client.flush(true);
    await vi.advanceTimersByTimeAsync(3100);
    window.dispatchEvent(new Event("pagehide"));
    document.dispatchEvent(new Event("visibilitychange"));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(beaconMock).not.toHaveBeenCalled();
    expect(gtagMock).not.toHaveBeenCalled();
    expect(fbqMock).not.toHaveBeenCalled();
    expect(identity.getSession).not.toHaveBeenCalled();
    expect(identity.getVisitorId).not.toHaveBeenCalled();
    expect(identity.bumpSessionViews).not.toHaveBeenCalled();
    expect(attribution.attributionSummary).not.toHaveBeenCalled();
    expect(windowListeners.mock.calls.some(([type]) => type === "pagehide")).toBe(false);
    expect(documentListeners.mock.calls.some(([type]) => type === "visibilitychange")).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([false, true])("drops a previously queued batch for preview flush(useBeacon=%s)", async (useBeacon) => {
    const client = await import("@/lib/analytics/client");
    client.track("page_view_spa");
    expect(vi.getTimerCount()).toBe(1);
    identity.getSession.mockClear();
    identity.getVisitorId.mockClear();
    vi.stubEnv("NEXT_PUBLIC_PROGRAMO_DEPLOYMENT_ENV", "preview");
    client.flush(useBeacon);
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(3100);
    window.dispatchEvent(new Event("pagehide")); // Already-bound production listener.
    expect(fetchMock).not.toHaveBeenCalled();
    expect(beaconMock).not.toHaveBeenCalled();
    expect(identity.getSession).not.toHaveBeenCalled();
    expect(identity.getVisitorId).not.toHaveBeenCalled();
    vi.stubEnv("NEXT_PUBLIC_PROGRAMO_DEPLOYMENT_ENV", "production");
    client.flush();
    expect(fetchMock).not.toHaveBeenCalled(); // Discarded data is not replayed.
  });
});

describe("production analytics controls", () => {
  it("still batches consent and lead events and invokes granted provider tags", async () => {
    const client = await import("@/lib/analytics/client");
    client.track("consent_update", { analytics: true, marketing: true, event_id: "consent-prod" });
    client.track("generate_lead", { event_id: "lead-prod" });
    expect(fetchMock).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(3000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/collect", expect.objectContaining({ method: "POST", keepalive: true }));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.events.map((event: { event: string; event_id: string }) => [event.event, event.event_id])).toEqual([["consent_update", "consent-prod"], ["generate_lead", "lead-prod"]]);
    expect(gtagMock).toHaveBeenCalledWith("event", "generate_lead", expect.objectContaining({ event_id: "lead-prod" }));
    expect(fbqMock).toHaveBeenCalledWith("track", "Lead", expect.any(Object), { eventID: "lead-prod" });
  });

  it.each([false, true])("keeps cookieless GA and marketing consent semantics when analytics is denied (marketing=%s)", async (marketing) => {
    localStorage.setItem("programo-consent-v1", JSON.stringify({ analytics: false, marketing, decided: true }));
    const client = await import("@/lib/analytics/client");
    client.track("generate_lead", { event_id: "denied-analytics" });
    await vi.advanceTimersByTimeAsync(3100);
    client.flush(true);
    expect(gtagMock).toHaveBeenCalledWith("event", "generate_lead", expect.any(Object));
    expect(fbqMock).toHaveBeenCalledTimes(marketing ? 1 : 0);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(beaconMock).not.toHaveBeenCalled();
  });

  it("retains production page-hide beacon delivery", async () => {
    const client = await import("@/lib/analytics/client");
    client.trackPageView("/");
    window.dispatchEvent(new Event("pagehide"));
    expect(beaconMock).toHaveBeenCalledTimes(1);
    expect(beaconMock).toHaveBeenCalledWith("/api/collect", expect.any(Blob));
    client.flush();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
