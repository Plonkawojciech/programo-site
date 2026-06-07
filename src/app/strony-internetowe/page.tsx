import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Tworzenie stron internetowych dla firm — Next.js, React | Programo",
  description:
    "Projektujemy i budujemy nowoczesne strony internetowe dla firm: strony firmowe, landing page, sklepy. Next.js/React, nacisk na szybkość (Core Web Vitals), SEO i konwersję. Software house z Poznania.",
  alternates: { canonical: "https://programo.pl/strony-internetowe" },
  openGraph: {
    title: "Tworzenie stron internetowych dla firm — Programo",
    description:
      "Nowoczesne strony firmowe, landing page i sklepy w Next.js. Szybkość, SEO, konwersja. Poznań i cała Polska.",
    url: "https://programo.pl/strony-internetowe",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
  keywords: [
    "tworzenie stron internetowych",
    "strona internetowa dla firmy",
    "wykonanie strony internetowej",
    "projektowanie stron www",
    "strona internetowa na zamówienie",
    "nowoczesna strona firmowa",
    "strona w next.js",
    "agencja interaktywna Poznań",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Programo", item: "https://programo.pl" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Strony internetowe",
      item: "https://programo.pl/strony-internetowe",
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Tworzenie stron internetowych",
  name: "Tworzenie stron internetowych dla firm — Programo",
  provider: { "@id": "https://programo.pl/#organization" },
  areaServed: [
    { "@type": "Country", name: "Polska" },
    { "@type": "City", name: "Poznań" },
  ],
  description:
    "Projektowanie i wykonanie stron internetowych dla firm: strony firmowe, landing page, sklepy. Next.js/React, Core Web Vitals, SEO.",
  url: "https://programo.pl/strony-internetowe",
};

const faqs = [
  {
    q: "Ile kosztuje strona internetowa?",
    a: "Prosta strona firmowa zaczyna się od kilku tysięcy złotych, rozbudowana strona z CMS-em, integracjami i wielojęzycznością — od kilkunastu tysięcy. Dokładną wycenę przygotowujemy po krótkiej rozmowie o zakresie.",
  },
  {
    q: "Ile trwa wykonanie strony?",
    a: "Prosta strona firmowa zwykle 2–3 tygodnie. Rozbudowany serwis z CMS-em, integracjami i migracją treści — 4–6 tygodni, zależnie od zakresu.",
  },
  {
    q: "Czy zadbacie o szybkość i SEO?",
    a: "Tak. Budujemy w Next.js z naciskiem na Core Web Vitals, poprawną strukturę i dane strukturalne. Szybsza, dobrze zbudowana strona to wyższe pozycje w Google i lepsza konwersja.",
  },
  {
    q: "Czy będę mógł sam edytować treści?",
    a: "Tak — wpinamy CMS dopasowany do potrzeb (lub panel headless), żebyś mógł samodzielnie aktualizować treści. Po wdrożeniu zostajemy na wsparciu i rozwoju.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const services = [
  {
    title: "Strony firmowe",
    desc: "Nowoczesna wizytówka firmy w Next.js — szybka, dostępna i zbudowana pod konwersję. Z CMS-em do samodzielnej edycji treści.",
  },
  {
    title: "Landing page / strony sprzedażowe",
    desc: "Skoncentrowane na jednym celu strony pod kampanie i ofertę — z formularzem, dowodami i jasnym CTA. Mierzone i optymalizowane.",
  },
  {
    title: "Sklepy internetowe",
    desc: "Potrzebujesz e-commerce? Robimy też sklepy (WooCommerce, Shopify, PrestaShop, headless) — zobacz osobną ofertę dla sklepów.",
  },
  {
    title: "Redesign i migracja",
    desc: "Odświeżamy i przyspieszamy istniejące strony, migrujemy bez utraty pozycji w Google (przekierowania 301, zachowana struktura URL).",
  },
  {
    title: "Wydajność i SEO",
    desc: "Optymalizacja Core Web Vitals, struktura, dane strukturalne i techniczne SEO. Szybsza strona = wyższe pozycje i więcej zapytań.",
  },
  {
    title: "Utrzymanie i rozwój",
    desc: "Opieka po wdrożeniu, aktualizacje, nowe sekcje i ciągła optymalizacja. Stała współpraca, nie znikamy po starcie.",
  },
];

const steps = [
  ["01", "Krótka rozmowa", "Ustalamy cel strony, zakres, budżet i termin."],
  ["02", "Makieta i wycena", "Dostajesz konkretny plan, etapy i widełki — zanim zaczniemy."],
  ["03", "Budowa i wdrożenie", "Projektujemy, kodujemy w Next.js i wypuszczamy stronę produkcyjnie."],
];

export default function StronyInternetowePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-surface text-on-surface">
        <article className="mx-auto max-w-5xl px-6 pt-28 pb-20 md:px-10 md:pt-32 md:pb-28">
          <nav
            aria-label="breadcrumb"
            className="mb-8 text-xs uppercase tracking-widest text-on-surface-variant"
          >
            <Link href="/" className="hover:text-on-surface transition-colors">
              Programo
            </Link>
            <span className="mx-2">/</span>
            <span>Strony internetowe</span>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-primary">
              Strony WWW · Poznań · cała Polska
            </p>
            <h1 className="mb-6 max-w-3xl font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              Strony internetowe, które pracują na Twój biznes
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Projektujemy i budujemy nowoczesne strony firmowe, landing page
              i serwisy w Next.js — szybkie (Core Web Vitals), pod SEO i pod
              konwersję. Bez szablonów z półki: strona skrojona pod Twój cel.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-container"
              >
                Bezpłatna wycena
              </Link>
              <a
                href="tel:+48509123434"
                className="rounded-full border border-outline px-6 py-3 text-sm font-medium text-on-surface-variant transition hover:text-on-surface"
              >
                Zadzwoń: 509 123 434
              </a>
            </div>
            <p className="mt-5 text-sm text-on-surface-variant">
              Realizacje: Estalo · WKS Poznań · WSafe Finanse · Jedmar — z
              bezpośrednim kontaktem z założycielami.
            </p>
          </header>

          {/* Usługi */}
          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Co robimy ze stronami
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 transition hover:border-outline"
                >
                  <h3 className="mb-3 text-xl font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dlaczego my */}
          <section className="mb-16 rounded-3xl border border-outline-variant/40 bg-surface-container-low p-8 md:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Dlaczego Programo
            </p>
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Nowoczesny stack, butikowe podejście
            </h2>
            <p className="mb-6 max-w-3xl leading-relaxed text-on-surface-variant">
              Jesteśmy dwuosobowym studiem z Poznania — pracujesz bezpośrednio z
              założycielami, bez warstw pośredników. Budujemy w Next.js / React /
              TypeScript, z naciskiem na szybkość, dostępność i realny efekt
              biznesowy. Mamy własne produkty (Estalo, Rejestr Pro) — wiemy, jak
              robić rzeczy, które trzeba potem utrzymać i rozwijać.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js / React",
                "Core Web Vitals",
                "SEO techniczne",
                "CMS do edycji treści",
                "Wsparcie po wdrożeniu",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-outline-variant/60 px-4 py-1.5 text-sm text-on-surface-variant"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/projekty"
                className="text-sm font-medium text-primary underline underline-offset-4 transition hover:text-on-surface"
              >
                Zobacz nasze realizacje →
              </Link>
            </div>
          </section>

          {/* Proces */}
          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Jak pracujemy
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map(([num, title, desc]) => (
                <div key={num} className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6">
                  <div className="mb-3 font-headline text-3xl font-bold text-primary/40">
                    {num}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Najczęstsze pytania
            </h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="mb-2 text-lg font-semibold">{f.q}</h3>
                  <p className="leading-relaxed text-on-surface-variant">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-3xl border border-outline-variant/40 bg-surface-container-low p-8 md:p-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Zróbmy stronę, która sprzedaje
            </h2>
            <p className="mb-6 max-w-2xl text-on-surface-variant">
              Opisz projekt w 2 minuty — wrócimy z planem i wyceną. Poznań,
              Wielkopolska i cała Polska. Odpowiadamy w ciągu 24 godzin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-container"
              >
                Bezpłatna wycena
              </Link>
              <a
                href="tel:+48509123434"
                className="rounded-full border border-outline px-6 py-3 text-sm font-medium text-on-surface-variant transition hover:text-on-surface"
              >
                Zadzwoń: 509 123 434
              </a>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
