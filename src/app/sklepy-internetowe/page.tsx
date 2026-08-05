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
import {
  buildBreadcrumbs,
  buildFaqPage,
  buildService,
  buildWebPage,
  ref,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/sklepy-internetowe";

// Metadata: content-deck-2026-07.md section 8.
export const metadata: Metadata = {
  title: "Sklepy internetowe i aplikacje mobilne do sklepów | Programo",
  description:
    "Sklepy internetowe na WooCommerce, PrestaShop i headless oraz aplikacje mobilne do sklepów, które już działają. Płatności, InPost, migracja bez utraty SEO.",
  alternates: { canonical: "https://programo.pl/sklepy-internetowe" },
  openGraph: {
    title: "Sklepy internetowe i aplikacje mobilne do sklepów | Programo",
    description:
      "Sklepy internetowe na WooCommerce, PrestaShop i headless oraz natywne aplikacje mobilne do sklepów, które już działają.",
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

const faqs = [
  {
    q: "Ile kosztuje sklep internetowy?",
    a: "Na cenę wpływa liczba produktów, zestaw integracji oraz to, czy budujemy sklep od zera, czy rozbudowujemy ten, który masz. Widełki wysyłamy w 24 h od pierwszej rozmowy, a stałą wycenę przed startem prac.",
  },
  {
    q: "Czy muszę przenosić sklep, żeby mieć aplikację mobilną?",
    a: "Nie. Aplikacja korzysta z API sklepu, który już masz. Tak powstały aplikacje Jedmara, gdzie PrestaShop został dokładnie taki, jaki był.",
  },
];

const service = buildService({
  path: PATH,
  serviceType: "Tworzenie sklepów internetowych i aplikacji mobilnych do sklepów",
  name: "Sklepy internetowe i aplikacje mobilne - Programo",
  areaServed: [
    { "@type": "Country", name: "Polska" },
    { "@type": "City", name: "Poznań" },
  ],
  description:
    "Sklepy od zera (WooCommerce, PrestaShop, headless Next.js) i natywne aplikacje mobilne do istniejących sklepów. Integracje płatności, InPost, Allegro/BaseLinker, migracje bez utraty SEO.",
});

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Sklepy internetowe i aplikacje mobilne do sklepów | Programo",
    description:
      "Sklepy internetowe na WooCommerce, PrestaShop i headless oraz aplikacje mobilne do sklepów, które już działają. Płatności, InPost, migracja bez utraty SEO.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    mainEntity: ref(service),
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Sklepy internetowe", path: PATH },
  ]),
  service,
  buildFaqPage(faqs),
]);

// Scope of e-commerce services — content-deck-2026-07.md section 4.3.
const services = [
  {
    n: "01",
    title: "Aplikacje mobilne do istniejących sklepów",
    desc: "Twój sklep zostaje tam, gdzie jest. Dokładamy do niego natywne aplikacje iOS i Android, które czytają ten sam katalog, ceny, stany magazynowe i zamówienia. Klient kupuje z telefonu, dostaje powiadomienia push i skanuje kody, a Ty nadal pracujesz na jednym panelu.",
  },
  {
    n: "02",
    title: "Sklepy od zera",
    desc: "WooCommerce albo PrestaShop, jeśli zależy Ci na sprawdzonym ekosystemie i gotowych wtyczkach. Headless na Next.js, jeśli sklep ma się otwierać tak szybko jak aplikacja. Powiemy, która droga pasuje do Twojej skali, nawet jeśli będzie to ta tańsza.",
  },
  {
    n: "03",
    title: "Integracje",
    desc: "Płatności (PayU, PayPo, iMoje, InPost Pay i inne), wybór Paczkomatu na mapie, Allegro i BaseLinker, synchronizacja stanów magazynowych. Piszemy je z obsługą błędów i automatycznym ponawianiem, żeby nikt nie musiał ich pilnować ręcznie.",
  },
  {
    n: "04",
    title: "Migracje bez utraty SEO",
    desc: "Przy przenoszeniu sklepu pilnujemy mapy przekierowań, struktury adresów i danych strukturalnych, żeby pozycje wypracowane w Google przetrwały przeprowadzkę. Plan migracji dostajesz na piśmie, zanim ruszymy cokolwiek na produkcji.",
  },
];

// Honest e-commerce capability proof, alongside the Jedmar realization above.
const storeCases = [
  {
    slug: "estalo",
    angle:
      "Własna platforma SaaS z płatnościami przez Lemon Squeezy, integracjami z portalami i panelem uprawnień. Rozbudowany sklep B2B stoi na tych samych mechanizmach.",
  },
  {
    slug: "rejestr-pro",
    angle:
      "Frontend w Next.js oparty na zewnętrznym API i własnym indeksie w Postgresie. Dokładnie tak działa headless e-commerce postawiony na backendzie istniejącego sklepu.",
  },
];

const EYEBROW = "text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary";
const H2 = "font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl";
const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24";
// Asymmetric on purpose. Every section on this page uses the same constant, so
// a symmetric value gets counted twice at every boundary — `py-24 md:py-32
// lg:py-40` produced a 320px void between each pair. Top-heavy keeps the space
// above a heading, where it separates, instead of below it, where it strands.
const SECTION = "relative bg-surface pt-section pb-section-tight";

export default function SklepyInternetowePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />

      <div className="bg-surface text-on-surface">
        {/* HERO — static, 2-col: copy + lead form ABOVE THE FOLD */}
        <section className="relative pt-28 pb-section-tight md:pt-32">
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
                  Sklepy internetowe i aplikacje mobilne do sklepów, które już działają
                </h1>
                <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
                  Budujemy sklepy od zera, a jeśli Twój działa dobrze, nie namawiamy
                  Cię na migrację. Dla sklepu narzędziowego Jedmar zbudowaliśmy dwie
                  natywne aplikacje i interaktywne schematy części, a sam sklep został
                  na PrestaShopie.
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
                          alt="Aplikacja mobilna sklepu Jedmar - natywne iOS i Android zbudowane przez Programo"
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
                heading="Masz sklep do zbudowania lub przyspieszenia?"
              />
            </div>
          </div>
        </section>

        {/* JEDMAR — flagship realization (deck section 4.2) */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <p className={EYEBROW}>Realizacja flagowa</p>
              <h2 className={`mt-5 ${H2}`}>Jedmar: dwie aplikacje do sklepu, którego nie musieliśmy przebudowywać</h2>
              <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70">
                Jedmar miał działający sklep na PrestaShop i nie potrzebował nowego. Brakowało
                mu wygodnych zakupów z telefonu i sensownej sprzedaży części zamiennych.
                Zbudowaliśmy dwie natywne aplikacje, na iOS i Androida, opublikowane w
                App Store i Google Play: katalog ponad 1500 produktów, koszyk, sześć metod
                płatności, Paczkomaty InPost i skaner kodów EAN. Doszedł do tego moduł
                interaktywnych schematów, czyli 73 narzędzia rozrysowane część po części
                i około 7500 klikalnych markerów, z których każdy dodaje daną część do
                koszyka. Ten sam moduł działa na stronie sklepu i w obu aplikacjach, na
                jednym źródle danych, a katalog synchronizuje się z PrestaShopem co kilka
                minut.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <BrowserFrame
                url="jedmar.pl/pl/schematy-narzedzi"
                src="/screenshots/v2/jedmar-schemat-tool-desktop.webp"
                alt="Interaktywny moduł schematów części Jedmar - eksplodowane rysunki techniczne z klikalnymi markerami"
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
            <Reveal className="mb-10 max-w-3xl md:mb-14">
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
          heading="Co jeszcze budowaliśmy i co z tego przydaje się w sklepie"
          intro="Jedmar wyżej to nasze wdrożenie sklepowe. Poniżej dwie własne platformy, przy których robiliśmy to samo, czego wymaga rozbudowany e-commerce: płatności, integracje z zewnętrznymi systemami i frontend, który nie zwalnia przy dużym katalogu."
          items={storeCases}
        />

        {/* Powtórzony szybki formularz — wzmocnienie dla scrollujących */}
        <CompactLeadForm
          formId="sklepy-compact"
          projectType="Sklep internetowy"
          eyebrow="Bez zobowiązań"
          heading="Wciąż się rozglądasz? Zostaw numer"
        />

        {/* FAQ */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
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
                Opisz projekt w dwie minuty, a wrócimy z planem, listą integracji
                i wyceną. Pracujemy z firmami z Poznania, Wielkopolski i całej
                Polski, odpowiadamy w ciągu 24 h.
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
