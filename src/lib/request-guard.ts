import { getRedis } from "@/lib/leads";

/** Cheap request/origin/rate filters; Turnstile supplies the mandatory human check. */
// A headless browser is allowed to exercise the same fixture flow as a real
// browser. Automation telemetry may flag review but must not reject assistive input.
const TOOL_UA =
  /\b(curl|wget|python-requests|python-urllib|python-httpx|aiohttp|httpx|scrapy|go-http-client|java\/|okhttp|apache-httpclient|libwww-perl|lwp::|php\/|guzzlehttp|node-fetch|undici|axios|postmanruntime|insomnia|httpie|powershell|phantomjs|zgrab|masscan|nikto|sqlmap)\b/i;

export function isToolUserAgent(ua: string | null): boolean {
  // An empty UA is not a browser either.
  if (!ua || ua.trim().length < 10) return true;
  return TOOL_UA.test(ua);
}

const ALLOWED_ORIGIN_HOSTS = [/^(www\.)?programo\.pl$/, /^localhost(:\d+)?$/, /^127\.0\.0\.1(:\d+)?$/, /^v3\.programo\.pl$/];

/** Standalone Next may build nextUrl from 0.0.0.0. Public Host must be allowlisted. */
export function publicRequestHostname(headers: Headers, fallback: string): string | null {
  const host = headers.get("host") ?? fallback;
  if (!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host)) return null;
  try {
    const hostname = new URL(`http://${host}`).hostname.toLowerCase();
    return ["programo.pl", "www.programo.pl", "v3.programo.pl", "localhost", "127.0.0.1"].includes(hostname)
      ? hostname : null;
  } catch { return null; }
}

/**
 * A browser's fetch POST always carries Origin. Missing or foreign Origin =
 * the request did not come from our page (a script posting straight at the
 * endpoint, or another site's form).
 */
export function isForeignOrigin(origin: string | null, expectedOrigin?: string): boolean {
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    if (!["http:", "https:"].includes(parsed.protocol)) return true;
    if (expectedOrigin && parsed.origin === expectedOrigin) return false;
    const host = parsed.host;
    return !ALLOWED_ORIGIN_HOSTS.some((re) => re.test(host));
  } catch {
    return true;
  }
}

// In-process fallback when Redis is not configured (local dev). On Vercel
// every function instance has its own memory, so this alone would let a bot
// spread its attempts across instances — hence Redis first.
const memory = new Map<string, number[]>();

/**
 * Sliding-ish fixed window counter, shared across all instances via Redis.
 * Counts EVERY attempt (rejected ones too), unlike recordSubmission in
 * contact-schema.ts, which only counts accepted leads. Fails open: a Redis
 * outage must not block real visitors.
 */
export async function isOverAttemptLimit(
  bucket: string,
  ip: string,
  limit: number,
  windowSec: number,
): Promise<boolean> {
  const key = `rl:${bucket}:${ip}`;
  const redis = getRedis();
  if (redis) {
    try {
      const n = await redis.incr(key);
      if (n === 1) await redis.expire(key, windowSec);
      return n > limit;
    } catch (e) {
      console.error("[request-guard] redis rate limit failed — failing open:", e);
      return false;
    }
  }
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowSec * 1000);
  recent.push(now);
  memory.set(key, recent);
  return recent.length > limit;
}

/** Tests only. */
export function _resetAttemptMemory() {
  memory.clear();
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
