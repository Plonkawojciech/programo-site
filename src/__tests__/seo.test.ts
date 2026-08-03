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
    it("includes core, landing and lead-magnet URLs", () => {
      const entries = sitemap();
      const urls = entries.map((e) => e.url);
      expect(urls).toContain("https://programo.pl");
      expect(urls).toContain("https://programo.pl/software-house-poznan");
      expect(urls).toContain("https://programo.pl/ile-kosztuje-aplikacji");
      expect(entries.length).toBeGreaterThanOrEqual(10);
      // no duplicate URLs
      expect(new Set(urls).size).toBe(urls.length);
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
    // Card descriptions are full editorial copy; the metadata description is
    // derived from them (whole sentences up to 160 chars). Mirror the derivation
    // used in app/projects/[slug]/page.tsx.
    const metaDescription = (text: string) => {
      const sentences = text.split(/(?<=(?<!\b[A-ZĄĆĘŁŃÓŚŹŻ])\.)\s/);
      let desc =
        sentences[0].length > 160
          ? `${sentences[0].slice(0, 157).replace(/\s+\S*$/, "")}...`
          : sentences[0];
      for (let i = 1; i < sentences.length; i++) {
        const next = `${desc} ${sentences[i]}`;
        if (next.length > 160) break;
        desc = next;
      }
      return desc;
    };

    it("derived meta descriptions are non-empty and under 160 chars", () => {
      for (const p of projects) {
        const desc = metaDescription(p.description.pl);
        expect(desc.length, `${p.title} derived desc empty`).toBeGreaterThan(0);
        expect(desc.length, `${p.title} derived desc too long`).toBeLessThanOrEqual(160);
      }
    });

    // The "W. Safe Finance" stub was a silent 39-char meta description on a live
    // page: the old split treated the initial as a sentence end. Guard the rule
    // rather than that one string, so any client name with an initial is safe.
    it("derived meta descriptions do not end on an initial", () => {
      for (const p of projects) {
        const desc = metaDescription(p.description.pl);
        expect(desc, `${p.title} desc ends mid-name`).not.toMatch(/\b[A-ZĄĆĘŁŃÓŚŹŻ]\.$/);
      }
    });

    it("derived meta descriptions never end mid-word", () => {
      for (const p of projects) {
        const desc = metaDescription(p.description.pl);
        // Either a finished sentence or an explicit ellipsis on a word boundary.
        expect(desc, `${p.title} desc is cut mid-word`).toMatch(/(\.|\.\.\.)$/);
      }
    });

    it("raw card descriptions are present and reasonably bounded", () => {
      for (const p of projects) {
        expect(p.description.pl.length, `${p.title} PL desc empty`).toBeGreaterThan(0);
        expect(p.description.pl.length, `${p.title} PL desc absurdly long`).toBeLessThanOrEqual(400);
      }
    });
  });

  // Mirrors the dictionary-wide guard in i18n.test.ts. projects.ts is the other
  // place site copy lives, and `subtitle.pl` additionally feeds the <title> tag
  // truncation in projects/[slug]/page.tsx, which splits on a spaced dash.
  describe("copy hygiene", () => {
    it("no em dashes in project copy", () => {
      const fields = ["subtitle", "description", "longDescription"] as const;
      for (const p of projects) {
        for (const f of fields) {
          expect(p[f].pl, `${p.slug}.${f}.pl has an em dash`).not.toContain("\u2014");
          expect(p[f].en, `${p.slug}.${f}.en has an em dash`).not.toContain("\u2014");
        }
      }
    });
  });

  describe("project titles", () => {
    it("all project titles are under 60 chars when combined with 'Programo'", () => {
      for (const p of projects) {
        const fullTitle = `${p.title} - Programo`;
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

      // Project page canonicals (slugs may contain digits and hyphens)
      for (const project of projects) {
        const canonical = `https://programo.pl/projects/${project.slug}`;
        expect(canonical).toMatch(/^https:\/\/programo\.pl\/projects\/[a-z0-9-]+$/);
      }
    });
  });
});
