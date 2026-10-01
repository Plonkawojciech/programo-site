// Viewport-sized captures at given scroll anchors. Usage: node scripts/shot-sections.mjs <url> <out.jpg> <width> <sel,sel,...>
import { chromium } from "playwright-core";
import sharp from "sharp";
const [url, out, w, sels] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome", headless: true });
const H = +w < 500 ? 844 : 900;
const c = await b.newContext({ viewport: { width: +w, height: H }, isMobile: +w < 500, hasTouch: +w < 500 });
const p = await c.newPage();
await p.goto(url, { waitUntil: "networkidle" });
const parts = []; let i = 0;
for (const sel of sels.split(",")) {
  if (sel !== "top") await p.evaluate((s) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 70); }, sel);
  await p.waitForTimeout(900);
  parts.push({ input: await p.screenshot({ type: "png" }), left: i++ * (+w + 10), top: 0 });
}
const sheet = await sharp({ create: { width: i * (+w + 10), height: H, channels: 3, background: "#ff00ff" } }).composite(parts).png().toBuffer();
await sharp(sheet).resize({ width: Math.min(i * (+w + 10), 2000) }).jpeg({ quality: 78 }).toFile(out);
await b.close();
