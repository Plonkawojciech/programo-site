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
    title: "Aplikacje mobilne do sklepów",
    desc: "Natywne aplikacje iOS + Android dla Twojego sklepu — katalog, koszyk i zamówienia z telefonu, spięte z backendem sklepu.",
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
            <span>Sklepy internetowe</span>
          </nav>

          {/* Hero */}
          <header className="mb-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-primary">
                E-commerce · Poznań · cała Polska
              </p>
              <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
                Sklepy internetowe, które sprzedają
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
                Tworzymy, migrujemy i rozwijamy sklepy: WooCommerce, Shopify,
                PrestaShop i headless w Next.js. Z integracjami z Allegro,
                BaseLinker, płatnościami i kurierami — i z naciskiem na szybkość
                oraz konwersję.
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
                Realizacje: Jedmar · Estalo · WKS Poznań · WSafe Finanse — z
                bezpośrednim kontaktem z założycielami.
              </p>
            </div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low">
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
                  className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 transition hover:border-outline"
                >
                  <h3 className="mb-3 text-xl font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Realizacja Jedmar */}
          <section className="mb-16 rounded-3xl border border-outline-variant/40 bg-surface-container-low p-8 md:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Realizacja
            </p>
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Jedmar — aplikacja mobilna do sklepu narzędziowego
            </h2>
            <p className="mb-6 max-w-3xl leading-relaxed text-on-surface-variant">
              Natywna aplikacja mobilna na iOS i Android dla Jedmar
              Centrum Narzędziowe — zakupy z telefonu: katalog 1460 produktów
              (190 kategorii, 32 marki), koszyk, konto klienta i zamówienia,
              spięte z backendem sklepu (PrestaShop). Zlecenie: aplikacja do
              istniejącego sklepu — nie cały sklep.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Natywne iOS + Android",
                "PrestaShop API",
                "1460 produktów",
                "Next.js",
                "Mobile-first",
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
                href="/projects/jedmar"
                className="text-sm font-medium text-primary underline underline-offset-4 transition hover:text-on-surface"
              >
                Zobacz case Jedmar →
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
              Zbudujmy lub przyspieszmy Twój sklep
            </h2>
            <p className="mb-6 max-w-2xl text-on-surface-variant">
              Opisz projekt w 2 minuty — wrócimy z planem, integracjami i wyceną.
              Poznań, Wielkopolska i cała Polska. Odpowiadamy w ciągu 24 godzin.
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
