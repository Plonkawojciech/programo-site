import { NextRequest, NextResponse, after } from "next/server";
import { isRepeatSubmission, storeLead, storeRejected } from "@/lib/leads";
import { contactSchema, isOverRateLimit, recordSubmission } from "@/lib/contact-schema";
import { isTurnstileTestMode, isTestDeliveryIsolated, verifyTurnstile } from "@/lib/turnstile";
import { buildCrmPayload, forwardToCrm, type CrmSignals, type CrmVerdict } from "@/lib/crm-forward";
import { isHoneypotTripped } from "@/lib/form-challenge";
import { isForeignOrigin, isOverAttemptLimit, isToolUserAgent, publicRequestHostname } from "@/lib/request-guard";
import { describeSignals, scoreBotSignals } from "@/lib/bot-score";
import { contactFingerprint, mergeVerdicts, scoreContent } from "@/lib/spam-rules";
import { dispatchLeadConversions } from "@/lib/analytics/server/lead-conversions";
import { CONSENT_COOKIE } from "@/lib/analytics/consent-cookie";
import { buildLeadMessage } from "@/lib/telegram-message";
import { isLeadMailConfigured, sendLeadMail } from "@/lib/mail/graph";

/**
 * Estimated value of one lead, in PLN. A Smart Bidding / value-optimisation
 * signal, not a reported statistic. Mirrors LEAD_VALUE_PLN on the client so the
 * browser and server halves of the same conversion never disagree.
 */
const LEAD_VALUE_PLN = 500;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Request-level filters (lib/request-guard.ts), before we even parse the
  // body. Scripts and HTTP libraries, posts from outside our own pages, and
  // anyone hammering the endpoint. A person in a browser never trips these.
  const ua = request.headers.get("user-agent");
  const origin = request.headers.get("origin");
  const hostname = publicRequestHostname(request.headers, request.nextUrl.hostname);
  if (!hostname || isToolUserAgent(ua) || isForeignOrigin(origin)) {
    console.warn(`[contact] blocked request from ${ip} (ua: ${(ua ?? "").slice(0, 80)}, origin: ${origin ?? "none"})`);
    return NextResponse.json({ error: "Nieprawidłowe zgłoszenie." }, { status: 403 });
  }
  // 10 attempts per 10 min per IP, counting rejected ones — a real visitor
  // fixing a typo needs two or three.
  if (await isOverAttemptLimit("contact", ip, 10, 600)) {
    return NextResponse.json(
      { error: "Za dużo prób. Spróbuj ponownie za kilkanaście minut." },
      { status: 429 }
    );
  }

  if (isOverRateLimit(ip)) {
    return NextResponse.json(
      { error: "Za dużo prób. Spróbuj ponownie za kilkanaście minut." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe zgłoszenie." },
      { status: 400 }
    );
  }

  const result = contactSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Sprawdź wypełnione pola.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const turnstile = await verifyTurnstile(result.data.turnstileToken, ip, hostname);
  if (!turnstile.ok || !isTestDeliveryIsolated()) {
    const unavailable = !turnstile.ok && ["configuration", "unavailable"].includes(turnstile.reason);
    const isolated = isTestDeliveryIsolated();
    return NextResponse.json({ error: unavailable || !isolated
      ? "Ochrona formularza jest chwilowo niedostępna. Spróbuj ponownie później lub zadzwoń: +48 509 123 434."
      : "Nie udało się potwierdzić, że nie jesteś robotem. Odśwież stronę i spróbuj ponownie." },
      { status: unavailable || !isolated ? 503 : 403 });
  }

  // Every outcome below is forwarded to the CRM review inbox (lib/crm-forward.ts),
  // rejected ones included: the CRM applies its own rules on top, keeps spam
  // hidden but recoverable, and pings a phone only for clean submissions.
  const toCrm = (verdict: CrmVerdict, reasons: string[], signals: CrmSignals) =>
    forwardToCrm(buildCrmPayload(result.data, { verdict, reasons, signals, ip, userAgent: ua ?? "" }));

  // A refusal is retained for review, but the visitor never gets a false success.
  const reject = async (stage: string, reasons: string[], signals: CrmSignals) => {
    console.warn(`[contact] ${stage} from ${ip} (form ${result.data.form_id ?? "?"}): ${reasons.join("; ")}`);
    await storeRejected({
      ts: new Date().toISOString(),
      stage,
      reasons,
      formId: result.data.form_id ?? "",
      pageUrl: result.data.page_url ?? "",
      name: result.data.name ?? "",
      email: result.data.email ?? "",
      phone: result.data.phone ?? "",
      message: (result.data.message ?? "").slice(0, 500),
      signals: describeSignals(result.data.sig),
      ipPrefix: ip.replace(/[.:][0-9a-f]*$/i, ""),
      userAgent: (ua ?? "").slice(0, 200),
    });
    await toCrm("rejected", reasons, { stage, behaviour: describeSignals(result.data.sig), ...signals });
    return NextResponse.json({ error: "Sprawdź dane kontaktowe i treść zgłoszenia. Jeśli problem się powtarza, zadzwoń: +48 509 123 434." }, { status: 422 });
  };

  if (isHoneypotTripped(body)) return reject("honeypot", ["wypełnione ukryte pole"], { honeypot: true });
  // Input telemetry only flags review; screen readers and autofill may produce no pointer events.
  const behaviour = scoreBotSignals(result.data.sig);
  const sigLine = describeSignals(result.data.sig);
  // What was typed (lib/spam-rules.ts): placeholder numbers, link spam.
  const content = scoreContent(result.data);
  // After a valid human check, ambiguous content belongs in review. Real
  // project briefs may contain HTML, several reference links or an unusual phone.
  const reviewedContent = content.level === "drop"
    ? { ...content, level: "suspicious" as const }
    : content;
  // The same phone or e-mail again within 24 h is delivered (the second form
  // may carry the details the first one lacked) but flagged, so it is one
  // conversion and nobody is called twice.
  const repeat = await isRepeatSubmission(contactFingerprint(result.data));
  const bot = mergeVerdicts(
    mergeVerdicts(behaviour, reviewedContent),
    repeat ? { level: "suspicious", reasons: ["ten sam telefon lub e-mail już był w ciągu 24 h"] } : { level: "clean", reasons: [] },
  );
  const suspicious = bot.level === "suspicious";
  if (suspicious) {
    console.warn(`[contact] suspicious lead from ${ip} (form ${result.data.form_id ?? "?"}): ${bot.reasons.join("; ")} | ${sigLine}`);
  }

  const baseSignals: CrmSignals = {
    honeypot: false, turnstile: "ok", repeat, bot: behaviour.level, content: content.level, behaviour: sigLine,
  };
  const { name, email, phone, subject, message, projectType, budget, consentTimestamp } = result.data;
  // A phone-only lead legitimately has no name, so the notifications need a
  // label instead of a dangling "od ". The CRM keeps the field genuinely empty.
  const displayName = name?.trim() || "(bez nazwiska)";
  // The HTML-escaped copies that used to live here are gone. They were escaped
  // for the Resend e-mail body, and once Resend went (2026-08-04) their only
  // remaining reader was a dev-only console.log. Telegram escapes for MarkdownV2
  // itself and the CRM stores raw, so nothing on this path renders HTML.
  const consentAt = consentTimestamp || new Date().toISOString();

  // Lead source (Google Ads / UTM) - which keyword/campaign produced this lead
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
  const leadId = crypto.randomUUID();

  // Server-side conversion signal (Meta CAPI + GA4 Measurement Protocol) is
  // scheduled further down, once the lead has been accepted.

  // Whether the submission is durably recorded somewhere. Notifications are a
  // convenience on top of this; the response status must follow persistence,
  // not the ping.
  let persisted = false;

  try {
    persisted = await storeLead({
      id: leadId,
      ts: requestTs,
      name: name || "",
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
      formId: result.data.form_id || "",
      pageUrl: result.data.page_url || "",
      verdict: bot.level,
      verdictReasons: bot.reasons,
      signals: sigLine,
    });
  } catch (e) {
    console.error("[contact] storeLead threw unexpectedly:", e);
  }

  // Forward to the CRM review inbox — clean AND suspicious (it used to skip
  // suspicious ones, which then existed only on Telegram). The CRM decides
  // who gets a push; see lib/crm-forward.ts.
  const crmOk = await toCrm(bot.level === "suspicious" ? "suspicious" : "clean", bot.reasons, {
    ...baseSignals,
  });
  if (crmOk) persisted = true;

  // Notification channels. Telegram is the live one; the CRM webhook and the
  // Redis store above already persist the lead independently, so a Telegram
  // outage loses the ping, never the lead.
  //
  // Resend was removed 2026-08-04: it had never been configured in production
  // (no RESEND_API_KEY, no EMAIL_TO), so the branch was dead code pretending to
  // be a delivery channel — and a dead channel in a `some(ok)` check is exactly
  // the kind of thing that reads as redundancy while providing none.
  const tasks: Promise<{ channel: string; ok: boolean; error?: string }>[] = [];

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChatId) {
    tasks.push(
      (async () => {
        try {
          const text = buildLeadMessage({
            displayName,
            email: email || undefined,
            phone: phone || undefined,
            subject,
            projectType: projectType || undefined,
            budget: budget || undefined,
            message: message || undefined,
            sources,
            consentAt,
            suspicion: suspicious ? { reasons: bot.reasons, signals: sigLine } : undefined,
          });

          const res = await fetch(
            `https://api.telegram.org/bot${tgToken}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(5_000),
              body: JSON.stringify({
                chat_id: tgChatId,
                text,
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
  } else if (!isTurnstileTestMode()) {
    // Deliberately console.error and deliberately not tagged [DEV]. This line
    // used to read "[DEV] No TELEGRAM_BOT_TOKEN/CHAT_ID - skipping Telegram."
    // at log level `log`, which is exactly what a missing production env var
    // looks like when nobody is looking: a routine dev note, filtered out of
    // sight, on the only channel that tells a human a lead came in.
    console.error(
      "[contact] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID missing — no lead notification will be sent. " +
        "If this is production, the variables are not set for the Production environment.",
    );
  }

  // E-mail notification via Microsoft 365 (Graph). Second independent channel:
  // Telegram is the one that gets read in minutes, the mailbox is the one that
  // is still searchable in six months. Deliberately NOT a third-party e-mail
  // provider — see the header of lib/mail/graph.ts for why.
  if (isLeadMailConfigured()) {
    tasks.push(
      (async () => {
        const r = await sendLeadMail({
          displayName,
          email: email || undefined,
          phone: phone || undefined,
          subject,
          projectType: projectType || undefined,
          budget: budget || undefined,
          message: message || undefined,
          sources,
          consentAt,
          formId: result.data.form_id,
        });
        return { channel: "mail", ok: r.ok, error: r.error };
      })(),
    );
  } else if (!isTurnstileTestMode()) {
    // Same reasoning as the Telegram branch below-left: an unconfigured
    // delivery channel must be loud, because from the outside it looks exactly
    // like a quiet week.
    console.error(
      "[contact] Microsoft Graph mail not configured — no e-mail notification will be sent. " +
        "Set MS_GRAPH_TENANT_ID / MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET / LEAD_MAIL_FROM.",
    );
  }

  const results = await Promise.all(tasks);
  const anyNotified = results.some((r) => r.ok);
  results
    .filter((r) => !r.ok)
    .forEach((r) => console.error(`[contact] ${r.channel} failed:`, r.error));

  // Success requires durable storage. A notification alone does not create a recoverable record.
  if (!persisted) {
    console.error(
      `[contact] lead ${leadId} LOST — nothing persisted it and no channel took it. ` +
        "Check KV_REST_API_URL/KV_REST_API_TOKEN, CRM_WEBHOOK_SECRET and TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID.",
    );
    return NextResponse.json(
      { error: "Nie udało się przyjąć zgłoszenia. Spróbuj ponownie lub zadzwoń." },
      { status: 500 },
    );
  }

  // Consent is verified inside, from the cookie — never from the request body,
  // which is only a claim by the client. Scheduled only now, once the lead was
  // actually accepted (persisted): a submission that ended in the
  // 500 above must not become a paid conversion in Ads, Meta or GA4.
  recordSubmission(ip);
  const counted = !suspicious && !isTurnstileTestMode();
  if (counted) after(async () => {
    await dispatchLeadConversions({
      consentCookie: request.cookies.get(CONSENT_COOKIE)?.value,
      eventId: result.data.event_id,
      leadId,
      formId: result.data.form_id,
      leadValuePln: LEAD_VALUE_PLN,
      email: email || undefined,
      phone: phone || undefined,
      fullName: name || undefined,
      pageUrl: result.data.page_url,
      visitorId: result.data.visitor_id,
      // Prefer the cookies the browser actually sent; fall back to what the
      // client derived (it can rebuild fbc from an fbclid the pixel missed).
      fbp: request.cookies.get("_fbp")?.value ?? result.data.fbp,
      fbc: request.cookies.get("_fbc")?.value ?? result.data.fbc,
      gaClientId: result.data.ga_client_id,
      gaSessionId: result.data.ga_session_id,
      clientIp: ip !== "unknown" ? ip : undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
      leadSource: result.data.utm_source || (result.data.gclid ? "google_ads" : undefined),
      channel: result.data.referrer_class,
    });
  });

  if (!anyNotified && !isTurnstileTestMode()) {
    console.error(
      `[contact] lead ${leadId} stored but NO notification channel delivered — check Telegram`,
    );
  }

  return NextResponse.json({ success: true, counted });
}
