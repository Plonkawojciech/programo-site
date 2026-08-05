// Single source of truth for the site's event taxonomy.
//
// Every analytics event on programo.pl is declared here — name, payload shape,
// and which destinations it goes to. Nothing fires a raw string anywhere else;
// call sites use `track(EV.x, {...})` so a typo is a type error, not a silently
// missing report six weeks later.
//
// Naming: GA4 convention — snake_case, verb_noun, max 40 chars. GA4 reserves a
// handful of names (page_view, session_start, first_visit, user_engagement…);
// we never re-declare those, gtag owns them.

/** Destinations an event can be forwarded to. */
export type Destination = "ga4" | "meta" | "firstParty";

export type EventDef = {
  /** GA4 event name (also used as the first-party event name). */
  readonly name: string;
  /** Where this event goes. */
  readonly to: readonly Destination[];
  /**
   * Standard Meta Pixel event to mirror this as, when `to` includes "meta".
   * Custom (non-standard) names are sent via trackCustom.
   */
  readonly meta?: {
    readonly event: string;
    /** true = Meta standard event (fbq('track')), false = custom (fbq('trackCustom')). */
    readonly standard: boolean;
  };
  /** Why we measure it — kept in code so the taxonomy stays self-documenting. */
  readonly why: string;
};

const def = <T extends Record<string, EventDef>>(t: T): T => t;

export const EVENTS = def({
  // ---------------------------------------------------------------- lifecycle
  page_view_spa: {
    name: "page_view_spa",
    to: ["firstParty"],
    why: "Client-side route change. GA4 gets its own page_view from gtag config; this mirrors it into our first-party store so the internal funnel is complete.",
  },
  session_context: {
    name: "session_context",
    to: ["firstParty"],
    why: "One per session: device, viewport, language, theme, referrer class, attribution. Lets us segment every later event without repeating the fields.",
  },

  // --------------------------------------------------------------- engagement
  scroll_depth: {
    name: "scroll_depth",
    to: ["ga4", "firstParty"],
    why: "How far down a page people actually get. Identifies sections nobody ever sees.",
  },
  engaged_time: {
    name: "engaged_time",
    to: ["ga4", "firstParty"],
    why: "Active (not idle, tab-visible) seconds per page. Distinguishes a read from an open tab.",
  },
  section_view: {
    name: "section_view",
    to: ["firstParty"],
    why: "A named page section entered the viewport for >1s. Tells us which parts of the offer get consumed before someone converts.",
  },
  rage_click: {
    name: "rage_click",
    to: ["ga4", "firstParty"],
    why: "3+ rapid clicks in a small radius — something looks clickable and is not, or is broken.",
  },
  dead_click: {
    name: "dead_click",
    to: ["firstParty"],
    why: "Click on a non-interactive element that produced no DOM change. Same signal as rage_click but subtler.",
  },
  exit_intent: {
    name: "exit_intent",
    to: ["firstParty"],
    why: "Pointer left toward the browser chrome on desktop. Marks the moment of abandonment for funnel analysis.",
  },
  copy_contact: {
    name: "copy_contact",
    to: ["ga4", "firstParty"],
    meta: { event: "Contact", standard: true },
    why: "Someone selected and copied the phone or e-mail — high intent that never shows up as a click.",
  },

  // ------------------------------------------------------------------- intent
  cta_click: {
    name: "cta_click",
    to: ["ga4", "firstParty"],
    why: "Any primary/secondary CTA press, labelled by location. Shows which CTA placement earns its space.",
  },
  contact_click: {
    name: "contact_click",
    to: ["ga4", "firstParty"],
    meta: { event: "Contact", standard: true },
    why: "tel:/mailto: click. On mobile this is the real conversion — it does not pass through the form.",
  },
  select_content: {
    name: "select_content",
    to: ["ga4", "firstParty"],
    meta: { event: "ViewContent", standard: true },
    why: "Portfolio/case-study click. Which proof of work actually pulls people in.",
  },
  faq_open: {
    name: "faq_open",
    to: ["firstParty"],
    why: "Which objection someone needed answered before converting. Direct input for page copy.",
  },
  pricing_view: {
    name: "pricing_view",
    to: ["ga4", "firstParty"],
    meta: { event: "ViewContent", standard: true },
    why: "Pricing section/page consumed. The strongest pre-lead signal on a B2B services site.",
  },
  outbound_click: {
    name: "outbound_click",
    to: ["firstParty"],
    why: "Click to an external URL (live project, GitHub). Confirms the portfolio is being verified.",
  },
  language_switch: {
    name: "language_switch",
    to: ["firstParty"],
    why: "PL/EN toggle. Measures real demand for the English version before we invest in indexable /en/ routes.",
  },
  theme_switch: {
    name: "theme_switch",
    to: ["firstParty"],
    why: "Light/dark toggle. Tells us which theme to treat as the design default.",
  },

  // -------------------------------------------------------------- form funnel
  form_view: {
    name: "form_view",
    to: ["firstParty"],
    why: "Form scrolled into view. Denominator for the whole form funnel.",
  },
  form_start: {
    name: "form_start",
    to: ["ga4", "firstParty"],
    meta: { event: "InitiateCheckout", standard: true },
    why: "First real keystroke/interaction in a form. The single most useful funnel step we currently do not have.",
  },
  form_field_complete: {
    name: "form_field_complete",
    to: ["firstParty"],
    why: "A field was filled and blurred, with time spent. Finds the field that costs us leads.",
  },
  form_error: {
    name: "form_error",
    to: ["ga4", "firstParty"],
    why: "Client validation or server error, by field. Validation friction is an invisible conversion killer.",
  },
  form_field_skip: {
    name: "form_field_skip",
    to: ["firstParty"],
    why: "Focused, left empty, moved on. Marks a field people look at and decline to answer — a candidate for removal or an explicit 'optional' label.",
  },
  form_abandon: {
    name: "form_abandon",
    to: ["ga4", "firstParty"],
    why: "Started but never submitted, captured on page hide. Pairs with form_start to give a real abandonment rate. Diagnostic only — the RATE is computed from the form_start/form_submit funnel, never by counting this event.",
  },
  form_submit_failed: {
    name: "form_submit_failed",
    to: ["ga4", "firstParty"],
    why: "The visitor did everything right and our backend refused. At ~12 leads/month a broken week costs a quarter of the pipeline and looks exactly like a slow week in GA4. This is the event worth alerting on.",
  },
  generate_lead: {
    name: "generate_lead",
    to: ["ga4", "meta", "firstParty"],
    meta: { event: "Lead", standard: true },
    why: "Successful submit. Primary conversion — GA4 key event, Google Ads conversion, Meta Lead (pixel + CAPI).",
  },

  // ----------------------------------------------------------------- quality
  web_vitals: {
    name: "web_vitals",
    to: ["ga4", "firstParty"],
    why: "Field LCP/INP/CLS/TTFB per page. Real-user performance, not a lab score.",
  },
  js_error: {
    name: "js_error",
    to: ["firstParty"],
    why: "Uncaught error / unhandled rejection. A broken form on one browser is otherwise invisible at this traffic level.",
  },
  ai_referral: {
    name: "ai_referral",
    to: ["ga4", "firstParty"],
    why: "Visit referred by an AI assistant (ChatGPT, Perplexity, Copilot…). The only client-side proof that GEO work converts into humans.",
  },
  page_not_found: {
    name: "page_not_found",
    to: ["ga4", "firstParty"],
    why: "A 404 with its referrer. Broken links from proposals, LinkedIn posts or old URLs lose leads silently and are cheap to fix.",
  },
  consent_update: {
    name: "consent_update",
    to: ["firstParty"],
    why: "The denominator under every other number here. If half the visitors reject analytics, every metric is roughly half the truth — and without this event we would not know by how much.",
  },
  session_summary: {
    name: "session_summary",
    to: ["firstParty"],
    why: "One row per session on exit: pages, engaged time, scroll, CTAs, form progress, source. At a few hundred sessions a month this is not a chart — it is a list short enough to read line by line, which beats any dashboard at this scale.",
  },
} as const);

export type EventKey = keyof typeof EVENTS;

/** Convenience: EV.form_start === "form_start", with autocomplete. */
export const EV = Object.fromEntries(
  Object.keys(EVENTS).map((k) => [k, k]),
) as { readonly [K in EventKey]: K };

/** Parameters allowed on any event. GA4 caps at 25 custom params per event. */
export type EventParams = Record<
  string,
  string | number | boolean | null | undefined
>;
