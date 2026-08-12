// Telegram MarkdownV2 payload for a new lead.
//
// This lives outside the route so it can be tested. That is not an aesthetic
// preference: an unescaped reserved character makes Telegram reject the WHOLE
// message with 400 "can't parse entities", and because the lead is already
// persisted by then the route still answers 200. The failure is therefore
// invisible from every side except the phone that never buzzed — which is
// exactly how it went unnoticed from 2026-08-04 until 2026-08-08.

/** The 18 characters MarkdownV2 reserves. Bare, any one of them kills the send. */
const RESERVED = "_*[]()~`>#+-=|{}.!";

/** Escapes every reserved character, plus the backslash itself. */
export function escapeMarkdownV2(s: string): string {
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

const bold = (s: string) => `*${escapeMarkdownV2(s)}*`;
const italic = (s: string) => `_${escapeMarkdownV2(s)}_`;
const line = (label: string, value: string) =>
  `${bold(`${label}:`)} ${escapeMarkdownV2(value)}`;

export type LeadNotification = {
  displayName: string;
  email?: string;
  phone?: string;
  subject: string;
  projectType?: string;
  budget?: string;
  message?: string;
  /** [label, value] pairs — UTM / gclid / landing page, already filtered. */
  sources: [string, string][];
  consentAt: string;
};

/**
 * Builds the message text. Markup is the ONLY thing written by hand here; every
 * piece of text — labels included — goes through escapeMarkdownV2. A future copy
 * pass cannot reach through bold()/line() to drop a bare character into the
 * payload, which is the precise mistake this function exists to make impossible.
 */
export function buildLeadMessage(n: LeadNotification): string {
  const srcLines = n.sources.map(([k, v]) => line(k, v));

  return [
    bold("Nowa wiadomość - Programo"),
    ``,
    line("Imię", n.displayName),
    n.email ? line("Email", n.email) : "",
    n.phone ? line("Telefon", n.phone) : "",
    line("Temat", n.subject),
    n.projectType ? line("Rodzaj projektu", n.projectType) : "",
    n.budget ? line("Budżet", n.budget) : "",
    ...(n.message ? ["", bold("Wiadomość:"), escapeMarkdownV2(n.message)] : []),
    ...(srcLines.length ? ["", bold("Źródło leada:"), ...srcLines] : []),
    ``,
    italic(`Zgoda RODO: ${n.consentAt}`),
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Reads the text the way Telegram's parser does and reports any reserved
 * character left bare. Exported for the test — the assertion belongs next to
 * the definition of "reserved", not copied into a spec file where it can drift.
 *
 * Escaped pairs are consumed first, so what remains is genuine markup plus any
 * mistake. `*` and `_` are legitimate there because they open and close bold and
 * italic; anything else in RESERVED is a bug that would 400 the send.
 */
export function bareReservedChars(text: string): string[] {
  const withoutEscapes = text.replace(/\\[\s\S]/g, "");
  const markup = new Set(["*", "_"]);
  return [...new Set(
    [...withoutEscapes].filter((c) => RESERVED.includes(c) && !markup.has(c)),
  )];
}
