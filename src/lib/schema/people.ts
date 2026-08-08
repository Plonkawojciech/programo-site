import { WOJCIECH_ID, BARTOSZ_ID, ORGANIZATION_ID } from "./constants";
import type { SchemaNode } from "./types";

/**
 * Both founders as standalone Person nodes with stable @ids — referenced by
 * Organization.founder and reusable as `author` wherever a page has one
 * (e.g. the ile-kosztuje-aplikacji Article).
 *
 * Name spelling follows the homepage founders section
 * (`home.team.bartek.name` = "Bartosz Kołaj"), which is the most prominent,
 * user-facing instance of the name on the site. Most of the rest of the
 * codebase spells it "Bartosz Kolaj" (no ł) — that split predates this task
 * and is flagged in the report rather than fixed here (out of scope: it's
 * copy, not structured data).
 */
export function buildPeople(): SchemaNode[] {
  return [
    {
      "@type": "Person",
      "@id": WOJCIECH_ID,
      name: "Wojciech Płonka",
      jobTitle: "Design & Product",
      knowsAbout: ["Product design", "UX/UI"],
      worksFor: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "Person",
      "@id": BARTOSZ_ID,
      name: "Bartosz Kołaj",
      jobTitle: "Engineering",
      knowsAbout: ["Software engineering"],
      worksFor: { "@id": ORGANIZATION_ID },
    },
  ];
}

/**
 * Byline registry for blog posts — frontmatter's `author` field (e.g.
 * "wojciech-plonka") must be a key here. Kept next to buildPeople() so the two
 * can never name someone who isn't also a Person node in the site graph;
 * blog-contract.test.ts checks every post's author against this map.
 */
export const AUTHOR_SLUGS: Record<string, { id: string; name: string }> = {
  "wojciech-plonka": { id: WOJCIECH_ID, name: "Wojciech Płonka" },
  "bartosz-kolaj": { id: BARTOSZ_ID, name: "Bartosz Kołaj" },
};
