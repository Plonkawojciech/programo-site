import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/collect/route";

const storage = vi.hoisted(() => ({
  isRateLimited: vi.fn().mockResolvedValue(false),
  storeEventBatch: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/analytics/store", () => storage);

function request(body?: string) {
  return new NextRequest("https://v3.programo.pl/api/collect", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      "x-forwarded-for": "203.0.113.9",
      cookie: `programo-consent=${encodeURIComponent(JSON.stringify({ analytics: true, marketing: true }))}`,
    },
    body: body ?? JSON.stringify({
      visitor_id: "synthetic-visitor",
      session_id: "synthetic-session",
      events: [{ event: "consent_update", event_id: "synthetic-consent", ts: Date.now(), path: "/", params: { analytics: true, marketing: true } }],
    }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("PROGRAMO_DEPLOYMENT_ENV", "production");
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("collect deployment isolation", () => {
  it.each([undefined, "invalid JSON"])("returns 204 in runtime preview before payload/rate-limit/storage even with granted consent (%s)", async (body) => {
    vi.stubEnv("PROGRAMO_DEPLOYMENT_ENV", "preview");
    const req = request(body);
    const readBody = vi.spyOn(req, "json");
    const response = await POST(req);
    expect(response.status).toBe(204);
    expect(readBody).not.toHaveBeenCalled();
    expect(storage.isRateLimited).not.toHaveBeenCalled();
    expect(storage.storeEventBatch).not.toHaveBeenCalled();
  });

  it("preserves production validation and event storage", async () => {
    const response = await POST(request());
    expect(response.status).toBe(204);
    expect(storage.isRateLimited).toHaveBeenCalledWith("203.0.113.9");
    expect(storage.storeEventBatch).toHaveBeenCalledTimes(1);
    expect(storage.storeEventBatch).toHaveBeenCalledWith(expect.objectContaining({
      visitor_id: "synthetic-visitor",
      session_id: "synthetic-session",
      events: [expect.objectContaining({ event: "consent_update", event_id: "synthetic-consent" })],
    }));
  });

  it("still discards invalid production JSON without storing", async () => {
    const response = await POST(request("invalid JSON"));
    expect(response.status).toBe(204);
    expect(storage.isRateLimited).toHaveBeenCalledTimes(1);
    expect(storage.storeEventBatch).not.toHaveBeenCalled();
  });
});
