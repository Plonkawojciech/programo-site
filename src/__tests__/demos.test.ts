import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { demos } from "@/lib/demos";

describe("website demos", () => {
  it("has unique slugs and hosts", () => {
    expect(new Set(demos.map((demo) => demo.slug)).size).toBe(demos.length);
    expect(new Set(demos.map((demo) => demo.host)).size).toBe(demos.length);
  });

  it("uses HTTPS URLs", () => {
    for (const demo of demos) {
      expect(demo.url, demo.slug).toMatch(/^https:\/\//);
      if (demo.variant) expect(demo.variant.url, `${demo.slug} variant`).toMatch(/^https:\/\//);
    }
  });

  it("has a desktop screenshot for every demo", () => {
    for (const demo of demos) {
      expect(
        existsSync(join(process.cwd(), "public", "screenshots", "demos", `${demo.slug}-desktop.webp`)),
        `${demo.slug} desktop screenshot`,
      ).toBe(true);
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
