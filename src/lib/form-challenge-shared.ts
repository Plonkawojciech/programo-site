/**
 * The one constant both halves of the anti-bot need. Lives apart from
 * form-challenge.ts because that file imports node:crypto and cannot be
 * pulled into a client component.
 */
/** Name of the honeypot field. Looks like something an autofiller wants. */
export const HONEYPOT_FIELD = "company_website";
/**
 * Second trap, hidden with display:none. Bots that check computed visibility
 * skip it; bots that only look at the HTML fill it. The off-screen field
 * above catches the opposite half, so the pair covers both kinds.
 */
export const HONEYPOT_FIELD_HIDDEN = "fax_number";
