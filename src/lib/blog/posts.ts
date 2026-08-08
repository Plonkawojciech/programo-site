import { listPostFilenames, readPostFile } from "./read";
import { parsePostFile, type ParsedPost } from "./parse";

// Module-level cache: content-dir.ts's directory is read from disk once per
// process. Safe because posts only change between builds (they are files in
// git, not a live datastore) — the same assumption src/lib/projects.ts makes
// for its in-memory array.
let cache: ParsedPost[] | null = null;

/** Every post, newest datePublished first. */
export function getAllPosts(): ParsedPost[] {
  if (cache) return cache;
  cache = listPostFilenames()
    .map((file) => parsePostFile(readPostFile(file), file))
    .sort((a, b) => b.frontmatter.datePublished.localeCompare(a.frontmatter.datePublished));
  return cache;
}

export function getPostBySlug(slug: string): ParsedPost | undefined {
  return getAllPosts().find((p) => p.frontmatter.slug === slug);
}

export const POSTS_PER_PAGE = 20;

export function getPostsPage(page: number): ParsedPost[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return getAllPosts().slice(start, start + POSTS_PER_PAGE);
}

export function getPageCount(): number {
  return Math.max(1, Math.ceil(getAllPosts().length / POSTS_PER_PAGE));
}
