import { NextRequest, NextResponse } from "next/server";
import { collectSchema, parseUserAgent, isLikelyBot } from "@/lib/analytics/collect-schema";
import { storeEventBatch, isRateLimited, type StoredEvent } from "@/lib/analytics/store";

// First-party event sink.
//
// The browser batches events (analytics/client.ts) and posts them here every few
// seconds and on page hide. Requests are fire-and-forget: the response is always
// 204 and always fast, because a visitor must never wait on, or notice, analytics.
//
// Data minimisation: the client only sends here after ANALYTICS consent, and the
// payload carries no PII — identifiers are random, self-assigned, and never
// linked to a person unless that person submits the contact form themselves.

export const runtime = "nodejs";

/** Coarse country from the CDN, useful for segmentation, not identifying. */
function country(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    undefined
  );
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  // Always 204 — an analytics endpoint that returns errors teaches the client
  // to retry, which is the last thing we want on a visitor's connection.
  const ok = () => new NextResponse(null, { status: 204 });

  const ua = request.headers.get("user-agent") || "";
  if (isLikelyBot(ua)) return ok();
  if (await isRateLimited(clientIp(request))) return ok();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return ok();
  }

  const parsed = collectSchema.safeParse(body);
  if (!parsed.success) {
    console.warn("[collect] rejected payload:", parsed.error.issues[0]?.message);
    return ok();
  }

  const data = parsed.data;
  const agent = parseUserAgent(ua);

  const events: StoredEvent[] = data.events.map((e) => ({
    event: e.event,
    event_id: e.event_id,
    ts: e.ts,
    path: e.path,
    params: e.params ?? {},
  }));

  await storeEventBatch({
    received: new Date().toISOString(),
    visitor_id: data.visitor_id,
    session_id: data.session_id,
    session_number: data.session_number,
    page_views: data.page_views,
    tz_offset: data.tz_offset,
    screen: data.screen,
    viewport: data.viewport,
    language: data.language,
    device: agent.device,
    browser: agent.browser,
    os: agent.os,
    country: country(request),
    attribution: data.attribution,
    events,
  });

  return ok();
}
