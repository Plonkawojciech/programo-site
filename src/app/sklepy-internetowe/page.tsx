import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import QuickContact from "@/components/quick-contact";
import ProjectsMarquee from "@/components/projects-marquee";
import TrustBar from "@/components/trust-bar";
import CaseStudies from "@/components/case-studies";
import CompactLeadForm from "@/components/compact-lead-form";
import CtaButton from "@/components/ui/cta-button";
import Reveal from "@/components/ui/reveal";

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
};

const faqs = [
  {
    q: "Ile kosztuje sklep internetowy?",
    a: "Koszt zależy od zakresu — liczby produktów, integracji (Allegro, BaseLinker, płatności, ERP) i migracji danych. Każdy sklep wyceniamy indywidualnie po krótkiej rozmowie o zakresie — z konkretnymi widełkami i bez ukrytych kosztów.",
  },
  {
    q: "Ile trwa wdrożenie sklepu?",
    a: "Prosty sklep zwykle 2–4 tygodnie. Rozbudowany sklep z integracjami i migracją danych — 4–8 tygodni, zależnie od zakresu.",
  },
  {
    q: "Czy migracja sklepu nie zaszkodzi pozycjom w Google?",
    a: "Nie. Migrujemy z zachowaniem struktury adresów URL i przekierowaniami 301, pilnując pozycji w Google i danych produktów.",
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
  { n: "01", title: "Sklep na zamówienie", desc: "WooCommerce, Shopify, PrestaShop lub headless (Next.js). Od prostego sklepu po rozbudowany B2B z panelem klienta i rolami." },
  { n: "02", title: "Migracje sklepów", desc: "Przenosimy sklep między platformami (PrestaShop ↔ WooCommerce ↔ Shopify) bez utraty pozycji w Google i danych produktów." },
  { n: "03", title: "Integracje", desc: "Allegro, BaseLinker, płatności (Przelewy24, Stripe), kurierzy, systemy ERP i fakturowanie (KSeF). Sklep, który dogaduje się z resztą firmy." },
  { n: "04", title: "Aplikacje mobilne do sklepów", desc: "Natywne aplikacje iOS + Android dla Twojego sklepu — katalog, koszyk i zamówienia z telefonu, spięte z backendem sklepu." },
  { n: "05", title: "Headless i wydajność", desc: "Frontend w Next.js na istniejącym backendzie (np. PrestaShop) — szybsze ładowanie, lepsze Core Web Vitals, wyższe konwersje." },
  { n: "06", title: "Utrzymanie i rozwój", desc: "Opieka po wdrożeniu, aktualizacje, nowe funkcje i optymalizacja konwersji. Stała współpraca, nie znikamy po starcie." },
];

const steps = [
  { n: "01", title: "Krótka rozmowa", desc: "Ustalamy zakres sklepu, integracje, budżet i termin." },
  { n: "02", title: "Makieta i wycena", desc: "Dostajesz konkretny plan, etapy i widełki — zanim zaczniemy." },
  { n: "03", title: "Budowa i wdrożenie", desc: "Projektujemy, kodujemy, integrujemy i wypuszczamy sklep produkcyjnie." },
];

// Honest e-commerce capability proof. Jedmar (featured above) is our store
// realization; these are our own platforms whose facts (from projects.ts)
// demonstrate commerce-grade skills — framed as capability, NOT as deployed stores.
const storeCases = [
  {
    slug: "estalo",
    angle:
      "Własna platforma SaaS z płatnościami (Lemon Squeezy), integracjami z portalami i panelem ról — te same kompetencje, których wymaga rozbudowany sklep B2B z integracjami.",
  },
  {
    slug: "rejestr-pro",
    angle:
      "Wydajny frontend w Next.js na danych z zewnętrznego API i własnym indeksie Postgres — fundament pod headless e-commerce na istniejącym backendzie sklepu.",
  },
];

const EYEBROW = "text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary";
const H2 = "font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl";
const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24";
const SECTION = "relative bg-surface py-20 md:py-28 lg:py-32";

export default function SklepyInternetowePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="bg-surface text-on-surface">
        {/* HERO — static, full-screen, 2-col (text + Jedmar app shot as LCP) */}
        <section className="relative flex min-h-[88vh] flex-col justify-center pt-28 pb-16 md:pt-32">
          <div className={CONTAINER}>
            <nav aria-label="breadcrumb" className="mb-10 text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition-colors hover:text-on-surface">Programo</Link>
              <span className="mx-2">/</span>
              <span>Sklepy internetowe</span>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <p className={EYEBROW}>Sklepy internetowe · E-commerce · Poznań</p>
                <h1 className="mt-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface md:text-7xl 2xl:text-[clamp(4rem,4.6vw,5.5rem)]">
                  Sklepy internetowe, które naprawdę sprzedają
                </h1>
                <p className="mt-8 max-w-2xl text-xl font-light leading-relaxed text-on-surface/70 md:mt-10 md:text-2xl">
                  Tworzymy, migrujemy i rozwijamy sklepy: WooCommerce, Shopify,
                  PrestaShop i headless w Next.js — z integracjami (Allegro,
                  BaseLinker, płatności) i naciskiem na szybkość oraz konwersję.
                </p>
                <div className="mt-12 flex flex-wrap gap-4">
                  <CtaButton href="#szybki-kontakt">Chcę sklep internetowy</CtaButton>
                  <CtaButton href="tel:+48509123434" variant="secondary">Zadzwoń: 509 123 434</CtaButton>
                </div>
              </div>

              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low">
                <Image
                  src="/screenshots/jedmar-hero.webp"
                  alt="Aplikacja mobilna sklepu Jedmar — natywne iOS i Android zbudowane przez Programo"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Trust strip — static, above the fold */}
            <div className="mt-14 flex flex-col gap-5 border-t border-outline-variant/30 pt-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">Zaufali nam</span>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-headline text-xl font-bold tracking-tight text-on-surface/45 md:text-2xl">
                <span>Jedmar</span>
                <span aria-hidden="true" className="text-on-surface-variant/40">·</span>
                <span>Estalo</span>
                <span aria-hidden="true" className="text-on-surface-variant/40">·</span>
                <span>WKS Poznań</span>
              </div>
              <p className="text-sm text-on-surface-variant">
                Bezpośredni kontakt z założycielami · Odpowiadamy w 24 h · Poznań i cała Polska
              </p>
            </div>
          </div>
        </section>

        {/* PROBLEM → OUTCOME */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="max-w-4xl">
              <p className={EYEBROW}>Dlaczego to ważne</p>
              <p className="mt-6 font-headline text-2xl font-light leading-snug tracking-tight text-on-surface md:text-4xl">
                Sklep, który ładuje się sekundę za długo, traci koszyk.{" "}
                <span className="text-primary">Szybki, dobrze zintegrowany sprzedaje — i nie znika po wdrożeniu.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* USŁUGI */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-14 max-w-3xl md:mb-20">
              <p className={EYEBROW}>Co robimy w e-commerce</p>
              <h2 className={`mt-5 ${H2}`}>Sklep, migracja, integracje, apka</h2>
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

        {/* JEDMAR — featured realization */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-low p-8 md:p-14">
              <p className={EYEBROW}>Realizacja</p>
              <h2 className={`mt-5 ${H2}`}>Jedmar — aplikacja mobilna do sklepu narzędziowego</h2>
              <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-on-surface/70">
                Natywna aplikacja mobilna na iOS i Android dla Jedmar Centrum
                Narzędziowego — zakupy z telefonu: pełny katalog z kategoriami i
                markami, koszyk, konto klienta i zamówienia, spięte z backendem
                sklepu (PrestaShop) przez API. Zlecenie: aplikacja do istniejącego
                sklepu — nie cały sklep.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["iOS + Android natywnie", "Swift / SwiftUI", "Kotlin", "PrestaShop API", "Mobile-first"].map((chip) => (
                  <span key={chip} className="rounded-full border border-outline-variant/60 px-4 py-1.5 text-sm text-on-surface-variant">{chip}</span>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/projects/jedmar" className="text-sm font-medium text-primary underline underline-offset-4 transition hover:text-on-surface">
                  Zobacz case Jedmar →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* KOMPETENCJE (honest capability proof) */}
        <CaseStudies
          eyebrow="Kompetencje"
          heading="Co jeszcze potrafimy — przydatne w sklepie"
          intro="Jedmar (wyżej) to nasza realizacja sklepowa. Obok — własne platformy, które dowodzą umiejętności potrzebnych w rozbudowanym e-commerce: płatności, integracje z systemami zewnętrznymi i wydajny frontend."
          items={storeCases}
        />

        {/* SZYBKI KONTAKT — primary conversion gate (hero CTA target) */}
        <CompactLeadForm
          formId="sklepy-compact"
          anchorId="szybki-kontakt"
          projectType="Sklep internetowy"
          heading="Masz sklep do zbudowania lub przyspieszenia?"
        />

        {/* PROCES */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-14 max-w-3xl md:mb-20">
              <p className={EYEBROW}>Jak pracujemy</p>
              <h2 className={`mt-5 ${H2}`}>Trzy kroki do gotowego sklepu</h2>
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
              <h2 className={H2}>Zbudujmy lub przyspieszmy Twój sklep</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-on-surface/70">
                Opisz projekt w 2 minuty — wrócimy z planem, integracjami i wyceną.
                Poznań, Wielkopolska i cała Polska. Odpowiadamy w ciągu 24 godzin.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CtaButton href="#kontakt-main">Chcę sklep internetowy</CtaButton>
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
