// ---------------------------------------------------------------------------
// SERVER ONLY. No `import "server-only"` guard: nothing else in this repo uses
// that package and adding it here breaks the vitest resolver for every test
// that imports the contact route. The protection instead is that this module
// is imported by exactly one server route and reads secrets without a
// NEXT_PUBLIC_ prefix, so a client bundle could never receive their values.
//
// Lead notification e-mail — Microsoft Graph, client credentials.
//
// WHY GRAPH AND NOT AN E-MAIL PROVIDER
//
// The previous e-mail channel here was Resend, removed 2026-08-04 because it
// had never been configured in production: a dead branch that read like a
// delivery channel. It is deliberately NOT coming back. Programo already pays
// for Microsoft 365 (MX points at programo-pl.mail.protection.outlook.com), so
// sending the notification through the tenant that already owns the domain
// costs nothing extra, adds no third party to the privacy policy, and needs no
// new mailbox — the mail is sent *as* an address that already exists.
//
// SMTP AUTH was rejected as the transport: Microsoft disables basic auth by
// default on new tenants, so an SMTP integration is one policy change away from
// silently failing. Graph with an application permission does not depend on it.
//
// SETUP (one-off, in Entra ID — free, no licence needed):
//   1. Entra admin center > App registrations > New registration
//      ("programo-site lead notifications", single tenant).
//   2. API permissions > Microsoft Graph > Application permissions >
//      Mail.Send > Grant admin consent.
//   3. Certificates & secrets > New client secret.
//   4. STRONGLY RECOMMENDED — scope the app to one mailbox only, so a leaked
//      secret cannot read or send as the whole tenant:
//        New-ApplicationAccessPolicy -AppId <client-id> -PolicyScopeGroupId
//          biuro@programo.pl -AccessRight RestrictAccess
//   5. Set the env vars below in Vercel (Production).
//
// Every function here is a no-op when the env is absent, so a deployment
// without the credentials behaves exactly as it does today — Telegram only —
// rather than throwing on every submission.
// ---------------------------------------------------------------------------

const GRAPH_SCOPE = "https://graph.microsoft.com/.default";

type GraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  /** Mailbox the message is sent AS. Must exist in the tenant. */
  from: string;
  /** Where the notification lands. Falls back to `from`. */
  to: string;
};

/**
 * Read the Graph configuration, or null when the channel is not configured.
 *
 * Returning null rather than throwing is the whole contract of this module:
 * the lead pipeline treats notification channels as best-effort, and a missing
 * secret must never cost a lead.
 */
export function getGraphConfig(): GraphConfig | null {
  const tenantId = process.env.MS_GRAPH_TENANT_ID;
  const clientId = process.env.MS_GRAPH_CLIENT_ID;
  const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET;
  const from = process.env.LEAD_MAIL_FROM;
  const to = process.env.LEAD_MAIL_TO || from;

  if (!tenantId || !clientId || !clientSecret || !from || !to) return null;
  return { tenantId, clientId, clientSecret, from, to };
}

/** Whether the e-mail channel is wired up (for diagnostics and tests). */
export function isLeadMailConfigured(): boolean {
  return getGraphConfig() !== null;
}

async function fetchAccessToken(cfg: GraphConfig): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        scope: GRAPH_SCOPE,
        grant_type: "client_credentials",
      }),
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!res.ok) {
    // The body carries Entra's AADSTS code, which is the only thing that makes
    // a misconfiguration diagnosable (wrong secret vs missing consent vs
    // blocked by an access policy all fail here with different codes).
    const detail = await res.text().catch(() => "");
    throw new Error(`token endpoint HTTP ${res.status}: ${detail.slice(0, 300)}`);
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("token endpoint returned no access_token");
  return json.access_token;
}

/** Minimal HTML escape — every value below comes from a public form. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export type LeadMailInput = {
  displayName: string;
  email?: string;
  phone?: string;
  subject: string;
  projectType?: string;
  budget?: string;
  message?: string;
  /** Attribution pairs, already filtered to the ones that have a value. */
  sources: [string, string][];
  consentAt: string;
  formId?: string;
};

/**
 * Build the notification body.
 *
 * Split out from the send so the shape can be asserted in a test without
 * reaching the network, the same way `buildLeadMessage` works for Telegram.
 */
export function buildLeadMailBody(input: LeadMailInput): {
  subject: string;
  html: string;
} {
  const contact = [input.phone, input.email].filter(Boolean).join(" · ");

  // The subject line is what shows in a phone's notification, so it carries the
  // two things that decide whether this is worth opening now: who, and how to
  // reach them.
  const subject = `Nowy lead: ${input.displayName}${contact ? ` — ${contact}` : ""}`;

  const rows: [string, string | undefined][] = [
    ["Imię i nazwisko", input.displayName],
    ["Telefon", input.phone],
    ["E-mail", input.email],
    ["Temat", input.subject],
    ["Rodzaj projektu", input.projectType],
    ["Budżet", input.budget],
    ["Formularz", input.formId],
    ["Zgoda", input.consentAt],
    ...input.sources,
  ];

  const rowsHtml = rows
    .filter((r): r is [string, string] => Boolean(r[1]))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#5b6b60;white-space:nowrap;vertical-align:top">${esc(
          label,
        )}</td><td style="padding:4px 0;color:#0d1f16">${esc(value)}</td></tr>`,
    )
    .join("");

  const messageHtml = input.message
    ? `<p style="margin:16px 0 0;white-space:pre-wrap;color:#0d1f16">${esc(input.message)}</p>`
    : "";

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5">
<h2 style="margin:0 0 12px;font-size:16px;color:#0d1f16">Nowe zgłoszenie z programo.pl</h2>
<table style="border-collapse:collapse">${rowsHtml}</table>${messageHtml}
</div>`;

  return { subject, html };
}

/**
 * Send the lead notification. Never throws — returns whether it went out.
 *
 * `replyTo` is set to the lead's own address when they left one, so replying
 * from the phone answers the lead instead of the notification.
 */
export async function sendLeadMail(
  input: LeadMailInput,
): Promise<{ ok: boolean; error?: string }> {
  const cfg = getGraphConfig();
  if (!cfg) return { ok: false, error: "not configured" };

  try {
    const token = await fetchAccessToken(cfg);
    const { subject, html } = buildLeadMailBody(input);

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.from)}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject,
            body: { contentType: "HTML", content: html },
            toRecipients: [{ emailAddress: { address: cfg.to } }],
            ...(input.email
              ? { replyTo: [{ emailAddress: { address: input.email } }] }
              : {}),
          },
          // The notification is an operational record of the submission, so it
          // belongs in Sent Items — that is the copy that survives if Redis is
          // ever wiped.
          saveToSentItems: true,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `graph HTTP ${res.status}: ${detail.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
