import type { Metadata } from "next";
import Link from "next/link";
import CompactLeadForm from "@/components/compact-lead-form";
import {
  buildArticle,
  buildBreadcrumbs,
  buildFaqPage,
  buildWebPage,
  ref,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/ile-kosztuje-aplikacji";

export const metadata: Metadata = {
  title: "Ile kosztuje aplikacja lub strona? Jak to wyceniamy - Programo",
  description:
    "Ile kosztuje aplikacja, strona lub system SaaS? Tłumaczymy, co podnosi i co obniża koszt oraz jak przygotowujemy wycenę. Programo, software house z Poznania.",
  alternates: { canonical: "https://programo.pl/ile-kosztuje-aplikacji" },
  openGraph: {
    title: "Ile kosztuje aplikacja lub strona? Jak to wyceniamy - Programo",
    description:
      "Co realnie wpływa na koszt aplikacji, strony lub systemu SaaS i jak wygląda nasza indywidualna wycena.",
    url: "https://programo.pl/ile-kosztuje-aplikacji",
    siteName: "Programo",
    locale: "pl_PL",
    type: "article",
  },
  robots: { index: true, follow: true },
  keywords: [
    "ile kosztuje aplikacja",
    "ile kosztuje aplikacja mobilna",
    "ile kosztuje strona internetowa",
    "koszt aplikacji webowej",
    "cennik aplikacji",
    "ile kosztuje system SaaS",
    "ile kosztuje MVP",
    "wycena aplikacji",
    "software house Poznań",
  ],
};

const projectRows = [
  {
    type: "Landing / prosta strona firmowa",
    timeline: "2–3 tygodnie",
    note: "Oferta, formularz kontaktowy i lokalne SEO.",
  },
  {
    type: "Rozbudowana strona / e-commerce / portal",
    timeline: "4–6 tygodni",
    note: "Panel treści (CMS), płatności, konto klienta, integracje, czasem druga wersja językowa.",
  },
  {
    type: "Aplikacja webowa / mobilna / system SaaS",
    timeline: "od 6–8 tygodni",
    note: "Role użytkowników, płatności, integracje, AI i utrzymanie po wdrożeniu. Zakres ustalamy wspólnie.",
  },
];

const factors = [
  {
    title: "Zakres funkcji i liczba ekranów",
    desc: "Każdy dodatkowy widok i każda nowa rola użytkownika to kolejne ścieżki do zaprojektowania i przetestowania.",
  },
  {
    title: "Integracje",
    desc: "Płatności (Stripe, Przelewy24), zewnętrzne API, ERP, AI/LLM, OCR. Każde takie połączenie to osobna praca, także po stronie testów.",
  },
  {
    title: "Web vs aplikacja mobilna",
    desc: "Aplikacja na iOS i Androida to dwa wydania, dwa sklepy i dwa razy więcej testów. Można zacząć od jednej platformy.",
  },
  {
    title: "Projekt UX/UI",
    desc: "Jeśli masz gotowy system designu, idzie szybciej. Projekt od zera, pod konkretną markę, wydłuża etap makiet.",
  },
  {
    title: "Termin",
    desc: "Bardzo krótki termin zwykle podnosi cenę. Przy spokojnym harmonogramie jest miejsce, żeby ją obniżyć.",
  },
  {
    title: "Utrzymanie po wdrożeniu",
    desc: "Hosting, monitoring, poprawki i dalszy rozwój liczymy osobno, zwykle w cyklu miesięcznym.",
  },
];

const faqs = [
  {
    q: "Ile kosztuje stworzenie aplikacji mobilnej?",
    a: "Koszt aplikacji mobilnej zależy od liczby ekranów, ról użytkowników, płatności i integracji. Budżet da się ograniczyć, zaczynając od jednej platformy albo od mniejszego pierwszego etapu. Wycenę z widełkami przygotowujemy po ustaleniu zakresu, bez ukrytych kosztów.",
  },
  {
    q: "Ile kosztuje strona internetowa?",
    a: "Na cenę strony wpływa liczba podstron, panel treści (CMS), integracje i wymagania SEO. Prosta wizytówka firmowa i portal z kontem klienta to dwie różne rozmowy, dlatego widełki podajemy po ustaleniu, co ma się na stronie znaleźć.",
  },
  {
    q: "Co to jest MVP i ile kosztuje?",
    a: "MVP to pierwsza działająca wersja produktu, zawężona do najważniejszych funkcji. Służy do tego, żeby sprawdzić pomysł na użytkownikach, zanim wyda się na niego cały budżet. U nas MVP powstaje zwykle w 4–8 tygodni, a koszt zależy od tego, ile funkcji trafi do tej pierwszej wersji.",
  },
  {
    q: "Czy dostanę dokładną wycenę z góry?",
    a: "Tak. Po rozmowie i makiecie dostajesz plan z etapami i widełkami, jeszcze zanim zaczniemy budowę. Pracujemy etapami, więc po każdym z nich widzisz efekt i decydujesz o kolejnym kroku.",
  },
];

const article = buildArticle({
  path: PATH,
  headline: "Ile kosztuje aplikacja lub strona? Jak to wyceniamy",
  dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
});

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Ile kosztuje aplikacja lub strona? Jak to wyceniamy - Programo",
    description:
      "Ile kosztuje aplikacja, strona lub system SaaS? Tłumaczymy, co podnosi i co obniża koszt oraz jak przygotowujemy wycenę.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    mainEntity: ref(article),
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Ile kosztuje aplikacja", path: PATH },
  ]),
  buildFaqPage(faqs),
  article,
]);

export default function IleKosztujeAplikacjiPage() {
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
        <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
          <nav
            aria-label="breadcrumb"
            className="mb-8 text-xs uppercase tracking-widest opacity-60"
          >
            <Link href="/" className="hover:underline">
              Programo
            </Link>
            <span className="mx-2">/</span>
            <span>Ile kosztuje aplikacja</span>
          </nav>

          <header className="mb-12">
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              Ile kosztuje stworzenie aplikacji lub strony?
            </h1>
            <p className="text-lg leading-relaxed opacity-85 md:text-xl">
              Na cenę wpływa przede wszystkim <strong>zakres</strong>, zaraz po nim{" "}
              <strong>integracje</strong> i <strong>termin</strong>. Ten sam pomysł da
              się zbudować na kilka sposobów, a każdy z nich kosztuje inaczej. Dlatego
              wycenę przygotowujemy <strong>indywidualnie</strong>, po krótkiej
              rozmowie. Poniżej opisujemy, co podbija koszt, a co pozwala go obniżyć.
            </p>
          </header>

          <section className="mb-14">
            <h2 className="mb-6 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Co budujemy i ile to zwykle trwa
            </h2>
            <div className="overflow-hidden rounded-2xl border border-current/15">
              {projectRows.map((row, i) => (
                <div
                  key={row.type}
                  className={`grid gap-2 p-5 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-6 ${
                    i > 0 ? "border-t border-current/15" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold">{row.type}</p>
                    <p className="mt-1 text-sm leading-relaxed opacity-70">{row.note}</p>
                  </div>
                  <p className="font-headline text-xl font-bold md:text-right">
                    {row.timeline}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm opacity-60">
              To terminy orientacyjne, konkret zależy od zakresu. Zobacz, jak
              podchodzimy do{" "}
              <Link href="/cennik" className="underline hover:opacity-100">
                wyceny
              </Link>
              .
            </p>
          </section>

          <section className="mb-14">
            <h2 className="mb-6 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Od czego zależy cena aplikacji?
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {factors.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-card p-6 shadow-card"
                >
                  <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">{f.title}</h3>
                  <p className="text-sm leading-relaxed opacity-75">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <CompactLeadForm
              bare
              formId="koszt-artykul"
              anchorId="koszt-artykul"
              projectType="Wycena z artykułu"
              heading="Zapytaj o wycenę"
            />
          </section>

          <section className="mb-14">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Ile kosztuje MVP?
            </h2>
            <p className="text-base leading-relaxed opacity-85 md:text-lg">
              MVP to wersja produktu ograniczona do{" "}
              <strong>najważniejszych funkcji</strong>. Budujesz mniej, wypuszczasz
              wcześniej i szybciej dowiadujesz się od pierwszych użytkowników, czego im
              brakuje. U nas taka wersja powstaje zwykle w{" "}
              <strong>4–8 tygodni</strong>, a jej koszt zależy od tego, ile z tych
              funkcji trafi do pierwszego wydania.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Jak wyceniamy projekty w Programo?
            </h2>
            <ol className="space-y-4 text-base leading-relaxed opacity-85 md:text-lg">
              <li>
                <strong>1. Rozmowa.</strong> Ustalamy, po co powstaje projekt, co ma
                robić i jakim budżetem dysponujesz.
              </li>
              <li>
                <strong>2. Makieta i widełki.</strong> Dostajesz plan z etapami i
                priorytetami, zanim ktokolwiek napisze linijkę kodu.
              </li>
              <li>
                <strong>3. Budowa i wdrożenie.</strong> Pracujemy etapami i po każdym
                pokazujemy działającą wersję, aż do wdrożenia produkcyjnego.
              </li>
            </ol>
          </section>

          <section className="mb-14">
            <h2 className="mb-6 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Najczęstsze pytania o koszt
            </h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">{f.q}</h3>
                  <p className="max-w-2xl leading-relaxed opacity-75">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-card p-8 shadow-card md:p-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Chcesz poznać koszt swojego projektu?
            </h2>
            <p className="mb-6 max-w-2xl opacity-80">
              Opisz w kilku zdaniach, co chcesz zbudować. Wrócimy z widełkami i
              propozycją pierwszych kroków, bezpłatnie i bez zobowiązań.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-container"
              >
                Bezpłatna wycena
              </Link>
              <Link
                href="/software-house-poznan"
                className="rounded-full border border-current/30 px-6 py-3 text-sm font-medium opacity-85 transition hover:opacity-100"
              >
                Software house Poznań
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
