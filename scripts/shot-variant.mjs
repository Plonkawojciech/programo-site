// Full-page captures of a static variant at phone and desktop widths, as contact sheets.
// Usage: node scripts/shot-variant.mjs <url> <outPrefix>
import { chromium } from "playwright-core";
import sharp from "sharp";
const [url, out] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome", headless: true });
for (const [name, w, colH] of [["d", 1440, 1500], ["m", 390, 2400]]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500, deviceScaleFactor: 1 });
  const p = await c.newPage();
  const errors = []; p.on("pageerror", (e) => errors.push(String(e))); p.on("response", (r) => { if (r.status() >= 400) errors.push(r.status() + " " + r.url()); });
  await p.goto(url, { waitUntil: "networkidle" });
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(500);
  const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth, H: document.documentElement.scrollHeight, small: [...document.querySelectorAll("a,button,input,summary")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40; }).map((e) => (e.textContent || "").trim().slice(0, 24) + ":" + Math.round(e.getBoundingClientRect().height)) }));
  console.log(name, JSON.stringify(info), errors.length ? errors : "no errors");
  const png = await p.screenshot({ type: "png", fullPage: true });
  const m = await sharp(png).metadata(); const n = Math.ceil(m.height / colH); const parts = [];
  for (let i = 0; i < n; i++) parts.push({ input: await sharp(png).extract({ left: 0, top: i * colH, width: m.width, height: Math.min(colH, m.height - i * colH) }).toBuffer(), left: i * (m.width + 12), top: 0 });
  const sheet = await sharp({ create: { width: n * (m.width + 12), height: colH, channels: 3, background: "#ff00ff" } }).composite(parts).png().toBuffer();
  await sharp(sheet).resize({ width: Math.min(n * (m.width + 12), name === "d" ? 2400 : 1900) }).jpeg({ quality: 72 }).toFile(`${out}-${name}.jpg`);
  await c.close();
}
await b.close();
