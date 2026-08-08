import path from "node:path";

// Single place that knows where post files live on disk — every other module
// in src/lib/blog imports this instead of hardcoding the path.
export const BLOG_CONTENT_DIR = path.join(process.cwd(), "src/content/blog");
