// Read-only browser verification of the deployed preview. No form is submitted.
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const [baseArg = "https://v3.programo.pl", outArg = ".vercel/v3-audit"] = process.argv.slice(2);
const base = new URL(baseArg).origin;
if (!["v3.programo.pl", "localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Only preview/local URLs are allowed");
const out = path.resolve(outArg);
mkdirSync(out, { recursive: true });
const routes = ["/", "/oferta", "/cennik", "/projekty", "/kontakt", "/o-nas",
  "/strony-internetowe", "/sklepy-internetowe", "/aplikacje-webowe-dla-firm", "/aplikacje-mobilne-dla-firm",
  "/projects/innochem", "/projects/terapia-dens", "/projects/jedmar"];
const report = { base, at: new Date().toISOString(), browser: {}, performance: [], metadata: [], analyticsRequests: [] };
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await context.addInitScript((theme) => {
      localStorage.setItem("programo-theme", theme);
      localStorage.setItem("programo-consent-v1", JSON.stringify({ analytics: true, marketing: true, decided: true }));
    }, theme);
    const page = await context.newPage();
    page.on("request", (req) => {
      if (/googletagmanager|google-analytics|clarity\.ms|connect\.facebook/.test(req.url())) report.analyticsRequests.push(req.url());
    });
    for (const route of theme === "light" ? routes : ["/", "/kontakt", "/cennik"]) {
      const errors = [];
      const onError = (e) => errors.push(e.message);
      page.on("pageerror", onError);
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1200);
      const info = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        h1: [...document.querySelectorAll("h1")].map((e) => e.textContent.trim()),
        title: document.title, description: document.querySelector('meta[name="description"]')?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        robots: document.querySelector('meta[name="robots"]')?.content,
      }));
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const key = `${route} ${theme}`;
      report.browser[key] = { status: response.status(), ...info, errors,
        violations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, description: v.description,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })) };
      if (["/", "/kontakt", "/projekty", "/cennik"].includes(route)) {
        await page.screenshot({ path: path.join(out, `${route === "/" ? "home" : route.slice(1)}-${theme}.png`), fullPage: true });
      }
      page.off("pageerror", onError);
      console.log("a11y", key, axe.violations.length, "overflow", info.scrollWidth > info.width);
    }
    await context.close();
  }
  // JS disabled: content and the contact form stay visible in the server HTML.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of ["/", "/cennik", "/kontakt", "/projekty"]) {
    await page.goto(base + route, { waitUntil: "domcontentloaded" });
    report.metadata.push({ route, jsDisabled: true, h1: await page.locator("h1").allTextContents(),
      contactFormVisible: await page.locator('form').first().isVisible().catch(() => false),
      bodyChars: (await page.locator("main").innerText()).length });
  }
  await context.close();
} finally { await browser.close(); }
writeFileSync(path.join(out, "browser.json"), JSON.stringify(report, null, 2));

const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"] });
try {
  for (const [route, count] of [["/", 3], ["/kontakt", 1], ["/projekty", 1], ["/cennik", 1]]) {
    for (let run = 1; run <= count; run++) {
      const { lhr } = await lighthouse(base + route, {
        port: chrome.port, onlyCategories: ["performance", "accessibility", "seo"],
        formFactor: "mobile", throttlingMethod: "simulate", logLevel: "error",
      });
      const result = { route, run, lighthouseVersion: lhr.lighthouseVersion,
        performance: lhr.categories.performance.score, accessibility: lhr.categories.accessibility.score,
        seo: lhr.categories.seo.score, lcpMs: lhr.audits["largest-contentful-paint"].numericValue,
        cls: lhr.audits["cumulative-layout-shift"].numericValue,
        tbtMs: lhr.audits["total-blocking-time"].numericValue,
        lcpElement: lhr.audits["largest-contentful-paint-element"]?.details,
        diagnostics: Object.entries(lhr.audits).filter(([, a]) => a.score !== null && a.score < 0.9).map(([id, a]) => ({ id, title: a.title, displayValue: a.displayValue })) };
      report.performance.push(result);
      writeFileSync(path.join(out, `lighthouse-${route === "/" ? "home" : route.slice(1)}-${run}.json`), JSON.stringify(lhr));
      console.log("mobile", route, run, "LCP", Math.round(result.lcpMs), "score", result.performance);
      writeFileSync(path.join(out, "summary.json"), JSON.stringify(report, null, 2));
    }
  }
} finally { await chrome.kill(); }
const home = report.performance.filter((r) => r.route === "/").map((r) => r.lcpMs).sort((a, b) => a - b);
report.homeMedianLcpMs = home[Math.floor(home.length / 2)];
writeFileSync(path.join(out, "summary.json"), JSON.stringify(report, null, 2));
console.log("home median LCP", Math.round(report.homeMedianLcpMs), "analyticsRequests", report.analyticsRequests.length);
