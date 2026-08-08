import { getAllPosts } from "./posts";
import type { ParsedPost } from "./parse";

export function getAllClusters(): string[] {
  return Array.from(new Set(getAllPosts().map((p) => p.frontmatter.cluster))).sort();
}

export function getPostsByCluster(cluster: string): ParsedPost[] {
  return getAllPosts().filter((p) => p.frontmatter.cluster === cluster);
}

/** Up to `limit` other posts from the same cluster — used for in-post related links. */
export function getRelatedPosts(post: ParsedPost, limit = 3): ParsedPost[] {
  return getAllPosts()
    .filter((p) => p.frontmatter.slug !== post.frontmatter.slug && p.frontmatter.cluster === post.frontmatter.cluster)
    .slice(0, limit);
}
