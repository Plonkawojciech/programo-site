import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3111";
const runs = Number(process.argv[3] ?? 3);
const staticBuild = process.argv.includes("--static");

const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function localFileFor(url) {
  const parsed = new URL(url);
  if (parsed.pathname === "/") return ".next/server/app/index.html";
  if (parsed.pathname.startsWith("/_next/static/")) {
    return path.join(".next", parsed.pathname.replace(/^\/_next\//, ""));
  }
  if (parsed.pathname === "/_next/image") {
    const source = parsed.searchParams.get("url");
    return source?.startsWith("/") ? path.join("public", source) : null;
  }
  return path.join("public", parsed.pathname);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];

try {
  for (let run = 1; run <= runs; run += 1) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    if (staticBuild) {
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== new URL(baseUrl).origin) return route.abort();
        const file = localFileFor(url);
        if (!file) return route.abort();
        try {
          const body = await readFile(file);
          const extension = path.extname(file).toLowerCase();
          await route.fulfill({
            status: 200,
            body,
            contentType:
              file.endsWith(".html")
                ? "text/html; charset=utf-8"
                : contentTypes[extension] ?? "application/octet-stream",
          });
        } catch {
          await route.abort();
        }
      });
    }
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.__perfMeasurements = { longTasks: [], lcp: 0, cls: 0 };

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__perfMeasurements.longTasks.push(entry.duration);
        }
      }).observe({ type: "longtask", buffered: true });

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries.at(-1);
        if (last) window.__perfMeasurements.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__perfMeasurements.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(`${baseUrl}/`, { waitUntil: "load" });
    await page.waitForTimeout(8_000);
    const measurement = await page.evaluate(() => ({
      longTasksMs: window.__perfMeasurements.longTasks.reduce(
        (sum, duration) => sum + duration,
        0,
      ),
      lcpMs: window.__perfMeasurements.lcp,
      cls: window.__perfMeasurements.cls,
    }));
    results.push(measurement);
    console.log(JSON.stringify({ run, ...measurement }));
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(
  JSON.stringify({
    median: {
      longTasksMs: median(results.map((result) => result.longTasksMs)),
      lcpMs: median(results.map((result) => result.lcpMs)),
      cls: median(results.map((result) => result.cls)),
    },
  }),
);
