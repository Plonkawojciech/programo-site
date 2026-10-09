// Live preview only: real Cloudflare test widget -> Next -> isolated durable inbox.
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const base = "https://v3.programo.pl";
const marker = `TEST-V3-${Date.now()}`;
const cases = [
  { route: "/", index: 0, id: "hero-phone" },
  { route: "/kontakt", index: 0, id: "kontakt-compact" },
  { route: "/kontakt", index: 1, id: "kontakt-full" },
];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = { base, marker, at: new Date().toISOString(), forms: [], analyticsRequests: [], errors: [] };
try {
  // Check the rejection before successful requests fill the normal 3/15min
  // submission limit. The demo uses the same compact component tested locally.
  const negativeContext = await browser.newContext();
  try {
    const page = await negativeContext.newPage(); await page.goto(base);
    const status = await page.evaluate(async () => (await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "TEST invalid token", phone: "600000000", consent: true, turnstileToken: "invalid-token" }),
    })).status);
    assert.equal(status, 403); report.invalidTokenStatus = status;
  } finally { await negativeContext.close(); }
  for (const test of cases) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, locale: "pl-PL" });
    try {
      const page = await context.newPage();
      page.on("request", r => { if (/googletagmanager|google-analytics|clarity\.ms|connect\.facebook/.test(r.url())) report.analyticsRequests.push(r.url()); });
      page.on("pageerror", e => report.errors.push(e.message));
      await page.goto(base + test.route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.getByText("Podgląd: testowa ochrona formularza.", { exact: false }).first().waitFor();
      const form = page.locator("form").nth(test.index);
      await form.locator('input[name="cf-turnstile-response"]').evaluate(el => new Promise((resolve, reject) => {
        const end = Date.now() + 45000;
        const timer = setInterval(() => {
          if (el.value) { clearInterval(timer); resolve(); }
          else if (Date.now() > end) { clearInterval(timer); reject(new Error("Widget timeout")); }
        }, 100);
      }));
      const rejectCookies = page.getByRole("button", { name: "Tylko niezbędne", exact: true });
      if (await rejectCookies.isVisible()) await rejectCookies.click();
      await form.locator('input[name="name"]').fill(`${marker} ${test.id}`);
      await form.locator('input[name="phone"],input[name="contact"]').fill("600000000");
      await form.locator('input[name="consent"]').check();
      if (test.id === "kontakt-full") await form.locator('textarea[name="message"]').fill("TEST: referencje https://example.com/one i https://example.com/two. Podgląd, bez kontaktu handlowego.");
      const responsePromise = page.waitForResponse(r => r.url().endsWith("/api/contact") && r.request().method() === "POST");
      await form.locator('button[type="submit"]').click();
      const response = await responsePromise;
      assert.equal(response.status(), 200, await response.text());
      assert.deepEqual(await response.json(), { success: true, counted: false });
      report.forms.push({ formId: test.id, status: response.status(), counted: false,
        overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
      console.log("PASS preview form", test.id);
    } finally { await context.close(); }
  }
  assert.equal(report.analyticsRequests.length, 0);
  assert.equal(report.errors.length, 0);
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
