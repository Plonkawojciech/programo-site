import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title:
    "Sklepy internetowe na zamówienie — WooCommerce, Shopify, PrestaShop | Programo",
  description:
    "Tworzymy i rozwijamy sklepy internetowe: WooCommerce, Shopify, PrestaShop i headless (Next.js). Migracje bez utraty SEO, integracje Allegro/BaseLinker/płatności, aplikacje do sklepów. Software house z Poznania.",
  alternates: { canonical: "https://programo.pl/sklepy-internetowe" },
  openGraph: {
    title: "Sklepy internetowe na zamówienie — Programo",
    description:
      "Sklepy WooCommerce/Shopify/PrestaShop i headless, migracje, integracje Allegro/BaseLinker, aplikacje do sklepów.",
    url: "https://programo.pl/sklepy-internetowe",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
  keywords: [
    "sklep internetowy na zamówienie",
    "tworzenie sklepu internetowego",
    "wdrożenie woocommerce",
    "sklep shopify",
    "sklep prestashop",
    "migracja sklepu internetowego",
    "integracja allegro baselinker",
    "headless e-commerce",
    "aplikacja do sklepu internetowego",
    "sklep b2b na zamówienie",
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
      name: "Sklepy internetowe",
      item: "https://programo.pl/sklepy-internetowe",
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Tworzenie sklepów internetowych",
  name: "Sklepy internetowe na zamówienie — Programo",
  provider: { "@id": "https://programo.pl/#organization" },
  areaServed: [
    { "@type": "Country", name: "Polska" },
    { "@type": "City", name: "Poznań" },
  ],
  description:
    "Tworzenie, migracja i rozwój sklepów internetowych: WooCommerce, Shopify, PrestaShop, headless (Next.js), integracje Allegro/BaseLinker/płatności.",
  url: "https://programo.pl/sklepy-internetowe",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "PLN",
    lowPrice: "6000",
    highPrice: "60000",
    offerCount: "6",
  },
};

const faqs = [
  {
    q: "Ile kosztuje sklep internetowy?",
    a: "Prosty sklep zaczyna się od ok. 6 000 zł, rozbudowany e-commerce z integracjami (Allegro, BaseLinker, płatności, ERP) od ok. 15 000 zł. Dokładną wycenę przygotowujemy po krótkiej rozmowie o zakresie.",
  },
  {
    q: "Ile trwa wdrożenie sklepu?",
    a: "Prosty sklep zwykle 2–4 tygodnie. Rozbudowany sklep z integracjami i migracją danych — 4–8 tygodni, zależnie od zakresu.",
  },
  {
    q: "Czy migracja sklepu nie zaszkodzi pozycjom w Google?",
    a: "Nie. Migrujemy z zachowaniem struktury adresów URL i przekierowaniami 301, pilnując pozycji w Google i danych produktów. Robiliśmy to m.in. przy Jedmar (PrestaShop + Next.js).",
  },
  {
    q: "Z czym integrujecie sklep?",
    a: "Allegro, BaseLinker, bramki płatności (Przelewy24, Stripe), firmy kurierskie, systemy ERP/magazynowe oraz fakturowanie (w tym KSeF).",
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
    title: "Sklep na zamówienie",
    desc: "WooCommerce, Shopify, PrestaShop lub headless (Next.js). Od prostego sklepu po rozbudowany B2B z panelem klienta i rolami.",
  },
  {
    title: "Migracje sklepów",
    desc: "Przenosimy sklep między platformami (PrestaShop ↔ WooCommerce ↔ Shopify) bez utraty pozycji w Google i danych produktów.",
  },
  {
    title: "Integracje",
    desc: "Allegro, BaseLinker, płatności (Przelewy24, Stripe), kurierzy, systemy ERP i fakturowanie (KSeF). Sklep, który dogaduje się z resztą firmy.",
  },
  {
    title: "Aplikacje i PWA do sklepów",
    desc: "Szybkie aplikacje mobilne / PWA dla Twojego sklepu — instalacja z przeglądarki, tryb offline, powiadomienia push.",
  },
  {
    title: "Headless i wydajność",
    desc: "Frontend w Next.js na istniejącym backendzie (np. PrestaShop) — szybsze ładowanie, lepsze Core Web Vitals, wyższe konwersje.",
  },
  {
    title: "Utrzymanie i rozwój",
    desc: "Opieka po wdrożeniu, aktualizacje, nowe funkcje i optymalizacja konwersji. Stała współpraca, nie znikamy po starcie.",
  },
];

const steps = [
  ["01", "Krótka rozmowa", "Ustalamy zakres sklepu, integracje, budżet i termin."],
  ["02", "Makieta i wycena", "Dostajesz konkretny plan, etapy i widełki — zanim zaczniemy."],
  ["03", "Budowa i wdrożenie", "Projektujemy, kodujemy, integrujemy i wypuszczamy sklep produkcyjnie."],
];

export default function SklepyInternetowePage() {
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

      <main className="min-h-screen bg-[var(--theme-bg-1,#051F20)] text-[var(--theme-text-1,#DAF1DE)]">
        <article className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <nav
            aria-label="breadcrumb"
            className="mb-8 text-xs uppercase tracking-widest opacity-60"
          >
            <Link href="/" className="hover:underline">
              Programo
            </Link>
            <span className="mx-2">/</span>
            <span>Sklepy internetowe</span>
          </nav>

          {/* Hero */}
          <header className="mb-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] opacity-60">
                E-commerce · Poznań · cała Polska
              </p>
              <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
                Sklepy internetowe, które sprzedają
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed opacity-85 md:text-xl">
                Tworzymy, migrujemy i rozwijamy sklepy: WooCommerce, Shopify,
                PrestaShop i headless w Next.js. Z integracjami z Allegro,
                BaseLinker, płatnościami i kurierami — i z naciskiem na szybkość
                oraz konwersję.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="rounded-full bg-[var(--theme-accent,#235347)] px-6 py-3 text-sm font-semibold text-[var(--theme-bg-1,#051F20)] transition hover:opacity-90"
                >
                  Bezpłatna wycena
                </Link>
                <Link
                  href="/projects/jedmar"
                  className="rounded-full border border-current/30 px-6 py-3 text-sm font-medium opacity-85 transition hover:opacity-100"
                >
                  Zobacz realizację: Jedmar
                </Link>
              </div>
            </div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-current/15 bg-[rgba(var(--theme-text-1-rgb,218,241,222),0.04)]">
              <Image
                src="/screenshots/jedmar-hero.webp"
                alt="Sklep internetowy Jedmar zbudowany przez Programo"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </header>

          {/* Usługi */}
          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Co robimy w e-commerce
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-current/15 p-6 transition hover:border-current/30"
                >
                  <h3 className="mb-3 text-xl font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed opacity-75">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Realizacja Jedmar */}
          <section className="mb-16 rounded-3xl border border-current/15 p-8 md:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] opacity-60">
              Realizacja
            </p>
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Jedmar — sklep dla centrum narzędziowego
            </h2>
            <p className="mb-6 max-w-3xl leading-relaxed opacity-80">
              Nowoczesny frontend e-commerce w Next.js 15 na istniejącym
              PrestaShop. 1460 produktów, 190 kategorii, 32 marki, koszyk i
              checkout przez API, konto klienta, analityka (GA4, GTM, edrone) i
              PWA mobile-first.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js 15",
                "PrestaShop API",
                "1460 produktów",
                "PWA mobile-first",
                "GA4 + GTM + edrone",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-current/20 px-4 py-1.5 text-sm opacity-80"
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>

          {/* Proces */}
          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Jak pracujemy
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map(([num, title, desc]) => (
                <div key={num} className="rounded-2xl border border-current/15 p-6">
                  <div className="mb-3 font-headline text-3xl font-bold opacity-30">
                    {num}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed opacity-75">{desc}</p>
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
                  <p className="leading-relaxed opacity-75">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-3xl border border-current/15 p-8 md:p-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Zbudujmy lub przyspieszmy Twój sklep
            </h2>
            <p className="mb-6 max-w-2xl opacity-80">
              Opisz projekt w 2 minuty — wrócimy z planem, integracjami i wyceną.
              Poznań, Wielkopolska i cała Polska. Odpowiadamy w ciągu 24 godzin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-[var(--theme-accent,#235347)] px-6 py-3 text-sm font-semibold text-[var(--theme-bg-1,#051F20)] transition hover:opacity-90"
              >
                Bezpłatna wycena
              </Link>
              <Link
                href="/ile-kosztuje-aplikacji"
                className="rounded-full border border-current/30 px-6 py-3 text-sm font-medium opacity-85 transition hover:opacity-100"
              >
                Ile to kosztuje?
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
