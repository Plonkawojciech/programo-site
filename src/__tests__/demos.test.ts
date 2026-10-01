import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { demos, demoViews } from "@/lib/demos";

describe("website demos", () => {
  it("has unique slugs and hosts", () => {
    expect(new Set(demos.map((demo) => demo.slug)).size).toBe(demos.length);
    expect(new Set(demos.map((demo) => demo.host)).size).toBe(demos.length);
  });

  it("uses HTTPS URLs", () => {
    for (const demo of demos) {
      expect(demo.url, demo.slug).toMatch(/^https:\/\//);
    }
  });

  it("serves every screenshot the page asks for under the current disclosure", () => {
    for (const view of demoViews()) {
      for (const file of [view.desktop, view.mobile]) {
        expect(existsSync(join(process.cwd(), "public", file)), file).toBe(true);
      }
    }
  });

  it("keeps named captures out of public/ unless the demo is named", () => {
    const named = new Set(demoViews().filter((v) => !v.concept).map((v) => v.slug));
    for (const demo of demos) {
      for (const size of ["desktop", "mobile"]) {
        const file = `${demo.slug}-${size}.webp`;
        expect(existsSync(join(process.cwd(), "assets", "demos-named", file)), `assets/demos-named/${file}`).toBe(true);
        if (!named.has(demo.slug)) {
          expect(existsSync(join(process.cwd(), "public", "screenshots", "demos", file)), `public copy of ${file}`).toBe(false);
        }
      }
    }
  });

  it("never leaks a company name, host or link in concept mode", () => {
    const views = demoViews("concept");
    expect(views.length).toBeGreaterThan(0);
    for (const view of views) {
      const demo = demos.find((d) => d.slug === view.slug)!;
      expect(view.url, view.slug).toBeUndefined();
      expect(view.host, view.slug).toBeUndefined();
      const text = [view.title.pl, view.title.en, view.eyebrow.pl, view.summary.pl, view.summary.en].join(" ").toLowerCase();
      expect(text, view.slug).not.toContain(demo.name.toLowerCase());
      expect(text, view.slug).not.toContain(demo.host.split(".")[0]);
    }
  });

  it("has non-empty summaries in both languages", () => {
    for (const demo of demos) {
      expect(demo.summary.pl.trim(), `${demo.slug} summary.pl`).not.toBe("");
      expect(demo.summary.en.trim(), `${demo.slug} summary.en`).not.toBe("");
    }
  });

  it("uses six-digit hex accent colours", () => {
    for (const demo of demos) {
      expect(demo.accentColor, demo.slug).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});
