// Full-page screenshots + overflow/tap-target report for a list of routes.
// Usage: node scripts/audit-shots.mjs <baseUrl> <outDir> [route ...]
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [base, out, ...routesArg] = process.argv.slice(2);
const routes = routesArg.length ? routesArg : ["/"];
const SIZES = [
  { name: "m", viewport: { width: 375, height: 812 }, mobile: true },
  { name: "t", viewport: { width: 820, height: 1180 }, mobile: true },
  { name: "d", viewport: { width: 1440, height: 900 }, mobile: false },
];
mkdirSync(out, { recursive: true });
const report = {};
const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const s of SIZES) {
  const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: 1, isMobile: s.mobile, hasTouch: s.mobile, locale: "pl-PL" });
  await ctx.addCookies([{ name: "programo-consent", value: encodeURIComponent(JSON.stringify({ analytics: false, marketing: false, v: 1 })), url: base }]);
  const page = await ctx.newPage();
  for (const r of routes) {
    try {
      await page.goto(base + r, { waitUntil: "networkidle", timeout: 60000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
      const info = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const inRail = (e) => { for (let p = e.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true; } return false; };
        const over = [...document.querySelectorAll("body *")].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > vw + 1 || b.left < -1) && !inRail(e); }).slice(0, 8).map((e) => `${e.tagName}.${String(e.className).slice(0, 50)} [${Math.round(e.getBoundingClientRect().left)},${Math.round(e.getBoundingClientRect().right)}]`);
        const h1 = [...document.querySelectorAll("h1")].map((h) => h.textContent.trim().slice(0, 80));
        return { vw, sw: document.documentElement.scrollWidth, H: document.documentElement.scrollHeight, over, h1, title: document.title, desc: document.querySelector('meta[name=description]')?.content };
      });
      report[`${r} @${s.name}`] = info;
      const png = await page.screenshot({ type: "png", fullPage: true });
      const name = (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "_")) + `-${s.name}.jpg`;
      const w = s.name === "d" ? 900 : s.name === "t" ? 600 : 375;
      await sharp(png).resize({ width: w }).jpeg({ quality: 62 }).toFile(path.join(out, name));
    } catch (e) {
      report[`${r} @${s.name}`] = { error: String(e.message).split("\n")[0] };
    }
  }
  await ctx.close();
}
await browser.close();
writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 1));
console.log("done", Object.keys(report).length);
