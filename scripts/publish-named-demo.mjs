// Copies the named captures of one demo from assets/demos-named/ into
// public/screenshots/demos/, so a demo with `disclosure: "named"` in
// src/lib/demos.ts has its images. Run it only for a company that agreed in
// writing to be shown by name, or that became a client.
// Usage: node scripts/publish-named-demo.mjs <slug> [slug ...]
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("usage: node scripts/publish-named-demo.mjs <slug> [slug ...]");
  process.exit(1);
}
for (const slug of slugs) {
  for (const size of ["desktop", "mobile"]) {
    const file = `${slug}-${size}.webp`;
    const from = path.resolve("assets/demos-named", file);
    if (!existsSync(from)) {
      console.error("missing", from);
      process.exitCode = 1;
      continue;
    }
    copyFileSync(from, path.resolve("public/screenshots/demos", file));
    console.log("published", file);
  }
}
