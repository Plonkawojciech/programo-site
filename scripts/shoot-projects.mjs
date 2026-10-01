// Screenshots of the live sites behind the portfolio (public/screenshots/v2).
// Same standard as scripts/shoot-demos.mjs so /projekty reads as one set:
//   desktop 1440×900 → 1600 px wide, mobile 390×844 → 780 px wide, DPR 2, WebP q80.
// Usage: node scripts/shoot-projects.mjs [--out <dir>] [name ...]
//
// Not covered on purpose (they are not a plain page load): the Jedmar app
// shots (App Store captures), pooltimer-cockpit (cropped trainer panel behind a
// login) and jedmar-schemat-tool (a tool state reached by clicking).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SITES = [
  { name: "jedmar-shop", url: "https://jedmar.pl/pl" },
  { name: "jedmar-schematy", url: "https://jedmar.pl/pl/schematy-narzedzi" },
  { name: "estalo", url: "https://estalo.pl" },
  { name: "estalo-enterprise", url: "https://estalo.pl/enterprise" },
  { name: "estalo-portal", url: "https://portal.estalo.pl" },
  { name: "eportal-prawny", url: "https://eportalprawny.pl" },
  { name: "wks-poznan", url: "https://wkspoznan.pl" },
  { name: "skup-nieruchomosci", url: "https://skupnieruchomoscipl.pl" },
  { name: "rejestr-pro", url: "https://rejestr-pro.vercel.app" },
  { name: "solvio", url: "https://solvio-lac.vercel.app" },
  { name: "domki-poznaniak", url: "https://domkipoznaniak.pl" },
  { name: "pooltimer", url: "https://swimplatform.vercel.app" },
  { name: "wsafefinanse", url: "https://www.wsafefinance.pl" },
];

const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
const OUT = path.resolve(outFlag >= 0 ? args.splice(outFlag, 2)[1] : "public/screenshots/v2");
mkdirSync(OUT, { recursive: true });

const SIZES = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, outW: 1600, mobile: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, outW: 780, mobile: true },
];

// Runs in the page: cookie and consent bars are about the visit, not the design.
function clean() {
  const NOISE = /cookie|ciastecz|zgod|consent|rodo/i;
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if ((cs.position === "fixed" || cs.position === "sticky") && el.getBoundingClientRect().top > innerHeight * 0.4 && NOISE.test(el.textContent || "")) {
      el.style.setProperty("display", "none", "important");
    }
  }
  document.querySelectorAll("#CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay, #CookiebotWidget").forEach((el) => el.remove());
  document.querySelectorAll("[role=dialog], [aria-modal=true]").forEach((el) => {
    if (NOISE.test(el.textContent || "")) el.style.setProperty("display", "none", "important");
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const { name, url } of SITES) {
  if (args.length && !args.includes(name)) continue;
  for (const s of SIZES) {
    const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: 2, isMobile: s.mobile, hasTouch: s.mobile, locale: "pl-PL", reducedMotion: "reduce" });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2500);
      await page.evaluate(clean);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const png = await page.screenshot({ type: "png" });
      await sharp(png).resize({ width: s.outW }).webp({ quality: 80, effort: 6 }).toFile(path.join(OUT, `${name}-${s.name}.webp`));
      console.log("ok", name, s.name);
    } catch (e) {
      console.error("FAIL", name, s.name, String(e.message).split("\n")[0]);
    } finally {
      await ctx.close();
    }
  }
}
await browser.close();
