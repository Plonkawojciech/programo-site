// Screenshots of every demo shown on /projekty: local Chrome via playwright-core → webp (sharp).
// Usage: node scripts/shoot-demos.mjs [slug ...]   (no args = all in scripts/demos.json)
//
// One standard for every capture, so the grid reads as one set:
//   desktop 1440×900 → 1600 px wide, mobile 390×844 → 780 px wide, DPR 2, WebP q80.
// Each demo is shot twice:
//   <slug>-{desktop,mobile}.webp          as the visitor sees it (cookie bars and
//                                          "demo version" strips removed). Written to
//                                          assets/demos-named/, NOT served.
//   <slug>-concept-{desktop,mobile}.webp  header and navigation removed as well, so the
//                                          company's logo and name are not in the frame.
//                                          Used when a demo is shown as an unnamed concept.
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Concept captures are served; named ones (company logo in the frame) are kept
// outside public/ and only copied in for a demo that is allowed to be named,
// with `node scripts/publish-named-demo.mjs <slug>`.
const OUT = path.resolve("public/screenshots/demos");
const OUT_NAMED = path.resolve("assets/demos-named");
mkdirSync(OUT, { recursive: true });
mkdirSync(OUT_NAMED, { recursive: true });
const demos = JSON.parse(readFileSync(new URL("./demos.json", import.meta.url), "utf8"));
const only = process.argv.slice(2);

const SIZES = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, outW: 1600, mobile: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, outW: 780, mobile: true },
];

// Runs in the page. Removes overlays that are about the demo, not the design.
function clean(concept) {
  const NOISE = /cookie|ciastecz|wersja demonstracyjna|wersja demo|przygotowan[ae] przez programo/i;
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    const pinned = cs.position === "fixed" || cs.position === "sticky";
    const box = el.getBoundingClientRect();
    const strip = box.height > 0 && box.height < 90 && box.width > innerWidth * 0.8;
    if ((pinned || strip) && NOISE.test(el.textContent || "") && (el.textContent || "").length < 600) {
      el.style.setProperty("display", "none", "important");
    }
  }
  if (concept) {
    for (const el of document.querySelectorAll("header, body > nav, [role=banner]")) {
      el.style.setProperty("display", "none", "important");
    }
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if ((cs.position === "fixed" || cs.position === "sticky") && el.getBoundingClientRect().top < 120) {
        el.style.setProperty("display", "none", "important");
      }
    }
  }
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const { slug, url } of demos) {
  if (only.length && !only.includes(slug)) continue;
  for (const s of SIZES) {
    const ctx = await browser.newContext({
      viewport: s.viewport,
      deviceScaleFactor: 2,
      isMobile: s.mobile,
      hasTouch: s.mobile,
      locale: "pl-PL",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      // Entry animations settle, hero videos paint a frame.
      await page.waitForTimeout(2500);
      for (const concept of [false, true]) {
        await page.evaluate(clean, concept);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);
        const png = await page.screenshot({ type: "png" });
        const name = `${slug}${concept ? "-concept" : ""}-${s.name}.webp`;
        await sharp(png).resize({ width: s.outW }).webp({ quality: 80, effort: 6 }).toFile(path.join(concept ? OUT : OUT_NAMED, name));
        console.log("ok", name);
      }
    } catch (e) {
      console.error("FAIL", slug, s.name, String(e.message).split("\n")[0]);
    } finally {
      await ctx.close();
    }
  }
}
await browser.close();
