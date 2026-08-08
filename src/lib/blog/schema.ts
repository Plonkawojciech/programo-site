import { z } from "zod";

// Frontmatter contract for every src/content/blog/<slug>.mdx file, enforced
// at build time (every static route reads through getAllPosts() during
// `next build`'s generateStaticParams pass) — not deferred to a runtime API
// route that could silently accept a broken post.
//
// Field-by-field reasoning lives in docs/plans/blog-aeo-2026-08.md section 3.1;
// the deeper editorial rules (word counts, banned phrases, keyword stuffing
// guard) are enforced separately in src/__tests__/blog-contract.test.ts, which
// needs access to the parsed MDX body, not just the frontmatter shape.

// Landmine: gray-matter parses YAML with js-yaml's default schema, which
// auto-converts an unquoted `2026-08-08` into a JS `Date` — silently, only
// for values that look like a full date, not `2026-06`. A post author (or
// the future cron pipeline in section 4 of the plan) forgetting to quote a
// date would otherwise fail `next build` with a confusing "expected string,
// received Date". Coercing it back to YYYY-MM-DD here means both `2026-08-08`
// and `"2026-08-08"` work identically.
function dateField(pattern: RegExp, message: string) {
  return z.preprocess(
    (val) => (val instanceof Date ? val.toISOString().slice(0, 10) : val),
    z.string().regex(pattern, message),
  );
}

const sourceSchema = z.object({
  label: z.string().min(1, "source.label is empty"),
  url: z.string().url().startsWith("https://", "source.url must be https"),
  // "2026-06" or "2026-06-12" — a full ISO date is not always available for a
  // cited source (a report page often only states a month), so this stays a
  // loose string rather than z.iso.date().
  date: dateField(/^\d{4}-\d{2}(-\d{2})?$/, "source.date must be YYYY-MM or YYYY-MM-DD"),
});

const faqSchema = z.object({
  q: z.string().min(1, "faq.q is empty").endsWith("?", "faq.q must end with a question mark"),
  a: z.string().min(1, "faq.a is empty"),
});

export const frontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  title: z.string().min(1).max(90),
  // The H1 on the post page — phrased as the question the post answers.
  question: z.string().min(1),
  // The 40-60 word extractive answer block. Length + self-containment are
  // checked in blog-contract.test.ts, not here (word-count needs the body
  // context, and this schema only validates shape).
  answer: z.string().min(1),
  cluster: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "cluster must be kebab-case"),
  // Must be a key in AUTHOR_SLUGS (src/lib/schema/people.ts) — checked in
  // blog-contract.test.ts, where the failure message can name the file.
  author: z.string().min(1),
  datePublished: dateField(/^\d{4}-\d{2}-\d{2}$/, "datePublished must be YYYY-MM-DD"),
  dateModified: dateField(/^\d{4}-\d{2}-\d{2}$/, "dateModified must be YYYY-MM-DD"),
  sources: z.array(sourceSchema).min(1, "at least one source is required"),
  faq: z.array(faqSchema).min(3, "at least 3 FAQ entries are required"),
  lang: z.literal("pl"),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;
export type PostSource = z.infer<typeof sourceSchema>;
export type PostFaqEntry = z.infer<typeof faqSchema>;
