import fs from "node:fs";
import path from "node:path";
import { BLOG_CONTENT_DIR } from "./content-dir";

/** Filenames of every post in src/content/blog, e.g. ["foo.mdx", "bar.mdx"]. */
export function listPostFilenames(): string[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return [];
  return fs.readdirSync(BLOG_CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
}

export function readPostFile(filename: string): string {
  return fs.readFileSync(path.join(BLOG_CONTENT_DIR, filename), "utf8");
}
