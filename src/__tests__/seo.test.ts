import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { projects } from "@/lib/projects";
import {
  buildBreadcrumbs,
  buildOrganization,
  buildPeople,
  buildSoftwareApplication,
  buildWebPage,
  ORGANIZATION_ID,
  ref,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
  WEBSITE_ID,
} from "@/lib/schema";

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

  // These import the real builders from src/lib/schema instead of re-declaring
  // literal copies of the JSON-LD — a literal copy would keep "passing" even
  // if layout.tsx/the page files drifted away from what it asserts.
  describe("JSON-LD", () => {
    it("Organization node has the right @id, name and founder refs, and no unverified sameAs", () => {
      const org = buildOrganization();
      expect(org["@type"]).toBe("ProfessionalService");
      expect(org["@id"]).toBe(ORGANIZATION_ID);
      expect(org.name).toBe("Programo");
      expect(org.url).toBe("https://programo.pl");
      // github.com/programo belongs to an unrelated GitHub account, not
      // Programo — must never come back into sameAs.
      expect(org.sameAs).not.toContain("https://github.com/programo");
      expect(org.address).toMatchObject({ addressLocality: "Poznań", addressCountry: "PL" });
    });

    it("Person nodes have stable @ids that Organization.founder references", () => {
      const org = buildOrganization();
      const [wojciech, bartosz] = buildPeople();
      expect(org.founder).toEqual([{ "@id": wojciech["@id"] }, { "@id": bartosz["@id"] }]);
      expect(wojciech.name).toBe("Wojciech Płonka");
      expect(bartosz.name).toBe("Bartosz Kołaj");
    });

    it("renderGraph wraps nodes in one @context + @graph", () => {
      const parsed = JSON.parse(renderGraph([buildOrganization()]));
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@graph"]).toHaveLength(1);
      expect(parsed["@graph"][0]["@type"]).toBe("ProfessionalService");
    });

    it("ref() reads back a node's own @id and rejects nodes without one", () => {
      const org = buildOrganization();
      expect(ref(org)).toEqual({ "@id": ORGANIZATION_ID });
      expect(() => ref({ "@type": "Thing" })).toThrow();
    });

    it("buildWebPage derives @id from the path and points isPartOf at the WebSite", () => {
      const page = buildWebPage({ path: "/oferta", name: "Oferta" });
      expect(page["@id"]).toBe("https://programo.pl/oferta#webpage");
      expect(page.url).toBe("https://programo.pl/oferta");
      expect(page.isPartOf).toEqual({ "@id": WEBSITE_ID });
    });

    it("buildBreadcrumbs numbers ListItems from 1 and resolves '/' to the bare site URL", () => {
      const bc = buildBreadcrumbs([
        { name: "Programo", path: "/" },
        { name: "Oferta", path: "/oferta" },
      ]);
      expect(bc.itemListElement).toEqual([
        { "@type": "ListItem", position: 1, name: "Programo", item: "https://programo.pl" },
        { "@type": "ListItem", position: 2, name: "Oferta", item: "https://programo.pl/oferta" },
      ]);
    });

    it("SoftwareApplication is valid for each project and creator references the Organization by @id", () => {
      for (const project of projects) {
        const app = buildSoftwareApplication({
          path: `/projects/${project.slug}`,
          name: project.title,
          description: project.description.pl,
          applicationCategory: project.tags.join(", "),
          liveUrl: project.liveUrl,
        });

        expect(app["@type"]).toBe("SoftwareApplication");
        expect(app.name).toBe(project.title);
        expect(app.description).toBeTruthy();
        expect(app.creator).toEqual({ "@id": ORGANIZATION_ID });
        if (project.liveUrl) {
          expect(app.url).toBe(project.liveUrl);
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

  // Regression guard for the bug this task fixed: every sitemap entry used to
  // get `new Date()` (the build timestamp), so a page untouched for months got
  // today's date on every deploy. These dates must now be real and stable.
  describe("sitemap lastModified dates", () => {
    it("static routes come from the tracked route-date map, not the build clock", () => {
      const entries = sitemap();
      const home = entries.find((e) => e.url === "https://programo.pl");
      const cennik = entries.find((e) => e.url === "https://programo.pl/cennik");
      expect(home?.lastModified).toBe(STATIC_ROUTE_UPDATED_AT["/"]);
      expect(cennik?.lastModified).toBe(STATIC_ROUTE_UPDATED_AT["/cennik"]);
    });

    it("project routes come from each project's own updatedAt field", () => {
      const entries = sitemap();
      for (const p of projects) {
        const entry = entries.find((e) => e.url === `https://programo.pl/projects/${p.slug}`);
        if (p.updatedAt) {
          expect(entry?.lastModified).toBe(p.updatedAt);
        } else {
          expect(entry?.lastModified).toBeUndefined();
        }
      }
    });

    it("is stable across repeated calls in the same process (not derived from `new Date()`)", () => {
      const first = sitemap().map((e) => e.lastModified);
      const second = sitemap().map((e) => e.lastModified);
      expect(second).toEqual(first);
    });
  });
});
