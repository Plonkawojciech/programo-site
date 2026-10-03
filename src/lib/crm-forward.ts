/**
 * Forwarding of form submissions to the internal CRM (crm.programo.pl).
 *
 * Since 2026-10-03 the CRM keeps a review inbox ("Leady z formularzy",
 * `/formularze`) instead of turning every submission into a lead. It wants
 * EVERY submission, including the ones this site rejected, together with the
 * verdict, the reasons and the raw signals: the CRM runs its own spam rules,
 * takes the harsher of the two verdicts, hides rejected ones under "Spam" and
 * only pings a phone for clean ones. Nothing the filter throws away is lost,
 * and a rule that is too strict shows up as a real person in the CRM spam.
 *
 * Contract: crm_programo/docs/forms-intake.md. The secret stays on this
 * server and never reaches the browser.
 */

export type CrmVerdict = "clean" | "suspicious" | "rejected";

/** Turnstile outcome as the CRM understands it. "off" = not configured here. */
export type TurnstileSignal = "ok" | "missing" | "fail" | "off";

export type CrmSignals = {
  /** Which filter stopped the submission, when one did. */
  stage?: string;
  honeypot?: boolean;
  /** "ok" or the failure reason from lib/form-challenge.ts. */
  challenge?: string;
  turnstile?: TurnstileSignal;
  repeat?: boolean;
  /** Behaviour verdict from lib/bot-score.ts. */
  bot?: string;
  /** Content verdict from lib/spam-rules.ts. */
  content?: string;
  /** Human-readable summary of the browser signals (describeSignals). */
  behaviour?: string;
};

export type CrmFormInput = {
  form_id?: string;
  page_url?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  projectType?: string;
  budget?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
};

const UTM_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "gbraid", "wbraid", "landing_page", "referrer",
] as const;

export const CRM_INTAKE_DEFAULT_URL = "https://crm.programo.pl/api/forms/intake";

/** Truncates to the CRM's field limits so a long field never costs the whole submission a 400. */
const cut = (value: string | undefined, max: number) => (value ?? "").slice(0, max);

export function buildCrmPayload(
  data: CrmFormInput,
  meta: { verdict: CrmVerdict; reasons: string[]; signals: CrmSignals; ip: string; userAgent: string },
) {
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) if (data[key]) utm[key] = String(data[key]);
  return {
    source: "programo.pl",
    formId: cut(data.form_id, 200),
    pageUrl: cut(data.page_url, 2000),
    name: cut(data.name, 200),
    email: cut(data.email, 200),
    phone: cut(data.phone, 60),
    subject: cut(data.subject, 300),
    message: cut(data.message, 5000),
    projectType: cut(data.projectType, 200),
    budget: cut(data.budget, 120),
    utm,
    verdict: meta.verdict,
    verdictReasons: meta.reasons.slice(0, 50).map((r) => r.slice(0, 1000)),
    signals: meta.signals,
    ip: meta.ip === "unknown" ? "" : cut(meta.ip, 100),
    userAgent: cut(meta.userAgent, 2000),
  };
}

/**
 * POSTs one submission to the CRM. Never throws; returns whether the CRM
 * accepted it (2xx). Short timeout: a CRM outage must not hold up the form.
 */
export async function forwardToCrm(payload: ReturnType<typeof buildCrmPayload>): Promise<boolean> {
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (!secret) {
    console.log("[DEV] No CRM_WEBHOOK_SECRET - skipping CRM forward.");
    return false;
  }
  const url = process.env.CRM_WEBHOOK_URL || CRM_INTAKE_DEFAULT_URL;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Webhook-Secret": secret },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[contact] CRM webhook failed: HTTP ${res.status} (verdict ${payload.verdict})`);
    return res.ok;
  } catch (e) {
    console.error("[contact] CRM webhook error:", e);
    return false;
  }
}
