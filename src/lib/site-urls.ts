// The canonical list of public, indexable pages.
//
// One list, three consumers: /llms.txt, the IndexNow submitter, and (once it is
// reconciled) the sitemap. Keeping them apart is how the previous llms.txt
// ended up advertising 8 pages while the sitemap had 23.
//
// Project/case-study URLs are NOT here — they are derived from src/lib/projects.ts
// so they can never drift from the portfolio the site actually renders.

export const SITE_URL = "https://programo.pl";

export type SitePage = {
  /** Path with a leading slash, no trailing slash. "" for the homepage. */
  path: string;
  /** Human label used in llms.txt. */
  label: string;
  /** One line describing what the page answers. */
  summary: string;
  /** Set false to keep a page out of llms.txt (still in sitemap). */
  includeInLlms?: boolean;
};

export const SITE_PAGES: SitePage[] = [
  { path: "", label: "Strona główna", summary: "kim jesteśmy, oferta, realizacje, kontakt" },
  {
    path: "/oferta",
    label: "Oferta",
    summary: "aplikacje webowe, systemy SaaS, aplikacje mobilne, integracje AI",
  },
  {
    // Described by what the page actually contains. It used to promise
    // "orientacyjne widełki cenowe" while carrying zero figures — an assistant
    // that fetched it after that summary would find nothing to quote, and a
    // promise unmatched by content is the "no invented facts" rule running
    // backwards.
    path: "/cennik",
    label: "Wycena",
    summary: "jak wygląda proces wyceny i co wpływa na koszt projektu",
  },
  {
    path: "/software-house-poznan",
    label: "Software house Poznań",
    summary: "lokalna strona usługowa — współpraca z firmami z Poznania i Wielkopolski",
  },
  {
    path: "/strony-internetowe",
    label: "Strony internetowe",
    summary: "strony firmowe i landing page'e w Next.js, z trackingiem i SEO",
  },
  {
    path: "/sklepy-internetowe",
    label: "Sklepy internetowe",
    summary:
      "e-commerce — WooCommerce, Shopify, PrestaShop i headless, migracje, integracje Allegro/BaseLinker",
  },
  {
    path: "/strony-tracking-reklamy",
    label: "Strony, tracking i reklamy",
    summary: "analityka, piksele, kampanie Google i Meta spięte z konwersjami",
  },
  {
    path: "/ile-kosztuje-aplikacji",
    label: "Ile kosztuje aplikacja",
    summary: "co podbija i co obniża koszt aplikacji oraz od czego zależy termin",
  },
  { path: "/projekty", label: "Realizacje", summary: "portfolio — produkty własne i prace dla klientów" },
  {
    path: "/blog",
    label: "Blog",
    summary: "poradniki i porównania: koszty projektów, wybór technologii, dane własne",
  },
  { path: "/o-nas", label: "O nas", summary: "kto stoi za Programo i jak pracujemy" },
  { path: "/stack", label: "Stack technologiczny", summary: "technologie, których używamy i dlaczego" },
  { path: "/kontakt", label: "Kontakt", summary: "formularz, e-mail, telefon" },
  {
    path: "/wspolpraca",
    label: "Program poleceń",
    summary: "zasady polecania Programo - 25% prowizji od wartości netto opłaconej faktury",
  },
  {
    path: "/polityka-prywatnosci",
    label: "Polityka prywatności",
    summary: "RODO, cookies, administrator danych",
    includeInLlms: false,
  },
];

/** Absolute URLs of every public page, including project pages. */
export function allPublicUrls(projectSlugs: string[]): string[] {
  return [
    ...SITE_PAGES.map((p) => `${SITE_URL}${p.path}`),
    ...projectSlugs.map((slug) => `${SITE_URL}/projects/${slug}`),
  ];
}
