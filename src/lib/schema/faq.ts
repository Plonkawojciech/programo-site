import type { SchemaNode } from "./types";

export interface FaqEntry {
  q: string;
  a: string;
}

/**
 * Google turned off the FAQPage rich result on 2026-05-07 and pulled the docs
 * in June — this markup no longer has any SERP payoff. It stays as a cheap
 * semantic signal of what the page's Q&A content covers; don't invest further
 * in it (no extra fields, no expanding the question list for SEO reasons).
 */
export function buildFaqPage(faqs: FaqEntry[]): SchemaNode {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
