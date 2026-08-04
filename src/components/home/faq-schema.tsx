import { translations } from "@/lib/i18n/dictionary";
import { buildFaqPage, renderGraph } from "@/lib/schema";

/**
 * Same 6 questions/keys as faq.tsx's accordion — kept in sync by construction
 * (both read `home.faq.q1..q6` / `a1..a6` from the shared dictionary), so
 * copy can never drift between what's shown and what's marked up.
 *
 * Rendered server-side, unlike faq.tsx (a client component for the <details>
 * accordion), so the JSON-LD ships in the initial HTML and always reflects
 * PL — the server has no notion of the visitor's client-side language toggle,
 * and PL is what it renders regardless.
 *
 * Google turned off the FAQPage rich result on 2026-05-07 — this markup has
 * no SERP payoff anymore. It stays as a cheap semantic signal; don't expand it.
 */
const FAQ_KEYS = [
  ["home.faq.q1", "home.faq.a1"],
  ["home.faq.q2", "home.faq.a2"],
  ["home.faq.q3", "home.faq.a3"],
  ["home.faq.q4", "home.faq.a4"],
  ["home.faq.q5", "home.faq.a5"],
  ["home.faq.q6", "home.faq.a6"],
] as const;

export default function FaqSchema() {
  const faqs = FAQ_KEYS.map(([q, a]) => ({
    q: translations[q].pl,
    a: translations[a].pl,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: renderGraph([buildFaqPage(faqs)]) }}
    />
  );
}
