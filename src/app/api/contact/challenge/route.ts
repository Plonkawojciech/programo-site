import { NextResponse } from "next/server";
import { issueChallenge } from "@/lib/form-challenge";

/**
 * Hands a lead form its signed challenge. Cheap (one HMAC, no state), so it
 * is not rate-limited; the cost lives on the client, which has to grind the
 * proof of work before /api/contact will listen. See lib/form-challenge.ts.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(issueChallenge(), {
    headers: { "Cache-Control": "no-store" },
  });
}
