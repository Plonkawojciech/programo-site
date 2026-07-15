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
import BrowserFrame from "@/components/ui/browser-frame";

// Metadata: content-deck-2026-07.md section 8.
export const metadata: Metadata = {
  title: "Sklepy internetowe i aplikacje mobilne do sklepów | Programo",
  description:
    "Sklepy od zera (WooCommerce, PrestaShop, headless) i natywne aplikacje mobilne do istniejących sklepów. Płatności, Paczkomaty InPost, migracje bez utraty SEO.",
  alternates: { canonical: "https://programo.pl/sklepy-internetowe" },
  openGraph: {
    title: "Sklepy internetowe i aplikacje mobilne do sklepów | Programo",
    description:
      "Sklepy od zera (WooCommerce, PrestaShop, headless) i natywne aplikacje mobilne do istniejących sklepów.",
    url: "https://programo.pl/sklepy-internetowe",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
  keywords: [
    "sklep internetowy na zamówienie",
    "aplikacja mobilna do sklepu internetowego",
    "wdrożenie woocommerce",
    "sklep prestashop",
    "migracja sklepu internetowego",
    "integracja allegro baselinker",
    "headless e-commerce next.js",
    "aplikacja iOS Android sklep",
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
  serviceType: "Tworzenie sklepów internetowych i aplikacji mobilnych do sklepów",
  name: "Sklepy internetowe i aplikacje mobilne — Programo",
  provider: { "@id": "https://programo.pl/#organization" },
  areaServed: [
    { "@type": "Country", name: "Polska" },
    { "@type": "City", name: "Poznań" },
  ],
  description:
    "Sklepy od zera (WooCommerce, PrestaShop, headless Next.js) i natywne aplikacje mobilne do istniejących sklepów. Integracje płatności, InPost, Allegro/BaseLinker, migracje bez utraty SEO.",
  url: "https://programo.pl/sklepy-internetowe",
};

const faqs = [
  {
    q: "Ile kosztuje sklep internetowy?",
    a: "Koszt zależy od zakresu: liczby produktów, integracji i tego, czy budujemy od zera, czy rozbudowujemy istniejący sklep. Po pierwszej rozmowie dostajesz widełki w 24 h, a przed startem stałą wycenę.",
  },
  {
    q: "Czy muszę przenosić sklep, żeby mieć aplikację mobilną?",
    a: "Nie. Aplikację budujemy na API Twojego obecnego sklepu — dokładnie tak powstały aplikacje Jedmara, gdzie PrestaShop pozostał nietknięty.",
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

// Scope of e-commerce services — content-deck-2026-07.md section 4.3.
const services = [
  {
    n: "01",
    title: "Aplikacje mobilne do istniejących sklepów",
    desc: "Twój sklep zostaje tam, gdzie jest. My dokładamy natywne aplikacje iOS i Android, które działają na jego danych: katalogu, cenach, stanach magazynowych i zamówieniach. Klient dostaje zakupy na dwa dotknięcia, powiadomienia push i skaner kodów, a Ty jeden system zamiast dwóch.",
  },
  {
    n: "02",
    title: "Sklepy od zera",
    desc: "WooCommerce lub PrestaShop, gdy liczy się sprawdzony ekosystem, albo headless na Next.js, gdy sklep ma być szybki jak aplikacja i w pełni pod Twoją kontrolą. Doradzimy uczciwie, która droga pasuje do skali biznesu — czasem ta tańsza.",
  },
  {
    n: "03",
    title: "Integracje",
    desc: "Płatności (PayU, PayPo, iMoje, InPost Pay i inne), dostawy z wyborem Paczkomatu na mapie, Allegro i BaseLinker, synchronizacja stanów magazynowych. Integracja ma działać latami, więc budujemy ją z obsługą błędów i automatycznym ponawianiem, nie „na sznurki”.",
  },
  {
    n: "04",
    title: "Migracje bez utraty SEO",
    desc: "Przy przenoszeniu sklepu pilnujemy mapy przekierowań, struktury adresów i danych strukturalnych, żeby pozycje wypracowane w Google przetrwały przeprowadzkę. Plan migracji dostajesz na piśmie, zanim cokolwiek ruszymy.",
  },
];

// Honest e-commerce capability proof, alongside the Jedmar realization above.
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
const SECTION = "relative bg-surface py-24 md:py-32 lg:py-40";

export default function SklepyInternetowePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="bg-surface text-on-surface">
        {/* HERO — static, 2-col: copy + lead form ABOVE THE FOLD */}
        <section className="relative pt-28 pb-16 md:pt-32 md:pb-24">
          <div className={CONTAINER}>
            <nav aria-label="breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition-colors hover:text-on-surface">Programo</Link>
              <span className="mx-2">/</span>
              <span>Sklepy internetowe</span>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* Left: copy */}
              <div>
                <p className={EYEBROW}>Sklepy internetowe · E-commerce · Poznań</p>
                <h1 className="mt-5 font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface md:text-6xl 2xl:text-7xl">
                  Sklepy internetowe: od nowego sklepu po aplikację mobilną do tego, który już masz
                </h1>
                <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
                  Budujemy sklepy od zera i rozbudowujemy istniejące — bez wymuszania
                  migracji. Nasza flagowa realizacja to dwie natywne aplikacje i
                  interaktywne schematy części dla sklepu narzędziowego Jedmar.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <CtaButton href="tel:+48509123434" variant="secondary">Zadzwoń: 509 123 434</CtaButton>
                  <a href="#realizacje" className="text-sm font-medium text-on-surface-variant underline underline-offset-4 transition-colors hover:text-on-surface">
                    Zobacz realizacje ↓
                  </a>
                </div>

                {/* Trust strip: Jedmar is the flagship store realization, shown
                    with its app thumbnail. WKS Poznań and W. Safe Finance are
                    real projects but not stores, so they're labeled and kept
                    in a smaller, separate line instead of implying they're
                    e-commerce work. */}
                <div className="mt-10 flex flex-col gap-5 border-t border-outline-variant/30 pt-7">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">Realizacja flagowa</span>
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-low">
                        <Image
                          src="/screenshots/jedmar-hero.webp"
                          alt="Aplikacja mobilna sklepu Jedmar — natywne iOS i Android zbudowane przez Programo"
                          fill
                          priority
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-headline text-lg font-bold tracking-tight text-on-surface-variant">Jedmar</span>
                        <p className="text-sm text-on-surface-variant">
                          Natywne aplikacje iOS + Android · Poznań i cała Polska
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant/70">
                    Inne wdrożenia webowe: WKS Poznań · W. Safe Finance
                  </p>
                </div>
              </div>

              {/* Right: lead form above the fold */}
              <CompactLeadForm
                bare
                formId="sklepy-hero"
                anchorId="szybki-kontakt"
                projectType="Sklep internetowy"
                heading="Masz sklep do zbudowania lub przyspieszenia?"
              />
            </div>
          </div>
        </section>

        {/* JEDMAR — flagship realization (deck section 4.2) */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-14 max-w-3xl md:mb-16">
              <p className={EYEBROW}>Realizacja flagowa</p>
              <h2 className={`mt-5 ${H2}`}>Jedmar — sklep, którego nie ruszaliśmy, i dwie aplikacje, których mu brakowało</h2>
              <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70">
                Jedmar miał działający sklep na PrestaShop i nie potrzebował nowego. Potrzebował
                wygodnych zakupów z telefonu i sensownej sprzedaży części zamiennych.
                Zbudowaliśmy dwie natywne aplikacje (iOS i Android), które są opublikowane w
                App Store i Google Play: katalog ponad 1500 produktów, koszyk, sześć metod
                płatności, Paczkomaty InPost i skaner kodów EAN. Do tego moduł interaktywnych
                schematów: 73 narzędzia rozrysowane część po części, około 7500 klikalnych
                markerów, a każda część z przyciskiem dodania do koszyka — na stronie sklepu i
                w obu aplikacjach, z jednego źródła danych. Katalog synchronizuje się z
                PrestaShopem automatycznie co kilka minut.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <BrowserFrame
                url="jedmar.pl/pl/schematy-narzedzi"
                src="/screenshots/v2/jedmar-schemat-tool-desktop.webp"
                alt="Interaktywny moduł schematów części Jedmar — eksplodowane rysunki techniczne z klikalnymi markerami"
                width={1440}
                height={900}
              />
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["iOS + Android natywnie", "Swift / SwiftUI", "Kotlin", "PrestaShop API", "73 schematy narzędzi"].map((chip) => (
                <span key={chip} className="rounded-full border border-outline-variant/60 px-4 py-1.5 text-sm text-on-surface-variant">{chip}</span>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/projects/jedmar" className="text-sm font-medium text-primary underline underline-offset-4 transition hover:text-on-surface">
                Zobacz cały projekt Jedmar →
              </Link>
            </div>
          </div>
        </section>

        {/* ZAKRES USŁUG E-COMMERCE */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-14 max-w-3xl md:mb-20">
              <p className={EYEBROW}>Zakres usług e-commerce</p>
              <h2 className={`mt-5 ${H2}`}>Sklep, aplikacja, integracje, migracja</h2>
            </Reveal>
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
              {services.map((s, i) => (
                <Reveal key={s.n} delay={(i % 2) * 0.1} className="flex flex-col gap-4 border-t border-outline-variant/30 pt-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">{s.n}</span>
                  <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{s.title}</h3>
                  <p className="text-base font-light leading-relaxed text-on-surface/70">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* KOMPETENCJE (honest capability proof) */}
        <div id="realizacje" className="scroll-mt-28" />
        <CaseStudies
          eyebrow="Kompetencje"
          heading="Co jeszcze potrafimy — przydatne w sklepie"
          intro="Jedmar (wyżej) to nasza realizacja sklepowa. Obok — własne platformy, które dowodzą umiejętności potrzebnych w rozbudowanym e-commerce: płatności, integracje z systemami zewnętrznymi i wydajny frontend."
          items={storeCases}
        />

        {/* Powtórzony szybki formularz — wzmocnienie dla scrollujących */}
        <CompactLeadForm
          formId="sklepy-compact"
          projectType="Sklep internetowy"
          eyebrow="Bez zobowiązań"
          heading="Wciąż się rozglądasz? Zostaw numer"
        />

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
              <h2 className={H2}>Porozmawiajmy o Twoim sklepie</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-on-surface/70">
                Opisz projekt w 2 minuty — wrócimy z planem, integracjami i wyceną.
                Poznań, Wielkopolska i cała Polska. Odpowiadamy w 24 h.
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
        <QuickContact formId="sklepy-full" />
      </div>
    </>
  );
}
