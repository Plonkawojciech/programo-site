// Shared between the client consent provider (which writes the cookie) and the
// server routes (which read it to decide whether a conversion may be sent).
//
// Its own module on purpose: importing this from lib/consent.tsx would pull a
// "use client" module into a route handler's graph for the sake of one string.

/** First-party cookie mirroring the visitor's consent decision. */
export const CONSENT_COOKIE = "programo-consent";
