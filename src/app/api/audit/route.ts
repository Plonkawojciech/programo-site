import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

export const runtime = "nodejs";
export const maxDuration = 30;

const auditSchema = z.object({
  url: z.string().min(3).max(300),
});

// In-memory rate limiter: IP -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 min

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function normalizeUrl(raw: string): string | null {
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

type Finding = { ok: boolean; text: string };
type Category = {
  key: string;
  label: string;
  icon: string;
  score: number;
  findings: Finding[];
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// --- Google PageSpeed Insights (optional, used when PAGESPEED_API_KEY present) ---
async function fetchPsi(url: string): Promise<{
  performance?: number;
  seo?: number;
  bestPractices?: number;
  accessibility?: number;
} | null> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return null;
  const cats = ["performance", "seo", "best-practices", "accessibility"]
    .map((c) => `category=${c}`)
    .join("&");
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&strategy=mobile&${cats}&key=${key}`;
  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) return null;
    const data = await res.json();
    const c = data?.lighthouseResult?.categories;
    if (!c) return null;
    const pick = (v: unknown) =>
      typeof v === "number" ? Math.round(v * 100) : undefined;
    return {
      performance: pick(c.performance?.score),
      seo: pick(c.seo?.score),
      bestPractices: pick(c["best-practices"]?.score),
      accessibility: pick(c.accessibility?.score),
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Za dużo audytów. Spróbuj ponownie za chwilę." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }
  const parsed = auditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Podaj poprawny adres strony." }, { status: 400 });
  }
  const target = normalizeUrl(parsed.data.url);
  if (!target) {
    return NextResponse.json(
      { error: "To nie wygląda na poprawny adres www." },
      { status: 400 }
    );
  }

  // --- Fetch the page (timing + HTML) ---
  let html = "";
  let finalUrl = target;
  let status = 0;
  let responseMs = 0;
  let headers: Headers | null = null;
  let reachable = true;
  const started = Date.now();
  try {
    const res = await fetch(target, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ProgramoAudyt/1.0; +https://programo.pl/audyt)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    responseMs = Date.now() - started;
    status = res.status;
    finalUrl = res.url || target;
    headers = res.headers;
    html = (await res.text()).slice(0, 600_000);
  } catch {
    reachable = false;
    responseMs = Date.now() - started;
  }

  if (!reachable) {
    return NextResponse.json(
      {
        error:
          "Nie udało się połączyć ze stroną. Sprawdź adres lub spróbuj ponownie.",
      },
      { status: 422, headers: { "Cache-Control": "no-store" } }
    );
  }

  // --- HTML heuristics ---
  const has = (re: RegExp) => re.test(html);
  const isHttps = finalUrl.startsWith("https://");
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "")
    .replace(/\s+/g, " ")
    .trim();
  const metaDescMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
  );
  const metaDesc = (metaDescMatch?.[1] || "").trim();
  const hasViewport = has(/<meta[^>]+name=["']viewport["']/i);
  const hasOgImage = has(/<meta[^>]+property=["']og:image["']/i);
  const hasOgTitle = has(/<meta[^>]+property=["']og:title["']/i);
  const hasFavicon = has(/<link[^>]+rel=["'][^"']*icon[^"']*["']/i);
  const hasManifest = has(/<link[^>]+rel=["']manifest["']/i);
  const hasLang = has(/<html[^>]+lang=/i);
  const hasCanonical = has(/<link[^>]+rel=["']canonical["']/i);
  const hasJsonLd = has(/<script[^>]+type=["']application\/ld\+json["']/i);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const htmlKb = Math.round(html.length / 1024);

  // security headers
  const hsts = !!headers?.get("strict-transport-security");
  const csp = !!headers?.get("content-security-policy");
  const xfo = !!headers?.get("x-frame-options");

  const psi = await fetchPsi(finalUrl);

  // --- Performance ---
  let perf: number;
  const perfFindings: Finding[] = [];
  if (psi?.performance != null) {
    perf = psi.performance;
    perfFindings.push({
      ok: perf >= 70,
      text: `Wynik wydajności (Google Lighthouse, mobile): ${perf}/100`,
    });
  } else {
    perf =
      responseMs < 300
        ? 95
        : responseMs < 600
        ? 85
        : responseMs < 1000
        ? 70
        : responseMs < 2000
        ? 52
        : responseMs < 4000
        ? 32
        : 15;
    perfFindings.push({
      ok: responseMs < 1000,
      text: `Czas odpowiedzi serwera: ${responseMs} ms`,
    });
  }
  perfFindings.push({
    ok: htmlKb < 250,
    text: `Rozmiar HTML: ${htmlKb} KB${htmlKb >= 250 ? " — ciężki dokument" : ""}`,
  });
  if (htmlKb >= 400) perf = clamp(perf - 8);

  // --- Mobile ---
  let mobile = hasViewport ? 88 : 32;
  if (psi?.bestPractices != null) mobile = clamp((mobile + psi.bestPractices) / 2);
  const mobileFindings: Finding[] = [
    {
      ok: hasViewport,
      text: hasViewport
        ? "Strona ma meta viewport (responsywność)"
        : "Brak meta viewport — strona może się źle skalować na telefonie",
    },
  ];

  // --- SEO ---
  let seo: number;
  const seoFindings: Finding[] = [];
  if (psi?.seo != null) {
    seo = psi.seo;
  } else {
    seo =
      (title ? 25 : 0) +
      (metaDesc ? 25 : 0) +
      (h1Count >= 1 ? 15 : 0) +
      (hasLang ? 10 : 0) +
      (hasOgTitle ? 10 : 0) +
      (hasCanonical ? 15 : 0);
  }
  seoFindings.push({
    ok: !!title,
    text: title ? `Tytuł strony: „${title.slice(0, 60)}"` : "Brak znacznika <title>",
  });
  seoFindings.push({
    ok: !!metaDesc,
    text: metaDesc ? "Meta description obecny" : "Brak meta description (opis w Google)",
  });
  seoFindings.push({
    ok: h1Count >= 1,
    text: h1Count >= 1 ? `Nagłówek H1: ${h1Count}` : "Brak nagłówka H1",
  });
  seoFindings.push({
    ok: hasCanonical,
    text: hasCanonical ? "Link canonical obecny" : "Brak linku canonical",
  });

  // --- Security ---
  let security = isHttps ? 55 : 20;
  if (hsts) security += 18;
  if (csp) security += 14;
  if (xfo) security += 13;
  security = clamp(security);
  const securityFindings: Finding[] = [
    {
      ok: isHttps,
      text: isHttps ? "Strona działa po HTTPS (szyfrowanie)" : "Brak HTTPS — strona nieszyfrowana",
    },
    { ok: hsts, text: hsts ? "Nagłówek HSTS obecny" : "Brak nagłówka HSTS" },
    {
      ok: csp || xfo,
      text:
        csp || xfo
          ? "Nagłówki bezpieczeństwa obecne"
          : "Brak nagłówków bezpieczeństwa (CSP / X-Frame-Options)",
    },
  ];

  // --- Presence / brand ---
  let presence =
    (hasFavicon ? 20 : 0) +
    (hasOgImage ? 25 : 0) +
    (hasOgTitle ? 15 : 0) +
    (hasManifest ? 20 : 0) +
    (hasJsonLd ? 20 : 0);
  presence = clamp(presence);
  const presenceFindings: Finding[] = [
    { ok: hasOgImage, text: hasOgImage ? "Obrazek Open Graph (ładny podgląd w social/messengerach)" : "Brak obrazka Open Graph — linki źle wyglądają na FB/LinkedIn" },
    { ok: hasFavicon, text: hasFavicon ? "Favicon obecny" : "Brak favikony" },
    { ok: hasManifest, text: hasManifest ? "Manifest PWA (może działać jak apka)" : "Brak PWA / manifestu (nie działa jak aplikacja)" },
    { ok: hasJsonLd, text: hasJsonLd ? "Dane strukturalne (schema.org)" : "Brak danych strukturalnych dla Google" },
  ];

  const categories: Category[] = [
    { key: "performance", label: "Wydajność", icon: "⚡", score: clamp(perf), findings: perfFindings },
    { key: "mobile", label: "Mobilność", icon: "📱", score: clamp(mobile), findings: mobileFindings },
    { key: "seo", label: "SEO", icon: "🔍", score: clamp(seo), findings: seoFindings },
    { key: "security", label: "Bezpieczeństwo", icon: "🔒", score: clamp(security), findings: securityFindings },
    { key: "presence", label: "Obecność i UX", icon: "✨", score: clamp(presence), findings: presenceFindings },
  ];

  // weighted overall
  const weights: Record<string, number> = {
    performance: 0.3,
    mobile: 0.2,
    seo: 0.2,
    security: 0.15,
    presence: 0.15,
  };
  const overall = clamp(
    categories.reduce((sum, c) => sum + c.score * (weights[c.key] || 0), 0)
  );

  return NextResponse.json(
    {
      url: finalUrl,
      status,
      overall,
      engine: psi ? "lighthouse" : "heuristic",
      categories,
      ts: Date.now(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
