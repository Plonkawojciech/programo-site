/**
 * The site's shared Open Graph image descriptor.
 *
 * WHY THIS EXISTS
 *
 * `src/app/opengraph-image.tsx` generates the card image and Next.js attaches it
 * automatically — but ONLY to routes that do not declare their own `openGraph`
 * block. Every page here that sets `openGraph` (for a per-page title, URL and
 * description) silently dropped the generated image along with it, so ten of the
 * site's pages shared as a bare link with no preview card. That is invisible in
 * every automated check that only looks for `og:title`, and it is exactly the
 * kind of regression that comes back the next time someone adds a page.
 *
 * Spread `images: [OG_IMAGE]` into any `openGraph` block to opt back in.
 * `src/__tests__/seo.test.ts` asserts that no page declares `openGraph` without
 * it, so a new page cannot reintroduce the gap.
 *
 * The URL is the generated route without Next's content hash. The hash is a
 * cache-buster on the automatic reference, not part of the route match, so the
 * plain path serves the same image.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Programo - Software House z Poznania",
} as const;
