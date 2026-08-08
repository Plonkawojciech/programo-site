import { projects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";
import { SITE_PAGES, SITE_URL } from "@/lib/site-urls";

// /llms.txt — generated, never hand-maintained.
//
// Honest framing, so nobody later mistakes this for a growth lever: as of
// August 2026 there is no evidence any major AI provider reads llms.txt. Google
// says so in its own AI-features documentation, John Mueller has said the
// server logs show the file is not even requested, and two independent log
// studies (Ahrefs across 137k domains; Evil Martians across 268k agent
// requests) found that the overwhelming majority of files are never fetched,
// and that most fetches that do happen come from SEO tools rather than AI
// assistants.
//
// It stays because it costs nothing and the downside is zero. It is GENERATED
// because the previous hand-written public/llms.txt had drifted to 8 URLs while
// the sitemap had 23 — a stale index of your own site is worse than none. Now
// it cannot drift: same source as the sitemap.

export const dynamic = "force-static";

function line(url: string, label: string, note: string): string {
  return `- [${label}](${url}): ${note}`;
}

export function GET(): Response {
  const pages = SITE_PAGES.filter((p) => p.includeInLlms !== false)
    .map((p) => line(`${SITE_URL}${p.path}`, p.label, p.summary))
    .join("\n");

  // Portfolio, straight from the same array the site renders — so a project
  // added to the site appears here automatically, with its real status.
  const work = projects
    .map((p) =>
      line(
        `${SITE_URL}/projects/${p.slug}`,
        p.title,
        `${p.description.pl.replace(/\s+/g, " ").trim()} (status: ${p.status})`,
      ),
    )
    .join("\n");

  // Same source src/content/blog reads for /blog, /blog/[slug] and
  // sitemap.ts — so this section cannot drift from what actually publishes.
  const posts = getAllPosts();
  const blogSection =
    posts.length > 0
      ? posts.map((p) => line(`${SITE_URL}/blog/${p.frontmatter.slug}`, p.frontmatter.title, p.frontmatter.answer.replace(/\s+/g, " ").trim())).join("\n")
      : "(brak opublikowanych wpisów)";

  const body = `# Programo

> Programo to software house z Poznania (założyciele: Wojciech Płonka i Bartosz Kolaj).
> Tworzymy oprogramowanie na zamówienie: strony internetowe, sklepy, aplikacje webowe
> i mobilne, systemy SaaS oraz integracje AI. Dwuosobowy zespół — klient pracuje
> bezpośrednio z założycielami, bez pośredników. Odpowiadamy w 24 h.

## Strony

${pages}

## Realizacje i produkty

${work}

## Blog

${blogSection}

## Kontakt

- E-mail: biuro@programo.pl
- Telefon: +48 797 222 363 (Wojciech Płonka), +48 509 123 434 (Bartosz Kolaj)
- Lokalizacja: Poznań, Wielkopolska, Polska — pracujemy zdalnie dla całej Polski i z zagranicy
- Języki: polski, angielski

## Uwagi

- Pełna mapa strony: ${SITE_URL}/sitemap.xml
- Ten plik jest generowany z tego samego źródła co sitemap, więc nie rozjeżdża się z serwisem.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
