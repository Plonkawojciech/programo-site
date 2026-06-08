import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { Resend } from "resend";
import { storeLead } from "@/lib/leads";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Nieprawidłowy adres email").optional().or(z.literal("")),
  phone: z
    .string()
    .max(30, "Phone too long")
    .optional()
    .or(z.literal("")),
  subject: z
    .enum([
      "Współpraca",
      "Wycena projektu",
      "Pytanie techniczne",
      "Inne",
    ])
    .optional()
    .default("Inne"),
  message: z
    .string()
    .max(2000, "Message must be at most 2000 characters")
    .optional()
    .or(z.literal("")),
  // Lead qualification (chips on the form) — optional
  projectType: z.string().max(60).optional().or(z.literal("")),
  budget: z.string().max(60).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Consent is required" }),
  consentTimestamp: z.string().datetime().optional(),
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
})
  .refine(
    (d) => Boolean((d.email && d.email.length) || (d.phone && d.phone.length)),
    { message: "Podaj e-mail lub numer telefonu.", path: ["email"] }
  );

// In-memory rate limiter: IP -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT) {
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// Sanitize HTML to prevent XSS
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
      { error: "Too many messages. Try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const result = contactSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Validation failed";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { name, email, phone, subject, message, projectType, budget, consentTimestamp } = result.data;
  const safeName = sanitize(name);
  const safeEmail = email ? sanitize(email) : "";
  const safeMessage = message ? sanitize(message) : "";
  const safeSubject = sanitize(subject);
  const safePhone = phone ? sanitize(phone) : "";
  const safeProjectType = projectType ? sanitize(projectType) : "";
  const safeBudget = budget ? sanitize(budget) : "";
  const consentAt = consentTimestamp || new Date().toISOString();
  const safeConsentAt = sanitize(consentAt);

  // Lead source (Google Ads / UTM) — which keyword/campaign produced this lead
  const {
    gclid, gbraid, wbraid,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    landing_page, referrer,
  } = result.data;
  const sourcePairs: [string, string | undefined][] = [
    ["Źródło", utm_source],
    ["Medium", utm_medium],
    ["Kampania", utm_campaign],
    ["Słowo kluczowe", utm_term],
    ["Treść", utm_content],
    ["gclid", gclid],
    ["gbraid", gbraid],
    ["wbraid", wbraid],
    ["Strona wejścia", landing_page],
    ["Referrer", referrer],
  ];
  const sources = sourcePairs.filter((p): p is [string, string] => Boolean(p[1]));

  // Persist the lead for the internal CRM (/crm). Best-effort: storeLead never
  // throws, but wrap defensively so a store failure can never affect the
  // contact email/Telegram flow or the response.
  const requestTs = new Date().toISOString();
  try {
    await storeLead({
      id: crypto.randomUUID(),
      ts: requestTs,
      name,
      email: email || "",
      phone: phone || "",
      subject,
      message: message || "",
      projectType: projectType || "",
      budget: budget || "",
      consentTimestamp: consentAt,
      gclid: gclid || "",
      gbraid: gbraid || "",
      wbraid: wbraid || "",
      utm_source: utm_source || "",
      utm_medium: utm_medium || "",
      utm_campaign: utm_campaign || "",
      utm_term: utm_term || "",
      utm_content: utm_content || "",
      landing_page: landing_page || "",
      referrer: referrer || "",
      first_seen: result.data.first_seen || "",
    });
  } catch (e) {
    console.error("[contact] storeLead threw unexpectedly:", e);
  }

  const emailTo = process.env.EMAIL_TO || "biuro@programo.pl";

  // Send email + Telegram in parallel; success if at least one channel delivers
  const tasks: Promise<{ channel: string; ok: boolean; error?: string }>[] = [];

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    tasks.push(
      (async () => {
        try {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: "Programo <noreply@programo.pl>",
            to: emailTo,
            subject: `[Programo] ${safeSubject} — od ${safeName}`,
            html: `
              <h2>Nowa wiadomość z formularza kontaktowego</h2>
              <p><strong>Imię:</strong> ${safeName}</p>
              ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ""}
              ${safePhone ? `<p><strong>Telefon:</strong> ${safePhone}</p>` : ""}
              <p><strong>Temat:</strong> ${safeSubject}</p>
              ${safeProjectType ? `<p><strong>Rodzaj projektu:</strong> ${safeProjectType}</p>` : ""}
              ${safeBudget ? `<p><strong>Budżet:</strong> ${safeBudget}</p>` : ""}
              ${safeMessage ? `<p><strong>Wiadomość:</strong></p><p>${safeMessage.replace(/\n/g, "<br>")}</p>` : ""}
              <hr>
              ${sources.length ? `<p style="color:#444;font-size:13px;"><strong>Źródło leada:</strong><br>${sources.map(([k, v]) => `${k}: ${sanitize(v)}`).join("<br>")}</p>` : ""}
              <p style="color:#666;font-size:12px;">Zgoda RODO zaakceptowana: ${safeConsentAt}</p>
            `,
          });
          return { channel: "resend", ok: true };
        } catch (e) {
          return { channel: "resend", ok: false, error: String(e) };
        }
      })()
    );
  } else {
    console.log("[DEV] No RESEND_API_KEY — skipping email.");
  }

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChatId) {
    tasks.push(
      (async () => {
        try {
          const esc = (s: string) =>
            s.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
          const srcLines = sources.map(([k, v]) => `*${esc(k)}:* ${esc(v)}`);
          const lines = [
            `*Nowa wiadomość — Programo*`,
            ``,
            `*Imię:* ${esc(name)}`,
            email ? `*Email:* ${esc(email)}` : "",
            phone ? `*Telefon:* ${esc(phone)}` : "",
            `*Temat:* ${esc(subject)}`,
            projectType ? `*Rodzaj projektu:* ${esc(projectType)}` : "",
            budget ? `*Budżet:* ${esc(budget)}` : "",
            ...(message ? ["", `*Wiadomość:*`, esc(message)] : []),
            ...(srcLines.length ? ["", `*Źródło leada:*`, ...srcLines] : []),
            ``,
            `_Zgoda RODO: ${esc(consentAt)}_`,
          ].filter(Boolean);

          const res = await fetch(
            `https://api.telegram.org/bot${tgToken}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: tgChatId,
                text: lines.join("\n"),
                parse_mode: "MarkdownV2",
                disable_web_page_preview: true,
              }),
            }
          );
          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            return { channel: "telegram", ok: false, error: errText };
          }
          return { channel: "telegram", ok: true };
        } catch (e) {
          return { channel: "telegram", ok: false, error: String(e) };
        }
      })()
    );
  } else {
    console.log("[DEV] No TELEGRAM_BOT_TOKEN/CHAT_ID — skipping Telegram.");
  }

  if (tasks.length === 0) {
    console.log("[DEV] No notification channels configured. Submission:", {
      name: safeName,
      email: safeEmail,
      subject: safeSubject,
    });
    return NextResponse.json({ success: true });
  }

  const results = await Promise.all(tasks);
  const anyOk = results.some((r) => r.ok);
  results
    .filter((r) => !r.ok)
    .forEach((r) => console.error(`[contact] ${r.channel} failed:`, r.error));

  if (!anyOk) {
    return NextResponse.json(
      { error: "Failed to deliver notification" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

// Export for testing
export { contactSchema, rateLimitMap, isRateLimited, sanitize };
