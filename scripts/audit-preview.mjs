// Read-only browser verification of the deployed preview. No form is submitted.
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadavg, availableParallelism } from "node:os";

const [baseArg = "https://v3.programo.pl", outArg = ".vercel/v3-audit"] = process.argv.slice(2);
const base = new URL(baseArg).origin;
if (!["v3.programo.pl", "localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Only preview/local URLs are allowed");
const out = path.resolve(outArg);
mkdirSync(out, { recursive: true });
const sitemapResponse = await fetch(base + "/sitemap.xml");
if (!sitemapResponse.ok) throw new Error("The preview sitemap is unavailable");
const routes = [...new Set([...((await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g))]
  .map((match) => new URL(match[1]).pathname))];
if (!routes.length) throw new Error("The sitemap contains no routes");
const report = { base, at: new Date().toISOString(), browser: {}, performance: [], metadata: [], analyticsRequests: [] };
report.languages = process.env.AUDIT_ALL_LANGUAGES === "1" ? ["pl", "en"] : ["pl"];
report.host = { availableParallelism: availableParallelism(), loadAverage: loadavg() };
if (new URL(base).hostname === "v3.programo.pl") {
  const health = await (await fetch(base + "/api/health")).json();
  if (health.environment !== "preview" || !health.ok) throw new Error("This is not the functional preview");
  report.commit = health.commit;
}
if (process.env.AUDIT_LH_ONLY !== "1") {
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const language of report.languages) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await context.addInitScript(({ theme, language }) => {
      localStorage.setItem("programo-theme", theme);
      localStorage.setItem("programo-lang", language);
      localStorage.setItem("programo-consent-v1", JSON.stringify({ analytics: true, marketing: true, decided: true }));
    }, { theme, language });
    const page = await context.newPage();
    page.on("request", (req) => {
      if (/googletagmanager|google-analytics|clarity\.ms|connect\.facebook/.test(req.url())) report.analyticsRequests.push(req.url());
    });
    for (const route of routes) {
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
        language: document.documentElement.lang,
      }));
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"]).analyze();
      const key = `${route} ${theme} ${language}`;
      report.browser[key] = { status: response.status(), expectedLanguage: language, ...info, errors,
        violations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, description: v.description,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })) };
      if (["/", "/kontakt", "/projekty", "/cennik"].includes(route)) {
        await page.screenshot({ path: path.join(out, `${route === "/" ? "home" : route.slice(1)}-${theme}-${language}.png`), fullPage: true });
      }
      page.off("pageerror", onError);
      console.log("a11y", key, axe.violations.length, "overflow", info.scrollWidth > info.width);
    }
    await context.close();
  }
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
if (report.analyticsRequests.length || Object.values(report.browser).some((view) =>
  view.status !== 200 || view.language !== view.expectedLanguage || view.violations.length || view.errors.length || view.scrollWidth > view.width)) {
  throw new Error("Preview browser checks failed; inspect browser.json");
}
}

if (process.env.AUDIT_AXE_ONLY === "1") {
  if (report.commit) {
    const health = await (await fetch(base + "/api/health")).json();
    if (health.commit !== report.commit) throw new Error("The preview changed during verification; repeat on one commit");
  }
  writeFileSync(path.join(out, "summary.json"), JSON.stringify(report, null, 2));
  console.log("a11y routes", routes.length, "both themes", "analyticsRequests", report.analyticsRequests.length);
  process.exit(0);
}

const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const performanceRoutes = process.env.AUDIT_LH_HOME_ONLY === "1" ? [["/", 3]] : [["/", 3], ["/kontakt", 3], ["/projekty", 3], ["/cennik", 3]];
  if (process.env.AUDIT_LH_EXTENDED === "1" && process.env.AUDIT_LH_HOME_ONLY !== "1") {
    performanceRoutes.push(["/projects/jedmar", 3], ["/blog/ile-kosztuje-strona-internetowa-mala-firma-2026", 3], ["/strony-internetowe", 3]);
  }
  for (const [route, count] of performanceRoutes) {
    for (let run = 1; run <= count; run++) {
      const { lhr, artifacts } = await lighthouse(base + route, {
        port: chrome.port, onlyCategories: ["performance", "accessibility", "seo"],
        formFactor: "mobile", throttlingMethod: process.env.AUDIT_THROTTLING === "devtools" ? "devtools" : "simulate", logLevel: "error",
      });
      const result = { route, run, lighthouseVersion: lhr.lighthouseVersion,
        performance: lhr.categories.performance.score, accessibility: lhr.categories.accessibility.score,
        seo: lhr.categories.seo.score, lcpMs: lhr.audits["largest-contentful-paint"].numericValue,
        cls: lhr.audits["cumulative-layout-shift"].numericValue,
        tbtMs: lhr.audits["total-blocking-time"].numericValue,
        observedLcpMs: lhr.audits.metrics.details.items[0].observedLargestContentfulPaint,
        throttlingMethod: lhr.configSettings.throttlingMethod,
        hostLoadAverage: loadavg(),
        lcpElement: lhr.audits["largest-contentful-paint-element"]?.details,
        diagnostics: Object.entries(lhr.audits).filter(([, a]) => a.score !== null && a.score < 0.9).map(([id, a]) => ({ id, title: a.title, displayValue: a.displayValue })) };
      report.performance.push(result);
      const fileTag = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
      writeFileSync(path.join(out, `lighthouse-${fileTag}-${run}.json`), JSON.stringify(lhr));
      writeFileSync(path.join(out, `trace-${fileTag}-${run}.json`), JSON.stringify(artifacts.Trace));
      writeFileSync(path.join(out, `network-${fileTag}-${run}.json`), JSON.stringify(artifacts.DevtoolsLog));
      console.log("mobile", route, run, "LCP", Math.round(result.lcpMs), "score", result.performance);
      writeFileSync(path.join(out, "summary.json"), JSON.stringify(report, null, 2));
    }
  }
} finally { await chrome.kill(); }
const home = report.performance.filter((r) => r.route === "/").map((r) => r.lcpMs).sort((a, b) => a - b);
report.homeMedianLcpMs = home[Math.floor(home.length / 2)];
if (report.commit) {
  const health = await (await fetch(base + "/api/health")).json();
  if (health.commit !== report.commit) throw new Error("The preview changed during verification; repeat on one commit");
}
writeFileSync(path.join(out, "summary.json"), JSON.stringify(report, null, 2));
console.log("home median LCP", Math.round(report.homeMedianLcpMs), "analyticsRequests", report.analyticsRequests.length);
