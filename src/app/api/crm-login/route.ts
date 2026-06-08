import { NextRequest, NextResponse } from "next/server";
import { verifyCreds, setSessionCookie } from "@/lib/crm-auth";

// In-memory rate limiter: IP -> timestamps[] of FAILED attempts.
// Per-process only; resets on cold start. Good enough to blunt brute force on a
// 2-founder internal tool, layered with the artificial delay below.
//
// NOTE: the client IP is derived from x-forwarded-for / x-real-ip, which a
// caller can spoof unless a trusted proxy (e.g. Vercel) overwrites them. This
// limiter is therefore a best-effort speed bump, not a hard control — the real
// gate is the signed-token scheme and the high-entropy CRM_PASSWORD.
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const FAILED_ATTEMPT_DELAY_MS = 300; // constant artificial delay to slow guessing
const MAX_TRACKED_IPS = 10_000; // cap map growth so spoofed IPs can't OOM the process

// Returns the recent (in-window) failed-attempt timestamps for an IP, pruning
// expired entries. Does NOT record a new attempt — call recordFailure for that.
function recentFailures(ip: string, now: number): number[] {
  const timestamps = rateLimitMap.get(ip) || [];
  return timestamps.filter((t) => now - t < RATE_WINDOW_MS);
}

function isRateLimited(ip: string, now: number): boolean {
  const recent = recentFailures(ip, now);
  if (recent.length === 0) {
    rateLimitMap.delete(ip); // keep the map small for idle IPs
    return false;
  }
  rateLimitMap.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

// Record a failed attempt against an IP, bounding total map size.
function recordFailure(ip: string, now: number): void {
  const recent = recentFailures(ip, now);
  recent.push(now);
  if (!rateLimitMap.has(ip) && rateLimitMap.size >= MAX_TRACKED_IPS) {
    // Evict the oldest-inserted entry (Map preserves insertion order) to bound
    // memory under a spoofed-IP flood.
    const oldest = rateLimitMap.keys().next().value;
    if (oldest !== undefined) rateLimitMap.delete(oldest);
  }
  rateLimitMap.set(ip, recent);
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const now = Date.now();

  if (isRateLimited(ip, now)) {
    // Apply the same artificial delay as a failed attempt so a throttled
    // attacker gains no timing signal from the 429 path.
    await sleep(FAILED_ATTEMPT_DELAY_MS);
    return NextResponse.json(
      { error: "Zbyt wiele prób. Spróbuj ponownie za chwilę." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe żądanie." },
      { status: 400 }
    );
  }

  const { email, password } =
    (body as { email?: unknown; password?: unknown }) || {};
  const emailStr = typeof email === "string" ? email : "";
  const passwordStr = typeof password === "string" ? password : "";

  if (!verifyCreds(emailStr, passwordStr)) {
    // Only failed attempts consume the rate-limit budget, so legitimate logins
    // are never throttled. Constant artificial delay to slow brute force;
    // generic message only, never revealing whether email or password was wrong.
    recordFailure(ip, now);
    await sleep(FAILED_ATTEMPT_DELAY_MS);
    return NextResponse.json(
      { error: "Nieprawidłowy e-mail lub hasło." },
      { status: 401 }
    );
  }

  // Successful login: clear any recorded failures for this IP.
  rateLimitMap.delete(ip);

  const res = NextResponse.json({ ok: true });
  setSessionCookie(res);
  return res;
}
