// Builds a static copy of the prerendered site for a preview host
// (no API, no image optimizer). Run after `STATIC_PREVIEW=1 npx next build`.
// Usage: node scripts/static-snapshot.mjs <outDir>
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const out = path.resolve(process.argv[2]);
const app = path.resolve(".next/server/app");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync("public", out, { recursive: true });
cpSync(".next/static", path.join(out, "_next/static"), { recursive: true });

let pages = 0;
function walk(dir, rel = "") {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) { walk(full, path.join(rel, name)); continue; }
    if (!name.endsWith(".html") || name.startsWith("_")) continue;
    const route = path.join(rel, name.replace(/\.html$/, ""));
    if (route.startsWith("crm") || route === "_not-found") continue;
    // Preview copies must never be indexed next to the real site.
    const html = readFileSync(full, "utf8").replace("<head>", '<head><meta name="robots" content="noindex, nofollow">');
    const target = route === "index" ? path.join(out, "index.html") : path.join(out, route, "index.html");
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, html);
    pages++;
  }
}
walk(app);
for (const f of ["sitemap.xml.body", "llms.txt.body"]) if (existsSync(path.join(app, f))) rmSync(path.join(out, f), { force: true });
writeFileSync(path.join(out, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log("pages", pages);
