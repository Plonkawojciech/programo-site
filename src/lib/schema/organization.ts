import { ORGANIZATION_ID, WOJCIECH_ID, BARTOSZ_ID, SITE_URL, DEFAULT_AREA_SERVED } from "./constants";
import type { SchemaNode } from "./types";

/**
 * The one Organization node for the whole site — rendered once, in the root
 * layout. Every other page references it by `@id` (ORGANIZATION_ID) instead
 * of repeating it.
 *
 * Facts only, traced to existing copy: `legalName` and the "dwie osoby" /
 * numberOfEmployees come from src/app/software-house-poznan/page.tsx and
 * about.ts; `knowsAbout` mirrors that page's `services` list verbatim. No
 * NIP (vatID) or foundingDate — neither appears anywhere in the repo, so
 * they're omitted rather than guessed (see task report for what Wojtek still
 * needs to supply).
 */
export function buildOrganization(): SchemaNode {
  return {
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: "Programo",
    legalName: "Programo s.j.",
    alternateName: ["Programo Software House", "Programo Studio"],
    description:
      "Software house z Poznania. Oprogramowanie na zamówienie: strony, aplikacje webowe i mobilne, systemy SaaS oraz integracje AI.",
    url: SITE_URL,
    logo: `${SITE_URL}/programo-logo-gradient.svg`,
    image: `${SITE_URL}/opengraph-image`,
    email: "biuro@programo.pl",
    telephone: "+48797222363",
    priceRange: "$$",
    knowsLanguage: ["pl", "en"],
    knowsAbout: ["Aplikacje webowe", "Systemy SaaS", "Aplikacje mobilne", "Integracje AI"],
    numberOfEmployees: { "@type": "QuantitativeValue", value: 2 },
    founder: [{ "@id": WOJCIECH_ID }, { "@id": BARTOSZ_ID }],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Poznań",
      addressRegion: "wielkopolskie",
      addressCountry: "PL",
    },
    areaServed: DEFAULT_AREA_SERVED,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+48797222363",
      email: "biuro@programo.pl",
      availableLanguage: ["Polish", "English"],
    },
    // github.com/programo removed: that account belongs to an unrelated
    // GitHub user ("Aswin", created 2015-09-08, 0 public repos) — verified
    // against the GitHub API, not Programo's. Keeping it would misrepresent
    // ownership (Google's structured-data policy forbids that) and confuse
    // entity resolution. LinkedIn is unverified in the other direction —
    // linkedin.com returns 200 for both real and nonexistent company pages,
    // so this URL needs a human check, not a robot one.
    sameAs: ["https://linkedin.com/company/programo"],
  };
}
