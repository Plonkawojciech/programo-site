import type { Metadata } from "next";
import Link from "next/link";
import QuickContact from "@/components/quick-contact";
import ProjectsMarquee from "@/components/projects-marquee";
import TrustBar from "@/components/trust-bar";
import CaseStudies from "@/components/case-studies";
import CompactLeadForm from "@/components/compact-lead-form";
import CtaButton from "@/components/ui/cta-button";
import Reveal from "@/components/ui/reveal";

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
    a: "Koszt zależy od zakresu — liczby podstron, panelu treści (CMS), integracji i wymagań SEO. Nie pracujemy z cennikiem z półki: po krótkiej rozmowie przygotowujemy konkretną, indywidualną wycenę z widełkami. Bez ukrytych kosztów.",
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
  { n: "01", title: "Strony firmowe", desc: "Nowoczesna wizytówka firmy w Next.js — szybka, dostępna i zbudowana pod konwersję. Z CMS-em do samodzielnej edycji treści." },
  { n: "02", title: "Landing page / sprzedażowe", desc: "Skoncentrowane na jednym celu strony pod kampanie i ofertę — z formularzem, dowodami i jasnym CTA. Mierzone i optymalizowane." },
  { n: "03", title: "Sklepy internetowe", desc: "Potrzebujesz e-commerce? Robimy też sklepy (WooCommerce, Shopify, PrestaShop, headless) — zobacz osobną ofertę dla sklepów." },
  { n: "04", title: "Redesign i migracja", desc: "Odświeżamy i przyspieszamy istniejące strony, migrujemy bez utraty pozycji w Google (przekierowania 301, zachowana struktura URL)." },
  { n: "05", title: "Wydajność i SEO", desc: "Optymalizacja Core Web Vitals, struktura, dane strukturalne i techniczne SEO. Szybsza strona = wyższe pozycje i więcej zapytań." },
  { n: "06", title: "Utrzymanie i rozwój", desc: "Opieka po wdrożeniu, aktualizacje, nowe sekcje i ciągła optymalizacja. Stała współpraca, nie znikamy po starcie." },
];

const steps = [
  { n: "01", title: "Krótka rozmowa", desc: "Ustalamy cel strony, zakres, budżet i termin." },
  { n: "02", title: "Makieta i wycena", desc: "Dostajesz konkretny plan, etapy i widełki — zanim zaczniemy." },
  { n: "03", title: "Budowa i wdrożenie", desc: "Projektujemy, kodujemy w Next.js i wypuszczamy stronę produkcyjnie." },
];

const webCases = [
  {
    slug: "wsafefinanse",
    angle:
      "Strona firmowa doradcy finansowego w Next.js. Formularz wysyła zapytanie na e-mail i Telegram, więc właściciel reaguje na lead w kilka minut.",
  },
  {
    slug: "wks-poznan",
    angle:
      "Strona klubu sportowego: 7 podstron, profile trenerów, harmonogram i galeria. Szybka, mobile-first i łatwa w samodzielnej aktualizacji.",
  },
  {
    slug: "estalo",
    angle:
      "Nasz własny produkt — platforma SaaS CRM w Next.js z AI i integracjami. Dowód, że ogarniamy też złożone systemy webowe, nie tylko wizytówki.",
  },
];

const EYEBROW = "text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary";
const H2 = "font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl";
const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24";
const SECTION = "relative bg-surface py-20 md:py-28 lg:py-32";

export default function StronyInternetowePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="bg-surface text-on-surface">
        {/* HERO — static (best LCP), full-screen, left-aligned */}
        <section className="relative flex min-h-[88vh] flex-col justify-center pt-28 pb-16 md:pt-32">
          <div className={CONTAINER}>
            <nav aria-label="breadcrumb" className="mb-10 text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition-colors hover:text-on-surface">Programo</Link>
              <span className="mx-2">/</span>
              <span>Strony internetowe</span>
            </nav>

            <div className="max-w-5xl 2xl:max-w-6xl">
              <p className={EYEBROW}>Tworzenie stron internetowych · Poznań</p>
              <h1 className="mt-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface md:text-7xl 2xl:text-[clamp(4.5rem,5vw,6rem)]">
                Strony internetowe, które pracują na Twój biznes
              </h1>
              <p className="mt-8 max-w-3xl text-xl font-light leading-relaxed text-on-surface/70 md:mt-10 md:text-2xl">
                Projektujemy i budujemy nowoczesne strony firmowe, landing page
                i serwisy w Next.js — szybkie (Core Web Vitals), pod SEO i pod
                konwersję. Pracujesz bezpośrednio z założycielami, bez pośredników.
              </p>

              <div className="mt-12 flex flex-wrap gap-4">
                <CtaButton href="#szybki-kontakt">Wyceń moją stronę</CtaButton>
                <CtaButton href="tel:+48509123434" variant="secondary">Zadzwoń: 509 123 434</CtaButton>
              </div>

              {/* Trust strip — static, above the fold, no off-ramp links */}
              <div className="mt-14 flex flex-col gap-5 border-t border-outline-variant/30 pt-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">
                  Zaufali nam
                </span>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-headline text-xl font-bold tracking-tight text-on-surface/45 md:text-2xl">
                  <span>WSafe Finanse</span>
                  <span aria-hidden="true" className="text-on-surface-variant/40">·</span>
                  <span>WKS Poznań</span>
                  <span aria-hidden="true" className="text-on-surface-variant/40">·</span>
                  <span>Estalo</span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Bezpośredni kontakt z założycielami · Odpowiadamy w 24 h · Poznań i cała Polska
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM → OUTCOME */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="max-w-4xl">
              <p className={EYEBROW}>Dlaczego to ważne</p>
              <p className="mt-6 font-headline text-2xl font-light leading-snug tracking-tight text-on-surface md:text-4xl">
                Wolna, szablonowa strona to zapytania, które nigdy nie przyszły.{" "}
                <span className="text-primary">Szybka, skrojona pod jeden cel pracuje na Ciebie — w Google i w głowie klienta.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* USŁUGI */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-14 max-w-3xl md:mb-20">
              <p className={EYEBROW}>Co robimy ze stronami</p>
              <h2 className={`mt-5 ${H2}`}>Od wizytówki po serwis z CMS-em</h2>
            </Reveal>
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.n} delay={(i % 3) * 0.1} className="flex flex-col gap-4 border-t border-outline-variant/30 pt-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">{s.n}</span>
                  <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{s.title}</h3>
                  <p className="text-base font-light leading-relaxed text-on-surface/70">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CASE STUDIES */}
        <CaseStudies
          eyebrow="Wybrane realizacje"
          heading="Strony i produkty, które zbudowaliśmy"
          intro="Pracujesz bezpośrednio z założycielami — bez pośredników. Kilka realnych wdrożeń: od strony klubu sportowego, przez stronę firmową z lead-formularzem, po własną platformę SaaS."
          items={webCases}
        />

        {/* SZYBKI KONTAKT — primary conversion gate (hero CTA target) */}
        <CompactLeadForm
          formId="strony-compact"
          anchorId="szybki-kontakt"
          projectType="Strona / landing"
          heading="Zostaw numer — oddzwonimy z wyceną"
        />

        {/* DLACZEGO MY */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-low p-8 md:p-14">
              <p className={EYEBROW}>Dlaczego Programo</p>
              <h2 className={`mt-5 ${H2}`}>Nowoczesny stack, butikowe podejście</h2>
              <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-on-surface/70">
                Jesteśmy dwuosobowym studiem z Poznania — pracujesz bezpośrednio z
                założycielami, bez warstw pośredników. Budujemy w Next.js / React /
                TypeScript, z naciskiem na szybkość, dostępność i realny efekt
                biznesowy. Mamy własne produkty (Estalo, Rejestr Pro) — wiemy, jak
                robić rzeczy, które trzeba potem utrzymać i rozwijać.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["Next.js / React", "Core Web Vitals", "SEO techniczne", "CMS do edycji treści", "Wsparcie po wdrożeniu"].map((chip) => (
                  <span key={chip} className="rounded-full border border-outline-variant/60 px-4 py-1.5 text-sm text-on-surface-variant">{chip}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROCES */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-14 max-w-3xl md:mb-20">
              <p className={EYEBROW}>Jak pracujemy</p>
              <h2 className={`mt-5 ${H2}`}>Trzy kroki do gotowej strony</h2>
            </Reveal>
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.12} className="flex flex-col gap-4 border-t border-outline-variant/30 pt-8">
                  <span className="font-headline text-4xl font-bold text-primary/40">{s.n}</span>
                  <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface">{s.title}</h3>
                  <p className="text-base font-light leading-relaxed text-on-surface/70">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-14 max-w-3xl md:mb-20">
              <p className={EYEBROW}>Najczęstsze pytania</p>
              <h2 className={`mt-5 ${H2}`}>Zanim napiszesz</h2>
            </Reveal>
            <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={(i % 2) * 0.1} className="border-t border-outline-variant/30 pt-6">
                  <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">{f.q}</h3>
                  <p className="mt-3 font-light leading-relaxed text-on-surface/70">{f.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINALNE */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-16">
              <h2 className={H2}>Zróbmy stronę, która sprzedaje</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-on-surface/70">
                Opisz projekt w 2 minuty — wrócimy z planem i wyceną. Poznań,
                Wielkopolska i cała Polska. Odpowiadamy w ciągu 24 godzin.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CtaButton href="#kontakt-main">Wyceń moją stronę</CtaButton>
                <CtaButton href="tel:+48509123434" variant="secondary">Zadzwoń: 509 123 434</CtaButton>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Dowód społeczny + pełny formularz */}
        <TrustBar />
        <ProjectsMarquee />
        <div className={CONTAINER}>
          <Reveal>
            <h2 className={H2}>Napisz — wrócimy z wyceną w 24h</h2>
          </Reveal>
        </div>
        <QuickContact />
      </div>
    </>
  );
}
