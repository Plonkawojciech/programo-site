import type { Metadata } from "next";
import Link from "next/link";
import {
  buildBreadcrumbs,
  buildFaqPage,
  buildService,
  buildWebPage,
  ref,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/software-house-poznan";

export const metadata: Metadata = {
  title:
    "Software House Poznań - Programo | Oprogramowanie na zamówienie",
  description:
    "Software house Poznań. Budujemy aplikacje webowe, mobilne i systemy SaaS w Next.js i React. Pracujemy z firmami z Poznania i całej Polski. Bezpłatna wycena.",
  alternates: {
    canonical: "https://programo.pl/software-house-poznan",
  },
  openGraph: {
    title: "Software House Poznań - Programo",
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

// Same 3 questions as the visible "Najczęstsze pytania" section below —
// FAQPage markup was missing here even though the content already existed.
const faqs = [
  {
    q: "Czy realizujecie projekty tylko w Poznaniu?",
    a: "Siedziba Programo jest w Poznaniu, ale projekty prowadzimy też zdalnie, dla klientów z całej Polski i z zagranicy. Rozmawiamy po polsku i po angielsku.",
  },
  {
    q: "Ile kosztuje współpraca z software house Programo?",
    a: "Wszystko zależy od zakresu. Prosta aplikacja webowa i rozbudowany system SaaS to zupełnie inne wyceny, więc nie podajemy jednej stawki z góry. Widełki dostajesz po krótkiej rozmowie o tym, co ma powstać.",
  },
  {
    q: "Co odróżnia Programo od innych software house'ów w Poznaniu?",
    a: "Sami budujemy i utrzymujemy własne produkty SaaS: Estalo, Solvio, Rejestr Pro i PoolTimer. Dzięki temu wiemy, jak wygląda życie systemu długo po wdrożeniu. Do tego przez cały projekt rozmawiasz z tymi samymi dwiema osobami, które go budują.",
  },
];

const service = buildService({
  path: PATH,
  serviceType: "Software house Poznań",
  name: "Software House Poznań - Programo",
  description:
    "Software house z Poznania. Tworzenie oprogramowania na zamówienie: systemy SaaS, aplikacje webowe i mobilne, integracje AI.",
});

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Software House Poznań - Programo",
    description:
      "Software house z Poznania. Budujemy aplikacje webowe, mobilne i systemy SaaS. Pracujemy z firmami z Poznania i całej Polski.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    mainEntity: ref(service),
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Software House Poznań", path: PATH },
  ]),
  service,
  buildFaqPage(faqs),
]);

const services = [
  {
    title: "Aplikacje webowe",
    desc: "Piszemy je w Next.js i React, z myślą o szybkości ładowania i dostępności. Od pierwszego MVP po rozbudowane platformy.",
  },
  {
    title: "Systemy SaaS",
    desc: "Wiele firm na jednej instancji, role użytkowników, płatności, integracje. Tak działają Estalo CRM, Solvio i Rejestr Pro, które zbudowaliśmy u siebie.",
  },
  {
    title: "Aplikacje mobilne",
    desc: "Natywnie: Swift i SwiftUI na iOS, Kotlin i Jetpack Compose na Androidzie. Publikację w App Store i Google Play bierzemy na siebie.",
  },
  {
    title: "Integracje AI",
    desc: "Azure OpenAI, Anthropic Claude, RAG, OCR, agenty. Te same mechanizmy działają w produktach z naszego portfolio.",
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
    desc: "CRM w modelu SaaS dla biur nieruchomości. Dopasowanie ofert przez AI, chatbot RAG, integracje z Otodom.",
  },
  {
    name: "Solvio",
    slug: "solvio",
    desc: "Aplikacja do pilnowania wydatków. Wrzucasz paragon, OCR czyta go za ciebie, a dalej są grupy kosztów, porównywarka cen i raporty.",
  },
  {
    name: "PoolTimer",
    slug: "pooltimer",
    desc: "Pomiar czasu dla klubów pływackich, sprzęt razem z oprogramowaniem. Projekt jest w rozwoju, pilotaż działa w klubie.",
  },
  {
    name: "Rejestr Pro",
    slug: "rejestr-pro",
    desc: "Wyszukiwarka firm na oficjalnych danych z KRS. Profile spółek, powiązania osób, link do RDF.",
  },
];

export default function SoftwareHousePoznanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pageGraph }}
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
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl lg:text-7xl">
              Software House Poznań - Programo
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed opacity-80 md:text-xl">
              Programo to software house z Poznania. Budujemy oprogramowanie na
              zamówienie: systemy SaaS, aplikacje webowe i mobilne, integracje
              AI. Pracujemy z firmami z Poznania, Wielkopolski i całej Polski.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:biuro@programo.pl"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition hover:bg-primary-container"
              >
                Bezpłatna wycena
              </a>
              {/* /projekty, not /: a button labelled "portfolio" that lands on
                  the homepage wastes the click, and this was the page's only
                  outbound topical link. */}
              <Link
                href="/projekty"
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
                Z wykonawcą z tego samego miasta łatwiej się dogadać. Można
                spotkać się na miejscu zamiast wymieniać maile, a przy rozmowie o
                wymaganiach nie trzeba tłumaczyć od zera, czym jest KSeF albo
                Otodom. Znamy polskie systemy (Otodom, NOE 2.0, Domy.pl) i polskie
                przepisy (RODO, KSeF, PSD2). Pracujemy na
                Next.js, TypeScript i Supabase, a aplikacje mobilne piszemy
                natywnie w Swift i Kotlinie.
              </p>
              <p>
                Programo to dwie osoby: Wojciech Płonka odpowiada za design i
                produkt, Bartosz Kolaj za inżynierię. Przez cały projekt
                rozmawiasz bezpośrednio z nimi, od pierwszego telefonu po
                wdrożenie i utrzymanie.
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
                  Siedziba Programo jest w Poznaniu, ale projekty prowadzimy też
                  zdalnie, dla klientów z całej Polski i z zagranicy. Rozmawiamy po
                  polsku i po angielsku.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">
                  Ile kosztuje współpraca z software house Programo?
                </h3>
                <p className="max-w-2xl opacity-75">
                  Wszystko zależy od zakresu. Prosta aplikacja webowa i
                  rozbudowany system SaaS to zupełnie inne wyceny, więc nie
                  podajemy jednej stawki z góry. Widełki dostajesz po krótkiej
                  rozmowie o tym, co ma powstać.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">
                  Co odróżnia Programo od innych software house&apos;ów w Poznaniu?
                </h3>
                <p className="max-w-2xl opacity-75">
                  Sami budujemy i utrzymujemy własne produkty SaaS: Estalo, Solvio,
                  Rejestr Pro i PoolTimer. Dzięki temu wiemy, jak wygląda życie
                  systemu długo po wdrożeniu. Do tego przez cały projekt rozmawiasz
                  z tymi samymi dwiema osobami, które go budują.
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
                +48 797 222 363 - Wojciech Płonka
              </a>
              <a href="tel:+48509123434" className="hover:underline">
                +48 509 123 434 - Bartosz Kolaj
              </a>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
