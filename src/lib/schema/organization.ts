import { ORGANIZATION_ID, WOJCIECH_ID, BARTOSZ_ID, SITE_URL, DEFAULT_AREA_SERVED } from "./constants";
import { COMPANY } from "../company";
import type { SchemaNode } from "./types";

/**
 * The one Organization node for the whole site — rendered once, in the root
 * layout. Every other page references it by `@id` (ORGANIZATION_ID) instead
 * of repeating it.
 *
 * Facts only: the "dwie osoby" / numberOfEmployees come from
 * src/app/software-house-poznan/page.tsx and about.ts, `knowsAbout` mirrors
 * that page's `services` list verbatim, and everything registry-shaped
 * (legalName, KRS, NIP, REGON, seat address, foundingDate) comes from
 * src/lib/company.ts — i.e. from the KRS extract, not from prose on the site.
 *
 * The identifiers matter here beyond SEO: they are what lets Google resolve
 * this entity to the real company rather than to a name that happens to
 * repeat on a few pages.
 */
export function buildOrganization(): SchemaNode {
  return {
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: "Programo",
    legalName: COMPANY.legalName,
    alternateName: ["Programo s.j.", "Programo Software House", "Programo Studio"],
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
    foundingDate: COMPANY.foundingDate,
    // vatID w formacie unijnym (prefiks kraju), taxID to sam NIP - schema.org
    // rozróżnia te dwa, a Google czyta oba.
    vatID: `PL${COMPANY.nip}`,
    taxID: COMPANY.nip,
    identifier: [
      { "@type": "PropertyValue", propertyID: "KRS", value: COMPANY.krs },
      { "@type": "PropertyValue", propertyID: "REGON", value: COMPANY.regon },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      postalCode: COMPANY.postalCode,
      addressLocality: COMPANY.city,
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
