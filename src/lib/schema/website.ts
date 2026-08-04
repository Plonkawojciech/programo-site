import { WEBSITE_ID, ORGANIZATION_ID, SITE_URL } from "./constants";
import type { SchemaNode } from "./types";

/**
 * The one WebSite node, rendered once in the root layout. Deliberately no
 * `potentialAction` / SearchAction — Google retired the Sitelinks Searchbox
 * rich result in November 2024, so that markup has no payoff anymore.
 */
export function buildWebsite(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Programo",
    url: SITE_URL,
    inLanguage: "pl-PL",
    publisher: { "@id": ORGANIZATION_ID },
  };
}
