import { NextRequest, NextResponse } from "next/server";
import { verifyCreds, setSessionCookie } from "@/lib/crm-auth";

// In-memory rate limiter: IP -> timestamps[] (same pattern as the contact route).
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Zbyt wiele prób. Spróbuj ponownie za chwilę." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe żądanie" }, { status: 400 });
  }

  const { email, password } =
    (body as { email?: unknown; password?: unknown }) || {};
  const emailStr = typeof email === "string" ? email : "";
  const passwordStr = typeof password === "string" ? password : "";

  if (!verifyCreds(emailStr, passwordStr)) {
    return NextResponse.json(
      { error: "Nieprawidłowy e-mail lub hasło." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  setSessionCookie(res);
  return res;
}
