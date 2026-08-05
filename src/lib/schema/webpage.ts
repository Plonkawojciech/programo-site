import { WEBSITE_ID, SITE_URL } from "./constants";
import type { SchemaNode, SchemaRef } from "./types";

export interface WebPageInput {
  /** Site-relative path, e.g. "/oferta". Use "/" for the homepage. */
  path: string;
  name: string;
  description?: string;
  /**
   * ISO date string for the last significant content change. Pass the exact
   * same value used for this route's sitemap `lastModified`
   * (src/lib/schema/route-dates.ts) so the two signals never diverge.
   */
  dateModified?: string;
  /** The general subject of the page — typically `{ "@id": ORGANIZATION_ID }`. */
  about?: SchemaNode | SchemaRef;
  /** The specific entity the page documents, e.g. a Service, Article or SoftwareApplication node. */
  mainEntity?: SchemaNode | SchemaRef;
}

export function buildWebPage(input: WebPageInput): SchemaNode {
  const url = input.path === "/" ? SITE_URL : `${SITE_URL}${input.path}`;
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    isPartOf: { "@id": WEBSITE_ID },
    ...(input.description && { description: input.description }),
    ...(input.dateModified && { dateModified: input.dateModified }),
    ...(input.about && { about: input.about }),
    ...(input.mainEntity && { mainEntity: input.mainEntity }),
  };
}
