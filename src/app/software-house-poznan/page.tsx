import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Software House Poznań — Programo | Tworzenie oprogramowania na zamówienie",
  description:
    "Software house Poznań — Programo. Tworzymy aplikacje webowe, mobilne i systemy SaaS dla firm z Poznania i całej Polski. Next.js, React, TypeScript, AI. Bezpłatna wycena.",
  alternates: {
    canonical: "https://programo.pl/software-house-poznan",
  },
  openGraph: {
    title: "Software House Poznań — Programo",
    description:
      "Software house z Poznania. Aplikacje webowe, mobilne, systemy SaaS, integracje AI.",
    url: "https://programo.pl/software-house-poznan",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "software house Poznań",
    "software house poznan",
    "software house",
    "tworzenie oprogramowania Poznań",
    "agencja software Poznań",
    "studio software Poznań",
    "tworzenie aplikacji webowych Poznań",
    "tworzenie aplikacji mobilnych Poznań",
    "SaaS Poznań",
    "Next.js Poznań",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Programo",
      item: "https://programo.pl",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Software House Poznań",
      item: "https://programo.pl/software-house-poznan",
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Software house Poznań",
  name: "Software House Poznań — Programo",
  provider: { "@id": "https://programo.pl/#organization" },
  areaServed: [
    { "@type": "City", name: "Poznań" },
    { "@type": "AdministrativeArea", name: "Wielkopolska" },
    { "@type": "Country", name: "Polska" },
  ],
  description:
    "Software house z Poznania — tworzenie oprogramowania na zamówienie, systemy SaaS, aplikacje webowe i mobilne, integracje AI.",
  url: "https://programo.pl/software-house-poznan",
};

const services = [
  {
    title: "Aplikacje webowe",
    desc: "Budujemy szybkie, dostępne i bezpieczne aplikacje webowe w Next.js i React. Od MVP do skalowalnych platform.",
  },
  {
    title: "Systemy SaaS",
    desc: "Wielonajemcowe systemy SaaS z płatnościami, rolami, AI i integracjami. Przykłady: Estalo CRM, Solvio, Rejestr Pro.",
  },
  {
    title: "Aplikacje mobilne",
    desc: "iOS i Android natywnie — Swift/SwiftUI i Kotlin/Jetpack Compose. Publikację w App Store i Google Play bierzemy na siebie.",
  },
  {
    title: "Integracje AI",
    desc: "Azure OpenAI, Anthropic Claude, RAG, OCR i agenty AI — wpięte w produkty, które pokazujemy w portfolio.",
  },
];

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Neon",
  "Supabase",
  "Drizzle ORM",
  "Tailwind CSS",
  "Capacitor",
  "Azure OpenAI",
  "Anthropic Claude",
  "Vercel",
];

const projects = [
  {
    name: "Estalo",
    slug: "estalo",
    desc: "SaaS CRM dla biur nieruchomości — AI matching, RAG chatbot, integracje z Otodom.",
  },
  {
    name: "Solvio",
    slug: "solvio",
    desc: "SaaS do śledzenia wydatków z AI — OCR paragonów, grupy kosztów, porównywarka cen, raporty.",
  },
  {
    name: "PoolTimer",
    slug: "pooltimer",
    desc: "System pomiaru czasu dla klubów pływackich — sprzęt i oprogramowanie. W rozwoju, pilotaż w realnym klubie.",
  },
  {
    name: "Rejestr Pro",
    slug: "rejestr-pro",
    desc: "Wyszukiwarka firm z KRS — oficjalne dane MS, profile spółek, powiązania osób, link do RDF.",
  },
];

export default function SoftwareHousePoznanPage() {
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

      {/* No <main> here — the root layout (Providers) already wraps every page
          in <main id="main-content">; a second <main> would be an invalid
          duplicate "main" landmark. */}
      <div className="min-h-screen bg-surface text-on-surface">
        <article className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <nav aria-label="breadcrumb" className="mb-8 text-xs uppercase tracking-widest opacity-60">
            <Link href="/" className="hover:underline">
              Programo
            </Link>
            <span className="mx-2">/</span>
            <span>Software House Poznań</span>
          </nav>

          <header className="mb-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] opacity-60">
              Software House · Poznań · Wielkopolska
            </p>
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl lg:text-7xl">
              Software House Poznań — Programo
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed opacity-80 md:text-xl">
              Programo to software house z Poznania. Projektujemy i budujemy
              oprogramowanie na zamówienie — systemy SaaS, aplikacje webowe i
              mobilne, integracje AI. Pracujemy z firmami z Poznania, Wielkopolski
              i całej Polski.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:biuro@programo.pl"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition hover:bg-primary-container"
              >
                Bezpłatna wycena
              </a>
              <Link
                href="/"
                className="rounded-full border border-current px-6 py-3 text-sm font-medium opacity-80 transition hover:opacity-100"
              >
                Zobacz portfolio
              </Link>
            </div>
          </header>

          <section className="mb-16">
            <h2 className="mb-6 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Dlaczego software house z Poznania?
            </h2>
            <div className="max-w-3xl space-y-4 text-base leading-relaxed opacity-80 md:text-lg">
              <p>
                Wybierając lokalny software house w Poznaniu, zyskujesz krótszą
                drogę komunikacji, możliwość spotkań na miejscu i partnera, który
                rozumie polski rynek — od polskich integracji (Otodom, NOE 2.0,
                Domy.pl) po polskie regulacje (RODO, KSeF, PSD2). Programo łączy
                lokalność z nowoczesnym stackiem: Next.js, TypeScript, Supabase,
                natywny Swift i Kotlin.
              </p>
              <p>
                Za Programo stoi dwóch inżynierów — bez warstw pośredników i
                korporacyjnych procesów. Pracujesz bezpośrednio z założycielami:
                Wojciechem Płonką (Design i Produkt) i Bartoszem Kolajem
                (Inżynieria).
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Usługi software house Programo
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 transition hover:border-outline-variant/70"
                >
                  <h3 className="mb-3 font-headline text-xl font-bold tracking-tight">{s.title}</h3>
                  <p className="text-sm leading-relaxed opacity-75">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Stack technologiczny
            </h2>
            <ul className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-outline-variant/60 px-4 py-1.5 text-sm text-on-surface-variant"
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Wybrane projekty
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 transition hover:border-outline-variant/70"
                >
                  <h3 className="mb-2 font-headline text-xl font-bold tracking-tight group-hover:underline">
                    {p.name}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-75">{p.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Najczęstsze pytania
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">
                  Czy realizujecie projekty tylko w Poznaniu?
                </h3>
                <p className="max-w-2xl opacity-75">
                  Siedziba Programo mieści się w Poznaniu, ale realizujemy projekty
                  zdalnie dla klientów z całej Polski oraz z zagranicy. Komunikacja
                  po polsku i angielsku.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">
                  Ile kosztuje współpraca z software house Programo?
                </h3>
                <p className="max-w-2xl opacity-75">
                  Koszt zależy od zakresu projektu — małą aplikację webową i
                  rozbudowany system SaaS wyceniamy zupełnie inaczej. Dlatego
                  każdą wycenę przygotowujemy indywidualnie po krótkiej rozmowie,
                  z konkretnymi widełkami i bez ukrytych kosztów.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">
                  Co odróżnia Programo od innych software house&apos;ów w Poznaniu?
                </h3>
                <p className="max-w-2xl opacity-75">
                  Zespół dwóch inżynierów, własne produkty SaaS w portfolio (Estalo,
                  Solvio, Rejestr Pro, PoolTimer) i bezpośredni kontakt z założycielami.
                  Nie jesteśmy outsourcingową fabryką — projekt prowadzimy od pierwszej
                  rozmowy po utrzymanie.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-primary/30 bg-primary/5 p-8 md:p-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Skontaktuj się z software house Programo
            </h2>
            <p className="mb-6 opacity-80">
              Poznań · Wielkopolska · cała Polska. Odpowiadamy w 24 h.
            </p>
            <div className="flex flex-col gap-3 text-sm md:flex-row md:gap-6">
              <a href="mailto:biuro@programo.pl" className="hover:underline">
                biuro@programo.pl
              </a>
              <a href="tel:+48797222363" className="hover:underline">
                +48 797 222 363 — Wojciech Płonka
              </a>
              <a href="tel:+48509123434" className="hover:underline">
                +48 509 123 434 — Bartosz Kolaj
              </a>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
