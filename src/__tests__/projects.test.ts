import { describe, it, expect } from "vitest";
import { projects, getProjectBySlug, getAdjacentProjects } from "@/lib/projects";

describe("projects data", () => {
  it("has exactly 4 projects", () => {
    expect(projects).toHaveLength(4);
  });

  it("all 4 projects have correct slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toContain("estalo");
    expect(slugs).toContain("baulx");
    expect(slugs).toContain("athlix");
    expect(slugs).toContain("learnai");
  });

  it("each project has required fields", () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.subtitle.pl).toBeTruthy();
      expect(p.subtitle.en).toBeTruthy();
      expect(p.description.pl).toBeTruthy();
      expect(p.description.en).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
      expect(p.features.pl.length).toBeGreaterThan(0);
      expect(p.features.en.length).toBeGreaterThan(0);
      expect(["live", "development", "planned"]).toContain(p.status);
    }
  });

  it("all slugs are URL-safe", () => {
    for (const p of projects) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("generateStaticParams returns all 4 slugs", () => {
    const params = projects.map((p) => ({ slug: p.slug }));
    expect(params).toHaveLength(4);
    expect(params).toContainEqual({ slug: "estalo" });
    expect(params).toContainEqual({ slug: "baulx" });
    expect(params).toContainEqual({ slug: "athlix" });
    expect(params).toContainEqual({ slug: "learnai" });
  });

  it("live projects (estalo, baulx) have liveUrl", () => {
    const estalo = getProjectBySlug("estalo");
    const baulx = getProjectBySlug("baulx");
    expect(estalo?.liveUrl).toBeTruthy();
    expect(baulx?.liveUrl).toBeTruthy();
  });

  it("live projects (athlix) have correct status", () => {
    const athlix = getProjectBySlug("athlix");
    expect(athlix?.status).toBe("live");
  });

  it("planned projects (learnai) have no liveUrl", () => {
    const learnai = getProjectBySlug("learnai");
    expect(learnai?.liveUrl).toBeUndefined();
  });

  it("features arrays are non-empty", () => {
    for (const p of projects) {
      expect(p.features.pl.length).toBeGreaterThan(0);
      expect(p.features.en.length).toBeGreaterThan(0);
    }
  });

  it("tech arrays are non-empty", () => {
    for (const p of projects) {
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });

  it("accent colors are valid hex", () => {
    for (const p of projects) {
      expect(p.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("getAdjacentProjects returns correct neighbors", () => {
    const { prev, next } = getAdjacentProjects("baulx");
    expect(prev?.slug).toBe("estalo");
    expect(next?.slug).toBe("athlix");
  });

  it("getAdjacentProjects handles first/last project", () => {
    const first = getAdjacentProjects("estalo");
    expect(first.prev).toBeNull();
    expect(first.next?.slug).toBe("baulx");

    const last = getAdjacentProjects("learnai");
    expect(last.prev?.slug).toBe("athlix");
    expect(last.next).toBeNull();
  });

  it("year field present and valid for all projects", () => {
    for (const p of projects) {
      expect(p.year).toBeTruthy();
      expect(p.year).toMatch(/^\d{4}/); // starts with 4-digit year
    }
  });

  it("role field present for both PL and EN", () => {
    for (const p of projects) {
      expect(p.role.pl).toBeTruthy();
      expect(p.role.en).toBeTruthy();
    }
  });

  it("bgColor is a valid hex color", () => {
    for (const p of projects) {
      expect(p.bgColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("getProjectBySlug returns undefined for unknown slug", () => {
    expect(getProjectBySlug("nonexistent")).toBeUndefined();
  });
});
