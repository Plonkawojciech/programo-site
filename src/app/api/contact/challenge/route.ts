import { NextResponse, type NextRequest } from "next/server";
import { issueChallenge } from "@/lib/form-challenge";
import { clientIp, isOverAttemptLimit, isToolUserAgent } from "@/lib/request-guard";

/**
 * Hands a lead form its signed challenge. Cheap (one HMAC, no state); the
 * cost lives on the client, which has to grind the proof of work before
 * /api/contact will listen. See lib/form-challenge.ts.
 *
 * Scripts don't get a challenge at all, and one IP can't stockpile them:
 * 60 per 10 min is ~20 pages with three forms each — far past any visitor.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (isToolUserAgent(request.headers.get("user-agent"))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (await isOverAttemptLimit("challenge", clientIp(request.headers), 60, 600)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  return NextResponse.json(issueChallenge(), {
    headers: { "Cache-Control": "no-store" },
  });
}
