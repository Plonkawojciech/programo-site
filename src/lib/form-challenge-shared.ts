/**
 * The one constant both halves of the anti-bot need. Lives apart from
 * form-challenge.ts because that file imports node:crypto and cannot be
 * pulled into a client component.
 */
/** Name of the honeypot field. Looks like something an autofiller wants. */
export const HONEYPOT_FIELD = "company_website";
