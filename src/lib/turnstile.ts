/** Server verification is mandatory. Missing configuration and provider outages fail closed. */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
export const TURNSTILE_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnforced(): boolean { return true; }
export function isTurnstileTestMode(): boolean {
  return process.env.NEXT_PUBLIC_TURNSTILE_TEST_MODE === "true";
}

export type TurnstileVerdict =
  | { ok: true }
  | { ok: false; reason: "missing" | "rejected" | "unavailable" | "configuration" };

function configuration(hostname: string): { secret: string; test: boolean } | null {
  const site = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const test = isTurnstileTestMode();
  // NODE_ENV=production is also used by preview builds. Deployment identity
  // must therefore be explicit, and public production hostnames never qualify.
  if (test) {
    const environment = process.env.PROGRAMO_DEPLOYMENT_ENV;
    if (!["preview", "development", "test"].includes(environment ?? "") ||
        /^(www\.)?programo\.pl$/i.test(hostname) ||
        site !== TURNSTILE_TEST_SITE_KEY || secret !== TURNSTILE_TEST_SECRET_KEY) return null;
  } else if (!site || !secret || /^[123]x0{10,}/.test(site) || /^[123]x0{10,}/.test(secret)) {
    return null;
  }
  return { secret: secret!, test };
}

/** Dummy challenges may only reach the dedicated local/private fixture, never live channels. */
export function isTestDeliveryIsolated(): boolean {
  if (!isTurnstileTestMode()) return true;
  const liveVars = ["KV_REST_API_URL", "UPSTASH_REDIS_REST_URL", "TELEGRAM_BOT_TOKEN", "MS_GRAPH_CLIENT_SECRET"];
  if (liveVars.some((key) => Boolean(process.env[key]))) return false;
  try {
    const url = new URL(process.env.CRM_INTAKE_URL ?? "");
    return ["localhost", "127.0.0.1", "[::1]", "preview-intake"].includes(url.hostname) &&
      url.protocol === "http:" && Boolean(process.env.CRM_WEBHOOK_SECRET);
  } catch { return false; }
}

/** Tokens expire after 300 seconds and are single-use; the widget resets after every attempt. */
export async function verifyTurnstile(token: string | undefined, ip: string, hostname = "programo.pl"): Promise<TurnstileVerdict> {
  const config = configuration(hostname);
  if (!config) return { ok: false, reason: "configuration" };
  if (!token) return { ok: false, reason: "missing" };
  if (config.test && token !== "XXXX.DUMMY.TOKEN.XXXX") return { ok: false, reason: "rejected" };
  const body: Record<string, string> = { secret: config.secret, response: token };
  if (ip && ip !== "unknown") body.remoteip = ip;
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return { ok: false, reason: "unavailable" };
    const data = await res.json() as { success?: boolean; hostname?: string; action?: string };
    if (data.success !== true) return { ok: false, reason: "rejected" };
    // Dummy keys have fixed metadata. Live keys must belong to this host/form action.
    if (!config.test && (data.hostname !== hostname || data.action !== "contact")) {
      return { ok: false, reason: "rejected" };
    }
    return { ok: true };
  } catch {
    console.error("[turnstile] verification unavailable");
    return { ok: false, reason: "unavailable" };
  }
}
