import matter from "gray-matter";
import { frontmatterSchema, type PostFrontmatter } from "./schema";

export interface ParsedPost {
  frontmatter: PostFrontmatter;
  /** Raw MDX body, frontmatter stripped — fed to MDXRemote at render time. */
  body: string;
}

/**
 * Parses one post file's frontmatter through the zod schema and throws with a
 * file-scoped message on failure — this is what makes an invalid post a red
 * `next build`/`npm test` instead of a silently broken page. Also checks the
 * filename against the frontmatter's own slug, since the filename is what
 * scripts/submit-indexnow.mjs and the RSS route key off (they read the
 * directory, not the YAML) — a mismatch there would silently 404.
 */
export function parsePostFile(raw: string, filename: string): ParsedPost {
  const { data, content } = matter(raw);
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    throw new Error(`blog/${filename}: invalid frontmatter\n${issues}`);
  }
  const fm = result.data;
  const expectedFilename = `${fm.slug}.mdx`;
  if (filename !== expectedFilename) {
    throw new Error(
      `blog/${filename}: frontmatter slug "${fm.slug}" does not match the filename (expected ${expectedFilename})`,
    );
  }
  return { frontmatter: fm, body: content.trim() };
}
