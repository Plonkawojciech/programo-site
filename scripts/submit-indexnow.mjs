// IndexNow submitter — run after a production build.
//
// What it is worth, stated plainly: IndexNow is supported by Bing, Yandex,
// Seznam, Naver, Yep, Internet Archive and Amazon. GOOGLE DOES NOT SUPPORT IT —
// it said it would "test" the protocol in October 2021 and has never shipped
// it. So this speeds up discovery in Bing and friends only, which for Polish
// B2B is a small share of traffic. It costs ~30 seconds of build time and
// nothing else, which is the entire argument for having it.
//
// Bing explicitly asks sites not to ping on every trivial change, so this only
// runs on production builds.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const HOST = "programo.pl";
const SITE_URL = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** The key lives in public/<key>.txt — discover it instead of duplicating it. */
function findKey() {
  const explicit = process.env.INDEXNOW_KEY;
  if (explicit) return explicit;
  try {
    const files = readdirSync("public");
    const keyFile = files.find((f) => /^[a-f0-9]{32}\.txt$/i.test(f));
    if (!keyFile) return null;
    return readFileSync(join("public", keyFile), "utf8").trim();
  } catch {
    return null;
  }
}

// Only production deploys. VERCEL_ENV is set by Vercel; locally it is undefined,
// so a developer running `npm run build` never pings the search engines.
const isProd = process.env.VERCEL_ENV === "production";
const key = findKey();

if (!isProd) {
  console.log("[indexnow] skipped — not a production deploy");
  process.exit(0);
}
if (!key) {
  console.log("[indexnow] skipped — no key file found in public/");
  process.exit(0);
}

// The URL list is derived from the same sources the site renders from, so it
// cannot drift: static pages from src/lib/site-urls.ts, project pages from
// src/lib/projects.ts. Both are TS modules, so read the paths out textually
// rather than pulling a TS toolchain into a build script.
function extractStaticPaths() {
  const src = readFileSync("src/lib/site-urls.ts", "utf8");
  return [...src.matchAll(/path:\s*"([^"]*)"/g)].map((m) => m[1]);
}

function extractProjectSlugs() {
  const src = readFileSync("src/lib/projects.ts", "utf8");
  return [...src.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

let urlList;
try {
  urlList = [
    ...extractStaticPaths().map((p) => `${SITE_URL}${p}`),
    ...extractProjectSlugs().map((s) => `${SITE_URL}/projects/${s}`),
  ];
} catch (e) {
  console.error("[indexnow] could not build URL list:", e.message);
  process.exit(0); // never fail a deploy over this
}

if (urlList.length === 0) {
  console.log("[indexnow] skipped — empty URL list");
  process.exit(0);
}

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList,
    }),
    signal: AbortSignal.timeout(10000),
  });
  // 200/202 accepted · 400 bad format · 403 key not valid · 422 URL/host
  // mismatch · 429 treated as spam
  console.log(`[indexnow] submitted ${urlList.length} urls — status ${res.status}`);
  if (!res.ok) console.log(`[indexnow] response body: ${await res.text().catch(() => "")}`);
} catch (e) {
  console.error("[indexnow] submit failed:", e.message);
}
