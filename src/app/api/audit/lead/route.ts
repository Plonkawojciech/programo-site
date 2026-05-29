import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { Resend } from "resend";

export const runtime = "nodejs";

const leadSchema = z.object({
  email: z.string().email("Nieprawidłowy email"),
  url: z.string().min(3).max(300),
  name: z.string().max(120).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  overall: z.number().min(0).max(100).optional(),
  consent: z.literal(true, { message: "Wymagana zgoda na kontakt" }),
  // Ad attribution (captured client-side) — all optional
  gclid: z.string().max(300).optional(),
  gbraid: z.string().max(300).optional(),
  wbraid: z.string().max(300).optional(),
  utm_source: z.string().max(300).optional(),
  utm_medium: z.string().max(300).optional(),
  utm_campaign: z.string().max(300).optional(),
  utm_term: z.string().max(300).optional(),
  utm_content: z.string().max(300).optional(),
  landing_page: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
  first_seen: z.string().max(40).optional(),
});

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Za dużo zgłoszeń. Spróbuj później." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }
  const result = leadSchema.safeParse(body);
  if (!result.success) {
    const msg = result.error.issues[0]?.message || "Błąd walidacji";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { email, url, name, phone, overall } = result.data;
  const safeEmail = sanitize(email);
  const safeUrl = sanitize(url);
  const safeName = sanitize(name);
  const safePhone = sanitize(phone);
  const scoreText = overall != null ? `${overall}/100` : "—";

  // Lead source (Google Ads / UTM) — which keyword/campaign produced this lead
  const { gclid, utm_source, utm_medium, utm_campaign, utm_term, landing_page } = result.data;
  const sourcePairs: [string, string | undefined][] = [
    ["Źródło", utm_source],
    ["Medium", utm_medium],
    ["Kampania", utm_campaign],
    ["Słowo", utm_term],
    ["gclid", gclid],
    ["Wejście", landing_page],
  ];
  const sources = sourcePairs.filter((p): p is [string, string] => Boolean(p[1]));
  const sourceText = sources.map(([k, v]) => `${k}: ${v}`).join(" · ");

  const emailTo = process.env.EMAIL_TO || "biuro@programo.pl";

  // Telegram (fire-and-forget)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const tgText = [
      `🎯 *Nowy lead z audytu (programo.pl/audyt)*`,
      `🌐 *Strona:* ${safeUrl}`,
      `📊 *Wynik audytu:* ${scoreText}`,
      `👤 *Imię:* ${safeName || "—"}`,
      `📧 *Email:* ${safeEmail}`,
      `📞 *Telefon:* ${safePhone || "—"}`,
      sourceText ? `🔎 *Źródło:* ${sanitize(sourceText)}` : "",
      `⏱ Oddzwoń w < 60 s!`,
    ].filter(Boolean).join("\n");
    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgChat, text: tgText, parse_mode: "Markdown" }),
    }).catch((err) => console.error("[Telegram] lead notify failed:", err));
  }

  // Email
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log("[DEV] No RESEND_API_KEY — audit lead:", {
      email: safeEmail,
      url: safeUrl,
      overall,
    });
  } else {
    try {
      const resend = new Resend(resendApiKey);
      // 1) Notify the team
      await resend.emails.send({
        from: "Programo Audyt <noreply@programo.pl>",
        to: emailTo,
        replyTo: email,
        subject: `🎯 Lead z audytu: ${url} (${scoreText})`,
        html: `<h2>Nowy lead z audytu</h2>
<p><b>Strona:</b> ${safeUrl}</p>
<p><b>Wynik:</b> ${scoreText}</p>
<p><b>Imię:</b> ${safeName || "—"}</p>
<p><b>Email:</b> ${safeEmail}</p>
<p><b>Telefon:</b> ${safePhone || "—"}</p>
${sources.length ? `<p><b>Źródło:</b> ${sources.map(([k, v]) => `${k}: ${sanitize(v)}`).join(" · ")}</p>` : ""}
<p style="color:#b00">Oddzwoń w ciągu 60 sekund — to świeży, ciepły lead.</p>`,
      });
      // 2) Confirmation to the lead
      await resend.emails.send({
        from: "Programo <biuro@programo.pl>",
        to: email,
        subject: "Twój audyt cyfrowy — Programo",
        html: `<p>Cześć${name ? " " + safeName : ""},</p>
<p>Dziękujemy za skorzystanie z darmowego audytu na <a href="https://programo.pl/audyt">programo.pl</a>.
Wstępny wynik dla <b>${safeUrl}</b> to <b>${scoreText}</b>.</p>
<p>Przygotujemy dla Ciebie pełny raport z konkretnym planem naprawy i odezwiemy się wkrótce.
Jeśli chcesz przyspieszyć — umów rozmowę: <a href="${
          process.env.NEXT_PUBLIC_BOOKINGS_URL || "https://programo.pl"
        }">zarezerwuj termin</a>.</p>
<p>Pozdrawiamy,<br/>Zespół Programo</p>`,
      });
    } catch (err) {
      console.error("[Resend] audit lead email failed:", err);
      // still return success — lead captured via Telegram/log
    }
  }

  return NextResponse.json({ ok: true });
}
