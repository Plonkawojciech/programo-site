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

export interface BlogPostingInput {
  path: string;
  headline: string;
  description?: string;
  datePublished: string;
  /** Same value as this post's frontmatter dateModified / sitemap lastModified. */
  dateModified: string;
  /** @id of a Person node already in the site graph (see AUTHOR_SLUGS in people.ts). */
  authorId: string;
  wordCount: number;
}

/**
 * BlogPosting is Article's more specific sibling (schema.org has it inherit
 * from Article, which inherits from CreativeWork) — a byline author instead
 * of the Organization, plus datePublished and wordCount, both of which
 * matter for a content-freshness/effort signal in a way a static service
 * page's Article node doesn't need.
 */
export function buildBlogPosting(input: BlogPostingInput): SchemaNode {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: input.headline,
    inLanguage: "pl-PL",
    ...(input.description && { description: input.description }),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@id": input.authorId },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    wordCount: input.wordCount,
  };
}
