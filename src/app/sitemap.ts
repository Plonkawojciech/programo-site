import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { STATIC_ROUTE_UPDATED_AT } from "@/lib/schema";

// `priority` and `changeFrequency` are both no-ops for Google (it ignores
// them and crawls by its own signals) — kept only because Next.js's sitemap
// type expects them and other engines still read priority as a weak hint.
// `lastModified` is the field that matters: it used to be `new Date()` on
// every entry, i.e. the build timestamp, so a case study untouched for months
// got today's date on every deploy. Google treats a sitemap's lastmod trust
// as binary — get caught lying once and it ignores lastmod site-wide — so
// these come from STATIC_ROUTE_UPDATED_AT / Project.updatedAt instead
// (real git history, see src/lib/schema/route-dates.ts for the method).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://programo.pl",
      lastModified: STATIC_ROUTE_UPDATED_AT["/"],
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://programo.pl/software-house-poznan",
      lastModified: STATIC_ROUTE_UPDATED_AT["/software-house-poznan"],
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: "https://programo.pl/sklepy-internetowe",
      lastModified: STATIC_ROUTE_UPDATED_AT["/sklepy-internetowe"],
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: "https://programo.pl/strony-internetowe",
      lastModified: STATIC_ROUTE_UPDATED_AT["/strony-internetowe"],
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: "https://programo.pl/strony-tracking-reklamy",
      lastModified: STATIC_ROUTE_UPDATED_AT["/strony-tracking-reklamy"],
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: "https://programo.pl/ile-kosztuje-aplikacji",
      lastModified: STATIC_ROUTE_UPDATED_AT["/ile-kosztuje-aplikacji"],
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://programo.pl/oferta",
      lastModified: STATIC_ROUTE_UPDATED_AT["/oferta"],
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://programo.pl/cennik",
      lastModified: STATIC_ROUTE_UPDATED_AT["/cennik"],
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://programo.pl/projekty",
      lastModified: STATIC_ROUTE_UPDATED_AT["/projekty"],
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://programo.pl/o-nas",
      lastModified: STATIC_ROUTE_UPDATED_AT["/o-nas"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://programo.pl/stack",
      lastModified: STATIC_ROUTE_UPDATED_AT["/stack"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://programo.pl/kontakt",
      lastModified: STATIC_ROUTE_UPDATED_AT["/kontakt"],
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://programo.pl/wspolpraca",
      lastModified: STATIC_ROUTE_UPDATED_AT["/wspolpraca"],
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://programo.pl/polityka-prywatnosci",
      lastModified: STATIC_ROUTE_UPDATED_AT["/polityka-prywatnosci"],
      changeFrequency: "monthly",
      priority: 0.3,
    },
    // All project / case-study pages, generated from the projects array
    // so the sitemap never drifts (incl. client work: Jedmar, WKS, Posnania…).
    ...projects.map((p) => ({
      url: `https://programo.pl/projects/${p.slug}`,
      ...(p.updatedAt && { lastModified: p.updatedAt }),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
