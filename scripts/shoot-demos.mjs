// Screenshots of every demo for /dema: local Chrome via playwright-core → webp (sharp).
// Usage: node scripts/shoot-demos.mjs [slug ...]   (no args = all in scripts/demos.json)
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/screenshots/demos");
mkdirSync(OUT, { recursive: true });
const demos = JSON.parse(readFileSync(new URL("./demos.json", import.meta.url), "utf8"));
const only = process.argv.slice(2);

const SIZES = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, outW: 1200, mobile: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, outW: 390, mobile: true },
];

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
      // Entry animations settle; fonts load.
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      const png = await page.screenshot({ type: "png" });
      await sharp(png)
        .resize({ width: s.outW * 2 })
        .webp({ quality: 82 })
        .toFile(path.join(OUT, `${slug}-${s.name}.webp`));
      console.log("ok", slug, s.name);
    } catch (e) {
      console.error("FAIL", slug, s.name, String(e.message).split("\n")[0]);
    } finally {
      await ctx.close();
    }
  }
}
await browser.close();
