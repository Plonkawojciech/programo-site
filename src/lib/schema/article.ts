import { ORGANIZATION_ID, SITE_URL } from "./constants";
import type { SchemaNode } from "./types";

export interface ArticleInput {
  path: string;
  headline: string;
  /** Same value as this route's WebPage.dateModified / sitemap lastModified. */
  dateModified?: string;
}

export function buildArticle(input: ArticleInput): SchemaNode {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: input.headline,
    inLanguage: "pl-PL",
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(input.dateModified && { dateModified: input.dateModified }),
  };
}
