import { describe, it, expect } from "vitest";
import { projects, getProjectBySlug, getAdjacentProjects } from "@/lib/projects";

const EXPECTED_SLUGS = [
  "estalo",
  "jedmar",
  "wks-poznan",
  "wsafefinanse",
  "solvio",
  "rejestr-pro",
  "pool-system",
];

const REMOVED_SLUGS = ["baulx", "learnai", "ks-posnania", "athlix"];

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
      expect(p.tech.length).toBeGreaterThan(0);
      expect(p.features.pl.length).toBeGreaterThan(0);
      expect(p.features.en.length).toBeGreaterThan(0);
      expect(["live", "development", "planned"]).toContain(p.status);
    }
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
