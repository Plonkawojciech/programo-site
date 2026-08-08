// Table of contents extraction: reads H2s straight out of the raw MDX body
// text via regex instead of parsing the MDX AST, because that is exactly
// what mdx-components.tsx's `h2` override needs to agree with (see
// slugifyHeading below) - two independent parses of the same markdown would
// only be worth it if they had to disagree.

/** Same slug algorithm the h2 override in mdx-components.tsx uses for its `id`. */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics (ą -> a, ó -> o, ...)
    .replace(/ł/g, "l") // NFD doesn't decompose ł - it's a distinct letter, not l + combining stroke
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export interface TocEntry {
  id: string;
  text: string;
}

/** Every `## Heading` line in a post body, in document order. */
export function extractToc(body: string): TocEntry[] {
  const matches = body.matchAll(/^##\s+(.+)$/gm);
  return Array.from(matches, (m) => {
    const text = m[1].trim();
    return { id: slugifyHeading(text), text };
  });
}
