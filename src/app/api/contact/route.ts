import { NextRequest, NextResponse, after } from "next/server";
import { storeLead } from "@/lib/leads";
import { contactSchema, isOverRateLimit, recordSubmission } from "@/lib/contact-schema";
import { verifyTurnstile } from "@/lib/turnstile";
import { isHoneypotTripped, verifyChallenge } from "@/lib/form-challenge";
import { isForeignOrigin, isOverAttemptLimit, isToolUserAgent } from "@/lib/request-guard";
import { describeSignals, scoreBotSignals } from "@/lib/bot-score";
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
  if (isToolUserAgent(ua) || isForeignOrigin(origin)) {
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

  // Charged here, not at the top of the handler: only a payload that actually
  // parses is a submission. Rejected attempts are typos, not traffic.
  recordSubmission(ip);

  // Anti-bot, keyless layers — see lib/form-challenge.ts. Honeypot first: a
  // filled decoy field gets the same 200 a real lead gets, and nothing else.
  // Telling a bot it failed only teaches it what to change.
  if (isHoneypotTripped(body)) {
    console.warn(`[contact] honeypot tripped from ${ip} (form ${result.data.form_id ?? "?"}) — dropped`);
    return NextResponse.json({ success: true, counted: false });
  }
  const challenge = verifyChallenge(result.data.challenge, result.data.pow);
  if (!challenge.ok) {
    console.warn(`[contact] challenge ${challenge.reason} from ${ip} (form ${result.data.form_id ?? "?"})`);
    return NextResponse.json(
      {
        error:
          challenge.reason === "too_fast"
            ? "Za szybko. Odczekaj chwilę i wyślij ponownie."
            : "Nie udało się potwierdzić, że nie jesteś robotem. Odśwież stronę i spróbuj ponownie.",
      },
      { status: 403 },
    );
  }

  // Behaviour verdict (lib/bot-score.ts). Certain bots are answered 200 and
  // dropped; likely bots are delivered flagged, and neither kind is ever
  // counted as a conversion — a bot counted as a 500 zł lead teaches Google
  // Ads to buy more bots.
  const bot = scoreBotSignals(result.data.sig);
  const sigLine = describeSignals(result.data.sig);
  if (bot.level === "drop") {
    console.warn(`[contact] bot dropped from ${ip} (form ${result.data.form_id ?? "?"}): ${bot.reasons.join("; ")} | ${sigLine}`);
    return NextResponse.json({ success: true, counted: false });
  }
  const suspicious = bot.level === "suspicious";
  if (suspicious) {
    console.warn(`[contact] suspicious lead from ${ip} (form ${result.data.form_id ?? "?"}): ${bot.reasons.join("; ")} | ${sigLine}`);
  }

  // Optional extra layer, Cloudflare Turnstile. Sits AFTER recordSubmission on purpose: a flood of
  // well-formed payloads with bad tokens is exactly the traffic the rate
  // limit exists for. No-op until both Turnstile env vars are set — see
  // src/lib/turnstile.ts for the fail-open/closed policy.
  const turnstile = await verifyTurnstile(result.data.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json(
      { error: "Nie udało się potwierdzić, że nie jesteś robotem. Odśwież stronę i spróbuj ponownie." },
      { status: 403 },
    );
  }

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
    });
  } catch (e) {
    console.error("[contact] storeLead threw unexpectedly:", e);
  }

  // Forward the lead to the internal CRM (crm.programo.pl). Best-effort with a
  // short timeout: a CRM outage can never affect the contact flow or response.
  const crmSecret = process.env.CRM_WEBHOOK_SECRET;
  const crmUrl =
    process.env.CRM_WEBHOOK_URL || "https://crm.programo.pl/api/forms/programo";
  if (crmSecret && !suspicious) {
    try {
      const utm: Record<string, string> = {};
      for (const [k, v] of sources) utm[k] = v;
      const res = await fetch(crmUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": crmSecret,
        },
        body: JSON.stringify({
          name: name || "",
          email: email || "",
          phone: phone || "",
          subject,
          message: message || "",
          projectType: projectType || "",
          budget: budget || "",
          source: "programo.pl",
          utm,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        persisted = true;
      } else {
        console.error(`[contact] CRM webhook failed: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error("[contact] CRM webhook error:", e);
    }
  } else {
    console.log("[DEV] No CRM_WEBHOOK_SECRET - skipping CRM forward.");
  }

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
  } else {
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
  } else {
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

  // The status follows PERSISTENCE, not notification. Previously a Telegram
  // outage returned 500 for a lead already sitting in Redis and in the CRM: the
  // visitor was told their message failed, and the client returns before
  // trackLead(), so the Google Ads and Meta conversions never fired either. One
  // dead channel cost the lead twice — once in the inbox, once in the bidding
  // signal — while the lead itself was safe the whole time.
  //
  // This check used to be UNREACHABLE whenever no channel was configured at
  // all: an early `if (tasks.length === 0) return { success: true }` sat above
  // it and answered before persistence was ever consulted. So a deployment with
  // neither Telegram nor Redis nor the CRM webhook told every visitor "dziękuję,
  // odezwiemy się" and dropped the lead on the floor — the one failure mode a
  // lead pipeline must never have, and the one that is hardest to notice,
  // because from the outside it looks exactly like working.
  if (!persisted && !anyNotified) {
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
  // actually accepted (persisted or delivered): a submission that ended in the
  // 500 above must not become a paid conversion in Ads, Meta or GA4.
  if (!suspicious) after(async () => {
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

  if (!anyNotified) {
    console.error(
      `[contact] lead ${leadId} stored but NO notification channel delivered — check Telegram`,
    );
  }

  return NextResponse.json({ success: true, counted: !suspicious });
}
