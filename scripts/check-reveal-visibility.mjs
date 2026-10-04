import { chromium } from "playwright-core";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3111";
const routes = [
  "/",
  "/oferta",
  "/projekty",
  "/o-nas",
  "/strony-internetowe",
];
const widths = [390, 1440];
const modes = [
  { name: "default", options: {} },
  { name: "reduced-motion", options: { reducedMotion: "reduce" } },
  { name: "no-js", options: { javaScriptEnabled: false } },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];

try {
  for (const mode of modes) {
    for (const width of widths) {
      for (const route of routes) {
        const context = await browser.newContext({
          viewport: { width, height: width === 390 ? 844 : 1000 },
          ...mode.options,
        });
        const page = await context.newPage();
        await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });

        await page.evaluate(async () => {
          const step = Math.max(window.innerHeight * 0.8, 400);
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 80));
          }
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
        await page.waitForTimeout(800);

        const hidden = await page.locator("main *").evaluateAll((elements) =>
          elements.flatMap((element) => {
            if (!(element instanceof HTMLElement)) return [];
            if (
              element.matches(
                ".photo-dark, .photo-light, [class*='portrait-']",
              )
            ) {
              return [];
            }
            const rect = element.getBoundingClientRect();
            const opacity = Number.parseFloat(getComputedStyle(element).opacity);
            if (rect.height <= 40 || opacity >= 0.05) return [];
            return [
              {
                tag: element.tagName.toLowerCase(),
                id: element.id,
                className: element.className,
                height: Math.round(rect.height),
                opacity,
              },
            ];
          }),
        );

        const result = { mode: mode.name, width, route, hidden };
        results.push(result);
        console.log(JSON.stringify(result));
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

const failures = results.filter((result) => result.hidden.length > 0);
console.log(
  JSON.stringify({
    summary: {
      checks: results.length,
      passed: results.length - failures.length,
      failed: failures.length,
    },
  }),
);

if (failures.length > 0) process.exitCode = 1;
