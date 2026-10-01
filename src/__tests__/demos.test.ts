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

  it("has every screenshot both disclosure modes can ask for", () => {
    for (const mode of ["named", "concept"] as const) {
      for (const view of demoViews(mode)) {
        for (const file of [view.desktop, view.mobile]) {
          expect(existsSync(join(process.cwd(), "public", file)), file).toBe(true);
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
