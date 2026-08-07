import type { Metadata } from "next";
import Link from "next/link";
import QuickContact from "@/components/quick-contact";
import ProjectsMarquee from "@/components/projects-marquee";
import TrustBar from "@/components/trust-bar";
import CaseStudies from "@/components/case-studies";
import CompactLeadForm from "@/components/compact-lead-form";
import CtaButton from "@/components/ui/cta-button";
import Reveal from "@/components/ui/reveal";
import {
  buildBreadcrumbs,
  buildFaqPage,
  buildService,
  buildWebPage,
  ref,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/strony-internetowe";

export const metadata: Metadata = {
  title: "Strony internetowe dla firm - projekt i wdrożenie | Programo",
  description:
    "Projektujemy i wdrażamy strony internetowe dla firm z Poznania i całej Polski. Next.js, panel do edycji treści, formularz i pomiar zapytań od startu.",
  alternates: { canonical: "https://programo.pl/strony-internetowe" },
  openGraph: {
    title: "Strony internetowe dla firm - projekt i wdrożenie | Programo",
    description:
      "Projektujemy i wdrażamy strony internetowe dla firm. Next.js, panel do edycji treści i formularz, z którego zapytania trafiają prosto do Ciebie.",
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

const faqs = [
  {
    q: "Ile kosztuje strona internetowa?",
    a: "Na cenę wpływa liczba podstron, panel do edycji treści (CMS), integracje i zakres prac pod SEO. Po krótkiej rozmowie wysyłamy wycenę z widełkami, w której rozpisujemy, co się na nią składa.",
  },
  {
    q: "Ile trwa wykonanie strony?",
    a: "Prosta strona firmowa zwykle 2–3 tygodnie. Na rozbudowany serwis z CMS-em, integracjami i migracją treści potrzebujemy 4–6 tygodni, zależnie od zakresu.",
  },
  {
    q: "Czy zadbacie o szybkość i SEO?",
    a: "Tak. Budujemy w Next.js i pilnujemy Core Web Vitals, poprawnej struktury nagłówków oraz danych strukturalnych. To wpływa i na pozycje w Google, i na to, ilu odwiedzających zostaje na stronie.",
  },
  {
    q: "Czy mogę samodzielnie edytować treści?",
    a: "Tak. Podpinamy CMS dobrany do tego, co faktycznie będziesz zmieniać, albo panel headless. Teksty, zdjęcia i nowe podstrony dodajesz sam, bez czekania na programistę.",
  },
];

const service = buildService({
  path: PATH,
  serviceType: "Tworzenie stron internetowych",
  name: "Tworzenie stron internetowych dla firm - Programo",
  areaServed: [
    { "@type": "Country", name: "Polska" },
    { "@type": "City", name: "Poznań" },
  ],
  description:
    "Projektowanie i wykonanie stron internetowych dla firm: strony firmowe, landing page, sklepy. Next.js/React, Core Web Vitals, SEO.",
});

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Strony internetowe dla firm - projekt i wdrożenie | Programo",
    description:
      "Projektujemy i wdrażamy strony internetowe dla firm z Poznania i całej Polski. Next.js, panel do edycji treści, formularz i pomiar zapytań od startu.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    mainEntity: ref(service),
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Strony internetowe", path: PATH },
  ]),
  service,
  buildFaqPage(faqs),
]);

// Kolejność listy niesie numer w nagłówku — nie trzymamy go w danych.
const services = [
  { title: "Strony firmowe", desc: "Strona firmowa w Next.js z panelem, w którym sam poprawisz teksty i dodasz podstronę. Zbudowana tak, żeby odwiedzający szybko trafił do formularza albo do numeru telefonu." },
  { title: "Landing page / sprzedażowe", desc: "Strona pod konkretną kampanię i konkretną ofertę, z formularzem jako jedynym wyjściem. Do tego pomiar, który pokazuje, ile zapytań przyszło z której reklamy." },
  { title: "Sklepy internetowe", desc: "Robimy też sklepy: WooCommerce, Shopify, PrestaShop i headless. Opisaliśmy to na osobnej stronie o sklepach internetowych." },
  { title: "Redesign i migracja", desc: "Odświeżamy istniejące strony i przenosimy je na nowy stack. Przy migracji trzymamy przekierowania 301 i strukturę adresów, żeby wypracowane pozycje w Google zostały na miejscu." },
  { title: "Wydajność i SEO", desc: "Core Web Vitals, dane strukturalne, nagłówki, mapa strony i reszta technicznego SEO. Zaczynamy od audytu tego, co masz teraz." },
  { title: "Utrzymanie i rozwój", desc: "Po starcie zostajemy. Aktualizacje, nowe podstrony i poprawki po tym, jak zobaczysz pierwsze dane z ruchu." },
];

const steps = [
  { title: "Krótka rozmowa", desc: "Pytamy, po co Ci strona, ile ma mieć podstron, jaki masz budżet i termin." },
  { title: "Makieta i wycena", desc: "Dostajesz szkic układu strony, rozpisane etapy i widełki cenowe, zanim zaczniemy kodować." },
  { title: "Budowa i wdrożenie", desc: "Projektujemy, piszemy kod w Next.js i wypuszczamy stronę na produkcję." },
];

const webCases = [
  {
    slug: "wsafefinanse",
    angle:
      "Strona firmowa doradztwa finansowego w Next.js. Zapytanie z formularza idzie równocześnie na e-mail i Telegram, więc właścicielka reaguje na nie w kilka minut.",
  },
  {
    slug: "wks-poznan",
    angle:
      "Strona klubu sportowego: 17 podstron, własny CMS, profile trenerów, harmonogram i galeria. Klub aktualizuje terminarz i skład sam, z telefonu.",
  },
  {
    slug: "estalo",
    angle:
      "Nasz własny produkt: platforma SaaS CRM w Next.js z AI i integracjami. Utrzymujemy ją na co dzień, więc złożone systemy webowe znamy też od strony kosztów utrzymania.",
  },
];

const H2 = "font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl";
const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24";
// Asymmetric on purpose. Every section on this page uses the same constant, so
// a symmetric value gets counted twice at every boundary — `py-24 md:py-32
// lg:py-40` produced a 320px void between each pair. Top-heavy keeps the space
// above a heading, where it separates, instead of below it, where it strands.
const SECTION = "relative bg-surface pt-section pb-section-tight";

export default function StronyInternetowePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />

      <div className="bg-surface text-on-surface">
        {/* HERO — static (best LCP), 2-column: copy + lead form ABOVE THE FOLD.
            Form in-hero because only ~29% of visitors scrolled past the old
            88vh hero, so the form was effectively invisible to paid traffic. */}
        <section className="relative pt-28 pb-section-tight md:pt-32">
          <div className={CONTAINER}>
            <nav aria-label="breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition-colors hover:text-on-surface">Programo</Link>
              <span className="mx-2">/</span>
              <span>Strony internetowe</span>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* Left: copy */}
              <div>
                <h1 className="font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface md:text-6xl 2xl:text-7xl">
                  Strona firmowa, z której przychodzą zapytania
                </h1>
                <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
                  Jesteśmy dwuosobowym studiem z Poznania, więc rozmawiasz z ludźmi,
                  którzy piszą Twoją stronę. Prostą stronę w Next.js oddajemy zwykle
                  w 2–3 tygodnie. Na wiadomości odpowiadamy w ciągu 24 h.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <CtaButton href="tel:+48509123434" variant="secondary">Zadzwoń: 509 123 434</CtaButton>
                  <a href="#realizacje" className="text-sm font-medium text-on-surface-variant underline underline-offset-4 transition-colors hover:text-on-surface">
                    Zobacz realizacje ↓
                  </a>
                </div>

                {/* Trust strip — static, above the fold, real clients only */}
                <div className="mt-10 flex flex-col gap-4 border-t border-outline-variant/30 pt-7">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-headline text-lg font-bold tracking-tight text-on-surface-variant md:text-xl">
                    <span>Jedmar</span>
                    <span aria-hidden="true" className="text-on-surface-variant/40">·</span>
                    <span>WKS Poznań</span>
                    <span aria-hidden="true" className="text-on-surface-variant/40">·</span>
                    <span>W. Safe Finance</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Jedmar: natywne aplikacje iOS + Android · Poznań i cała Polska
                  </p>
                </div>
              </div>

              {/* Right: lead form above the fold */}
              <CompactLeadForm
                bare
                formId="strony-hero"
                anchorId="szybki-kontakt"
                projectType="Strona / landing"
                heading="Zostaw numer, oddzwonimy z wyceną"
              />
            </div>
          </div>
        </section>

        {/* PROBLEM → OUTCOME */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="max-w-4xl">
              <p className="font-headline text-2xl font-light leading-snug tracking-tight text-on-surface md:text-4xl">
                Klient wchodzi na stronę z telefonu, w biegu, i daje jej kilka sekund.{" "}
                <span className="text-primary">Albo w tym czasie znajdzie numer i powód, żeby zadzwonić, albo wraca do wyników wyszukiwania.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* USŁUGI */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <h2 className={H2}>Od wizytówki po serwis z CMS-em</h2>
            </Reveal>
            {/* Numer wchodzi do nagłówka jako prefiks; role="list" wraca po
                preflightcie Tailwinda, który zdejmuje semantykę z list. */}
            <ol role="list" className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={(i % 3) * 0.1} className="flex flex-col gap-3 border-t border-outline-variant/30 pt-6">
                    <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                      <span className="mr-2 text-on-surface-variant" aria-hidden="true">{i + 1}.</span>
                      {s.title}
                    </h3>
                    <p className="text-base font-light leading-relaxed text-on-surface/70">{s.desc}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal className="mt-14 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-6 py-5 md:mt-20">
              <p className="max-w-2xl text-sm text-on-surface-variant">
                Prowadzimy też Google Ads i konfigurujemy pomiar konwersji razem
                z Consent Mode v2, na Twojej stronie albo na nowej.{" "}
                <Link href="/strony-tracking-reklamy" className="font-medium text-primary underline underline-offset-4 transition hover:text-on-surface">
                  Zobacz ofertę strony, trackingu i reklam →
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        {/* CASE STUDIES */}
        <div id="realizacje" className="scroll-mt-28" />
        <CaseStudies
          heading="Strony i produkty, które zbudowaliśmy"
          intro="Trzy wdrożenia, przy których pracowaliśmy od pierwszej rozmowy do wypuszczenia strony: klub sportowy, firma doradcza z formularzem kontaktowym i nasza własna platforma SaaS."
          items={webCases}
        />

        {/* Powtórzony szybki formularz — wzmocnienie dla scrollujących (osobny formId = osobny tracking) */}
        <CompactLeadForm
          formId="strony-compact"
          projectType="Strona / landing"
          heading="Wciąż się zastanawiasz? Zostaw numer"
        />

        {/* DLACZEGO MY */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-low p-8 md:p-14">
              <h2 className={H2}>Dwóch inżynierów z Poznania i żadnych pośredników</h2>
              <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-on-surface/70">
                Programo to Wojciech Płonka i Bartosz Kołaj. Wojtek odpowiada za
                design i produkt, Bartek za inżynierię, i to my odbieramy telefon,
                projektujemy i piszemy kod. Pracujemy w Next.js, React
                i TypeScript. Prowadzimy też własne produkty, Estalo i Rejestr Pro,
                więc utrzymanie strony po wdrożeniu nie jest dla nas dodatkiem do
                zlecenia.
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
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <h2 className={H2}>Trzy kroki do gotowej strony</h2>
            </Reveal>
            {/* Realna sekwencja — <ol> zgadza się z treścią, numer siedzi
                w nagłówku i jest aria-hidden, żeby czytnik nie dublował. */}
            <ol role="list" className="grid gap-x-10 gap-y-10 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.12} className="flex flex-col gap-3 border-t border-outline-variant/30 pt-6">
                    <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                      <span className="mr-2 text-on-surface-variant" aria-hidden="true">{i + 1}.</span>
                      {s.title}
                    </h3>
                    <p className="text-base font-light leading-relaxed text-on-surface/70">{s.desc}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <h2 className={H2}>Zanim napiszesz</h2>
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
              <h2 className={H2}>Porozmawiajmy o Twojej stronie</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-on-surface/70">
                Opisz projekt w dwie minuty, wrócimy z planem i wyceną. Pracujemy
                z firmami z Poznania, Wielkopolski i całej Polski, odpowiadamy
                w ciągu 24 h.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CtaButton href="#kontakt-main">Opisz projekt szczegółowo</CtaButton>
                <CtaButton href="tel:+48509123434" variant="secondary">Zadzwoń: 509 123 434</CtaButton>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Dowód społeczny + pełny formularz */}
        <TrustBar />
        <ProjectsMarquee />
        <QuickContact formId="strony-full" />
      </div>
    </>
  );
}
