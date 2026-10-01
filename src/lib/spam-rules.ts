/**
 * Content rules for /api/contact — the layer after the behaviour score
 * (lib/bot-score.ts). Those two look at HOW a form was filled in; this one
 * looks at WHAT was typed.
 *
 * Why it exists (2026-10-01): the owners were calling back numbers from the
 * form and reaching people who had never heard of us. A submission can pass
 * every browser check and still carry a number nobody typed as their own:
 * the placeholder copied from the field, a keyboard run, a foreign number on
 * a Polish-only site. None of that is caught by counting keystrokes.
 *
 *   drop       - cannot be a real enquiry (placeholder or pattern number,
 *                link spam). Answered 200 and stored as rejected, no ping.
 *   suspicious - a person could have written it, but it needs a look before
 *                anyone dials (foreign number, a link, non-Latin text).
 *
 * Pure functions, no I/O, so every rule is covered in spam-rules.test.ts.
 */

export type SpamVerdict = { level: "clean" | "suspicious" | "drop"; reasons: string[] };

export type SpamInput = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

/** Digits only, without a Polish country prefix. "" when there is no number. */
export function nationalDigits(phone: string | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("48")) return digits.slice(2);
  if (digits.length === 13 && digits.startsWith("0048")) return digits.slice(4);
  return digits;
}

// Numbers that exist only as examples: our own field placeholders and the
// ones every tutorial and test script reaches for.
const EXAMPLE_NUMBERS = new Set([
  "600000000", // hero placeholder "+48 600 000 000"
  "600100200",
  "600100100",
  "500500500",
  "500600700",
  "501502503",
  "600700800",
  "700800900",
  "111222333",
  "123123123",
  "100200300",
]);

function isPatternNumber(n: string): boolean {
  if (EXAMPLE_NUMBERS.has(n)) return true;
  if (/^(\d)\1{8}$/.test(n)) return true; // 999999999
  if ("0123456789012".includes(n) || "9876543210987".includes(n)) return true; // keyboard runs
  if (/^(\d{3})\1\1$/.test(n)) return true; // 123123123
  if (/^\d{3}0{6}$/.test(n)) return true; // 500000000
  return false;
}

/** Polish numbering plan: nine digits, never starting with 0 or 1. */
function isPolishNumber(n: string): boolean {
  return /^[2-9]\d{8}$/.test(n);
}

const URL_RE = /(https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(ru|cn|xyz|top|click|link|site|online|info|biz)\b/gi;
const NON_LATIN_RE = /[Ѐ-ӿ؀-ۿ一-鿿぀-ヿ가-힯]/;
const MARKUP_RE = /<\/?[a-z][^>]*>|\[url=|\[link=/i;

// Throwaway inboxes. Short on purpose: a long list goes stale and starts
// catching real people; these few cover most of what scripted sign-ups use.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "example.com",
  "test.com",
]);

export function scoreContent(input: SpamInput): SpamVerdict {
  const drop: string[] = [];
  const flag: string[] = [];

  const digits = nationalDigits(input.phone);
  if (digits) {
    if (isPatternNumber(digits)) drop.push("numer przykładowy lub wzorzec, nie czyjś telefon");
    else if (!isPolishNumber(digits)) flag.push("numer spoza polskiej numeracji");
  }

  const text = `${input.name ?? ""}\n${input.message ?? ""}`;
  const links = text.match(URL_RE)?.length ?? 0;
  if (MARKUP_RE.test(text)) drop.push("znaczniki HTML lub BBCode w treści");
  if (links >= 2) drop.push(`${links} linki w treści`);
  else if (links === 1) flag.push("link w treści");
  if (NON_LATIN_RE.test(text)) flag.push("tekst w alfabecie innym niż łaciński");

  const name = (input.name ?? "").trim();
  if (name) {
    if (/\d{3,}/.test(name)) flag.push("cyfry w imieniu");
    if (name.length > 3 && name === (input.message ?? "").trim()) flag.push("imię i wiadomość są identyczne");
  }

  const domain = (input.email ?? "").split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_DOMAINS.has(domain)) flag.push("adres e-mail z domeny tymczasowej");

  if (drop.length) return { level: "drop", reasons: [...drop, ...flag] };
  return { level: flag.length ? "suspicious" : "clean", reasons: flag };
}

/** The harsher of two verdicts, with both sets of reasons. */
export function mergeVerdicts(a: SpamVerdict, b: SpamVerdict): SpamVerdict {
  const rank = { clean: 0, suspicious: 1, drop: 2 } as const;
  return {
    level: rank[a.level] >= rank[b.level] ? a.level : b.level,
    reasons: [...a.reasons, ...b.reasons],
  };
}

/** Key used to recognise the same person submitting again. "" when there is nothing to key on. */
export function contactFingerprint(input: SpamInput): string {
  const digits = nationalDigits(input.phone);
  if (digits.length >= 9) return `p:${digits}`;
  const email = (input.email ?? "").trim().toLowerCase();
  return email ? `e:${email}` : "";
}
