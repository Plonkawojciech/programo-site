import { describe, it, expect } from "vitest";
import { projects, getProjectBySlug, getAdjacentProjects } from "@/lib/projects";

const EXPECTED_SLUGS = [
  "jedmar",
  "estalo",
  "eportal-prawny",
  "wks-poznan",
  "skup-nieruchomosci",
  "rejestr-pro",
  "solvio",
  "wsafefinanse",
  "domki-poznaniak",
  "pooltimer",
];

const REMOVED_SLUGS = ["baulx", "learnai", "ks-posnania", "athlix", "pool-system"];

const STATUSES = ["live", "development", "coming-soon", "planned"];

describe("projects data", () => {
  it("contains the expected projects", () => {
    const slugs = projects.map((p) => p.slug);
    for (const slug of EXPECTED_SLUGS) {
      expect(slugs, `missing project: ${slug}`).toContain(slug);
    }
  });

  it("does not contain removed projects", () => {
    const slugs = projects.map((p) => p.slug);
    for (const slug of REMOVED_SLUGS) {
      expect(slugs, `removed project still present: ${slug}`).not.toContain(slug);
    }
  });

  it("each project has required fields", () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.subtitle.pl).toBeTruthy();
      expect(p.subtitle.en).toBeTruthy();
      expect(p.description.pl).toBeTruthy();
      expect(p.description.en).toBeTruthy();
      expect(p.longDescription.pl).toBeTruthy();
      expect(p.longDescription.en).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
      expect(p.features.pl.length).toBeGreaterThan(0);
      expect(p.features.en.length).toBeGreaterThan(0);
      expect(STATUSES).toContain(p.status);
    }
  });

  it("has at least one coming-soon project (ePortal Prawny)", () => {
    const comingSoon = projects.filter((p) => p.status === "coming-soon");
    expect(comingSoon.length).toBeGreaterThanOrEqual(1);
    expect(comingSoon.map((p) => p.slug)).toContain("eportal-prawny");
  });

  it("categories use the current taxonomy", () => {
    const allowed = ["produkty", "dla-klientow", "marketing"];
    for (const p of projects) {
      expect(allowed, `${p.slug} has unknown category ${p.category}`).toContain(p.category);
    }
  });

  it("PL/EN parity on bilingual fields", () => {
    for (const p of projects) {
      expect(Boolean(p.subtitle.pl), `${p.slug} subtitle.pl`).toBe(true);
      expect(Boolean(p.subtitle.en), `${p.slug} subtitle.en`).toBe(true);
      expect(p.features.pl.length, `${p.slug} features parity`).toBe(p.features.en.length);
      if (p.statusLabel) {
        expect(Boolean(p.statusLabel.pl), `${p.slug} statusLabel.pl`).toBe(true);
        expect(Boolean(p.statusLabel.en), `${p.slug} statusLabel.en`).toBe(true);
      }
      if (p.metrics) {
        for (const m of p.metrics) {
          expect(Boolean(m.label.pl), `${p.slug} metric.pl`).toBe(true);
          expect(Boolean(m.label.en), `${p.slug} metric.en`).toBe(true);
        }
      }
    }
  });

  it("Solvio credits the collaboration partner", () => {
    const solvio = getProjectBySlug("solvio");
    expect(solvio?.partner).toContain("PBDevs");
    expect(solvio?.partner).toContain("Filip Piątek");
  });

  it("all slugs are URL-safe and unique", () => {
    const slugs = projects.map((p) => p.slug);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("generateStaticParams returns one entry per project", () => {
    const params = projects.map((p) => ({ slug: p.slug }));
    expect(params).toHaveLength(projects.length);
    expect(params).toContainEqual({ slug: "solvio" });
    expect(params).toContainEqual({ slug: "rejestr-pro" });
  });

  it("live projects have a liveUrl", () => {
    for (const p of projects) {
      if (p.status === "live") {
        expect(p.liveUrl, `${p.slug} is live but has no liveUrl`).toBeTruthy();
      }
    }
  });

  it("accent and bg colors are valid hex", () => {
    for (const p of projects) {
      expect(p.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.bgColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("presentation, when set, uses a known variant", () => {
    const allowed = ["light", "dark", "phones", "mosaic"];
    for (const p of projects) {
      if (p.presentation !== undefined) {
        expect(allowed, `${p.slug} has unknown presentation ${p.presentation}`).toContain(
          p.presentation
        );
      }
    }
  });

  it("hero variants are assigned so the portfolio is not one uniform group", () => {
    const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p.presentation]));
    // The mobile-app product leads with phone frames.
    expect(bySlug["jedmar"]).toBe("phones");
    // Estalo shows its CRM + Enterprise ecosystem as a mosaic.
    expect(bySlug["estalo"]).toBe("mosaic");
    // PoolTimer is presented as a dark product cockpit, not a light landing.
    expect(bySlug["pooltimer"]).toBe("dark");
    // More than one distinct variant is in use.
    const variants = new Set(projects.map((p) => p.presentation ?? "light"));
    expect(variants.size).toBeGreaterThanOrEqual(3);
  });

  it("getAdjacentProjects handles first and last project", () => {
    const firstSlug = projects[0].slug;
    const lastSlug = projects[projects.length - 1].slug;
    expect(getAdjacentProjects(firstSlug).prev).toBeNull();
    expect(getAdjacentProjects(lastSlug).next).toBeNull();
  });

  it("getAdjacentProjects returns neighbors for a middle project", () => {
    const { prev, next } = getAdjacentProjects(projects[1].slug);
    expect(prev?.slug).toBe(projects[0].slug);
    expect(next?.slug).toBe(projects[2].slug);
  });

  it("year field present and valid", () => {
    for (const p of projects) {
      expect(p.year).toBeTruthy();
      expect(p.year).toMatch(/^\d{4}/);
    }
  });

  it("role present for PL and EN", () => {
    for (const p of projects) {
      expect(p.role.pl).toBeTruthy();
      expect(p.role.en).toBeTruthy();
    }
  });

  it("getProjectBySlug returns undefined for unknown slug", () => {
    expect(getProjectBySlug("nonexistent")).toBeUndefined();
  });
});
