/** Real browser -> Next HTTP route -> Cloudflare dummy verification -> durable local CRM fixture.
 * No request interception or injected Turnstile token; never reads or uses live credentials.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, open, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

// Next would auto-load .env files even with an explicit child environment.
// Refuse credentialed checkouts without reading their contents.
if ((await readdir(process.cwd())).some(name => /^\.env(?:\.|$)/.test(name) && name !== '.env.example')) {
  throw new Error('Run E2E in a clean worktree without .env files.');
}
const directory = await mkdtemp(join(tmpdir(), 'programo-form-e2e-'));
const records = join(directory, 'fixture-submissions.jsonl');
const port = Number(process.env.FORM_E2E_PORT || 3219);
const fixturePort = Number(process.env.FORM_E2E_FIXTURE_PORT || 4219);
const secret = 'local-e2e-fixture-only';
let failFixture = false;
const fixture = createServer(async (request, response) => {
  if (request.method !== 'POST' || request.headers['x-webhook-secret'] !== secret) {
    response.writeHead(403).end(); return;
  }
  if (failFixture) { response.writeHead(503).end(); return; }
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const data = JSON.parse(Buffer.concat(chunks).toString());
  const file = await open(records, 'a', 0o600);
  await file.writeFile(JSON.stringify({ receivedAt: new Date().toISOString(), ...data }) + '\n');
  await file.sync(); await file.close();
  response.writeHead(201, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true }));
});
await new Promise(resolve => fixture.listen(fixturePort, '127.0.0.1', resolve));
const safeEnvironment = {
  PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'development',
  NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  NEXT_PUBLIC_TURNSTILE_TEST_MODE: 'true', PROGRAMO_DEPLOYMENT_ENV: 'preview',
  NEXT_PUBLIC_PROGRAMO_DEPLOYMENT_ENV: 'preview',
  CRM_WEBHOOK_SECRET: secret, CRM_INTAKE_URL: `http://127.0.0.1:${fixturePort}/api/form-intake`,
};
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--port', String(port)], {
  cwd: process.cwd(), env: safeEnvironment, stdio: ['ignore', 'pipe', 'pipe'],
});
let appOutput = '';
app.stdout.on('data', data => { appOutput = (appOutput + data).slice(-10000); });
app.stderr.on('data', data => { appOutput = (appOutput + data).slice(-10000); });
const origin = `http://localhost:${port}`;
let browser;
try {
  for (let attempt = 0; attempt < 90; attempt++) {
    if (app.exitCode !== null) throw new Error(`Next exited: ${appOutput}`);
    try { if ((await fetch(origin)).ok) break; } catch { /* waiting for compilation */ }
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (attempt === 89) throw new Error(`Next unavailable: ${appOutput}`);
  }
  browser = await chromium.launch({ executablePath: process.env.FORM_E2E_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const results = [];
  const cases = [
    { path: '/', form: 'form', index: 0, id: 'hero-phone' },
    { path: '/kontakt', form: 'form', index: 0, id: 'kontakt-compact' },
    { path: '/kontakt', form: 'form', index: 1, id: 'kontakt-full' },
    { path: '/projekty', form: 'form', index: 0, id: 'dema' },
  ];
  for (const [index, test] of cases.entries()) {
    console.log(`Testing ${test.id}`);
    const context = await browser.newContext({ locale: 'pl-PL', timezoneId: 'Europe/Warsaw', extraHTTPHeaders: { 'x-forwarded-for': `203.0.113.${20 + index}` } });
    const page = await context.newPage();
    page.on("pageerror", error => console.error("browser", error.message));
    await page.goto(origin + test.path, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.getByText('Podgląd: testowa ochrona formularza.', { exact: false }).first().waitFor({ timeout: 20000 });
    const form = page.locator(test.form).nth(test.index);
    await form.locator('input[name="cf-turnstile-response"]').evaluate(element => new Promise((resolve, reject) => {
      const deadline = Date.now() + 45000;
      const timer = setInterval(() => {
        if (element.value) { clearInterval(timer); resolve(); }
        else if (Date.now() > deadline) { clearInterval(timer); reject(new Error('Cloudflare dummy widget did not solve')); }
      }, 100);
    }));
    await form.locator('input[name="name"]').fill(`TEST preview ${test.id}`);
    await form.locator('input[name="phone"], input[name="contact"]').fill('509123434');
    await form.locator('input[name="consent"]').check();
    if (test.id === "kontakt-full") await form.locator('textarea[name="message"]').fill("TEST: referencje https://jedmar.pl i https://innochem.pl do wyceny strony.");
    const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/contact') && response.request().method() === 'POST', { timeout: 30000 });
    await form.locator('button[type="submit"]').click();
    const response = await responsePromise.catch(async error => {
      console.error("Form state:", await form.innerText());
      console.error("Tokens:", await form.locator('input[name="cf-turnstile-response"]').evaluateAll(elements => elements.map(element => element.value)));
      throw error;
    });
    assert.equal(response.status(), 200, await response.text());
    assert.deepEqual(await response.json(), { success: true, counted: false });
    const saved = (await readFile(records, 'utf8')).trim().split('\n').map(row => JSON.parse(row));
    assert(saved.some(record => record.formId === test.id && record.name === `TEST preview ${test.id}` && record.source === 'programo.pl-preview-test'));
    if (test.id === "kontakt-full") assert(saved.some(record => record.formId === test.id && record.verdict === "suspicious" && record.verdictReasons.includes("2 linki w treści")));
    results.push({ formId: test.id, status: 200, persisted: true, realCloudflareDummyWidget: true });
    await context.close();
  }
  // Invalid token must never reach the fixture, while a durable-store outage
  // must return a real error even after a valid Cloudflare test verification.
  const context = await browser.newContext({ extraHTTPHeaders: { 'x-forwarded-for': '203.0.113.80' } });
  const page = await context.newPage(); await page.goto(origin);
  const savedCount = (await readFile(records, 'utf8')).trim().split('\n').length;
  const post = token => page.evaluate(async turnstileToken => {
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'TEST negative', phone: '509123434', consent: true, turnstileToken }) });
    return response.status;
  }, token);
  assert.equal(await post('invalid-token'), 403);
  failFixture = true;
  assert.equal(await post('XXXX.DUMMY.TOKEN.XXXX'), 500);
  assert.equal((await readFile(records, 'utf8')).trim().split('\n').length, savedCount);
  await context.close();
  console.log(JSON.stringify({ passed: true, results, negativeCases: ['invalid-token-403-no-write', 'durable-store-down-500'], evidence: records }, null, 2));
} catch (error) {
  console.error(error); console.error(appOutput); process.exitCode = 1;
} finally {
  await browser?.close();
  app.kill('SIGTERM');
  await new Promise(resolve => { if (app.exitCode !== null) resolve(); else app.once('exit', resolve); });
  await new Promise(resolve => fixture.close(resolve));
}
