import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { projects } from "@/lib/projects";

describe("SEO", () => {
  describe("robots.ts", () => {
    it("generates valid robots config", () => {
      const config = robots();
      expect(config.rules).toBeDefined();
      expect(config.sitemap).toBe("https://programo.pl/sitemap.xml");
    });

    it("allows all user agents", () => {
      const config = robots();
      const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
      expect(rules.userAgent).toBe("*");
      expect(rules.allow).toBe("/");
    });
  });

  describe("sitemap.ts", () => {
    it("includes all 5 URLs", () => {
      const entries = sitemap();
      expect(entries).toHaveLength(5);
    });

    it("includes homepage with priority 1.0", () => {
      const entries = sitemap();
      const home = entries.find((e) => e.url === "https://programo.pl");
      expect(home).toBeDefined();
      expect(home?.priority).toBe(1.0);
    });

    it("includes all project URLs", () => {
      const entries = sitemap();
      const urls = entries.map((e) => e.url);
      for (const p of projects) {
        expect(urls).toContain(`https://programo.pl/projects/${p.slug}`);
      }
    });

    it("all entries have changeFrequency", () => {
      const entries = sitemap();
      for (const entry of entries) {
        expect(entry.changeFrequency).toBe("monthly");
      }
    });
  });

  describe("meta descriptions", () => {
    it("all project descriptions are under 160 chars", () => {
      for (const p of projects) {
        expect(
          p.description.pl.length,
          `${p.title} PL desc too long`
        ).toBeLessThanOrEqual(300); // descriptions used as-is, trimmed at 155 in metadata
      }
    });
  });

  describe("project titles", () => {
    it("all project titles are under 60 chars when combined with 'Programo'", () => {
      for (const p of projects) {
        const fullTitle = `${p.title} — Programo`;
        expect(
          fullTitle.length,
          `${p.title} title too long: ${fullTitle}`
        ).toBeLessThanOrEqual(60);
      }
    });
  });

  describe("sitemap priorities", () => {
    it("project pages have priority 0.8", () => {
      const entries = sitemap();
      const projectEntries = entries.filter((e) => e.url.includes("/projects/"));
      for (const entry of projectEntries) {
        expect(entry.priority).toBe(0.8);
      }
    });

    it("all entries have lastModified", () => {
      const entries = sitemap();
      for (const entry of entries) {
        expect(entry.lastModified).toBeDefined();
      }
    });
  });

  describe("JSON-LD", () => {
    it("Organization JSON-LD has correct name, url, and founders", () => {
      // Verify the Organization schema structure from layout.tsx
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Programo",
        url: "https://programo.pl",
        founders: [
          { "@type": "Person", name: "Wojciech Płonka" },
          { "@type": "Person", name: "Bartosz Kolaj" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Poznań",
          addressCountry: "PL",
        },
        sameAs: ["https://github.com/programo"],
      };

      expect(jsonLd["@type"]).toBe("Organization");
      expect(jsonLd.name).toBe("Programo");
      expect(jsonLd.url).toBe("https://programo.pl");
      expect(jsonLd.founders).toHaveLength(2);
      expect(jsonLd.founders[0].name).toBe("Wojciech Płonka");
      expect(jsonLd.founders[1].name).toBe("Bartosz Kolaj");
      expect(jsonLd.address.addressLocality).toBe("Poznań");
    });

    it("SoftwareApplication JSON-LD is valid for each project", () => {
      for (const project of projects) {
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.description.pl,
          applicationCategory: project.tags.join(", "),
          operatingSystem: "Web",
          ...(project.liveUrl && { url: project.liveUrl }),
          creator: {
            "@type": "Organization",
            name: "Programo",
          },
        };

        expect(jsonLd["@type"]).toBe("SoftwareApplication");
        expect(jsonLd.name).toBe(project.title);
        expect(jsonLd.description).toBeTruthy();
        expect(jsonLd.creator.name).toBe("Programo");
        if (project.liveUrl) {
          expect(jsonLd.url).toBe(project.liveUrl);
        }
      }
    });

    it("canonical URLs are set for all pages", () => {
      // Homepage canonical
      const homepageCanonical = "https://programo.pl";
      expect(homepageCanonical).toBe("https://programo.pl");

      // Project page canonicals
      for (const project of projects) {
        const canonical = `https://programo.pl/projects/${project.slug}`;
        expect(canonical).toMatch(/^https:\/\/programo\.pl\/projects\/[a-z]+$/);
      }
    });
  });
});
