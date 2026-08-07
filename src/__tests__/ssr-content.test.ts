import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Guard against the one regression that would quietly destroy AI visibility.
//
// AI crawlers — GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Meta's agents —
// do NOT execute JavaScript. They read the HTML the server sends and nothing
// else. So the day someone moves copy behind a `useEffect`, a
// `dynamic(..., { ssr: false })`, or a `{isOpen && <Content/>}` toggle, the page
// keeps looking perfect in a browser while becoming invisible to every answer
// engine — and nothing in the build output or the browser would say so.
//
// These assertions read the prerendered HTML that `next build` writes and check
// that each page still ships real text. They need a build first; if there is no
// build output they skip rather than fail, so `npm run test` alone stays useful.

const APP_DIR = join(process.cwd(), ".next", "server", "app");

/** Visible text: markup, scripts and styles removed. */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Minimum characters of server-rendered text per page. Set below the current
 * values so ordinary copy edits do not trip it, but high enough that a page
 * falling back to client-only rendering (which collapses to near zero) fails.
 */
const PAGES: { file: string; label: string; min: number }[] = [
  { file: "index.html", label: "/", min: 3000 },
  { file: "oferta.html", label: "/oferta", min: 1000 },
  { file: "cennik.html", label: "/cennik", min: 800 },
  { file: "kontakt.html", label: "/kontakt", min: 500 },
  { file: "o-nas.html", label: "/o-nas", min: 800 },
  { file: "projekty.html", label: "/projekty", min: 1000 },
  { file: "software-house-poznan.html", label: "/software-house-poznan", min: 2000 },
  { file: "strony-internetowe.html", label: "/strony-internetowe", min: 4000 },
  { file: "sklepy-internetowe.html", label: "/sklepy-internetowe", min: 4000 },
  { file: "ile-kosztuje-aplikacji.html", label: "/ile-kosztuje-aplikacji", min: 2000 },
  { file: "wspolpraca.html", label: "/wspolpraca", min: 2000 },
];

const built = existsSync(APP_DIR);

describe.skipIf(!built)("server-rendered content (AI crawlers do not run JS)", () => {
  for (const page of PAGES) {
    it(`${page.label} ships real text in the HTML`, () => {
      const path = join(APP_DIR, page.file);
      if (!existsSync(path)) {
        // A renamed route should be noticed, not silently passed over.
        throw new Error(`Prerendered ${page.file} is missing — route renamed or no longer static?`);
      }
      const text = visibleText(readFileSync(path, "utf8"));
      expect(text.length, `${page.label} has only ${text.length} chars of server-rendered text`)
        .toBeGreaterThan(page.min);
    });
  }

  it("the homepage ships a single H1 and structured data", () => {
    const html = readFileSync(join(APP_DIR, "index.html"), "utf8");
    const h1s = html.match(/<h1[\s>]/g) ?? [];
    expect(h1s.length, "expected exactly one H1").toBe(1);
    expect(html).toContain("application/ld+json");
  });

  it("every page declares a canonical and a meta description", () => {
    for (const page of PAGES) {
      const path = join(APP_DIR, page.file);
      if (!existsSync(path)) continue;
      const html = readFileSync(path, "utf8");
      expect(html, `${page.label} canonical`).toMatch(/rel="canonical"/);
      expect(html, `${page.label} description`).toMatch(/name="description"/);
    }
  });

  it("the internal CRM panel is not prerendered into the public output", () => {
    // /crm is force-dynamic and token-gated; a static copy would leak the shell.
    expect(existsSync(join(APP_DIR, "crm.html"))).toBe(false);
  });
});
