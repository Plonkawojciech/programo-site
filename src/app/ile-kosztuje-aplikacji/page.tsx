import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ile kosztuje aplikacja lub strona? Jak to wyceniamy — Programo",
  description:
    "Ile kosztuje stworzenie aplikacji, strony lub systemu SaaS? Wyjaśniamy, co realnie wpływa na koszt i jak wygląda nasza indywidualna wycena. Software house Programo z Poznania.",
  alternates: { canonical: "https://programo.pl/ile-kosztuje-aplikacji" },
  openGraph: {
    title: "Ile kosztuje aplikacja lub strona? Jak to wyceniamy — Programo",
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
    note: "Oferta, formularz kontaktowy, SEO lokalne, szybkie wdrożenie.",
  },
  {
    type: "Rozbudowana strona / e-commerce / portal",
    timeline: "4–6 tygodni",
    note: "Panel treści (CMS), integracje, płatności, konto klienta, wielojęzyczność.",
  },
  {
    type: "Aplikacja webowa / mobilna / system SaaS",
    timeline: "od 6–8 tygodni",
    note: "Role, płatności, integracje, AI, utrzymanie — zakres ustalamy wspólnie.",
  },
];

const factors = [
  {
    title: "Zakres funkcji i liczba ekranów",
    desc: "Im więcej widoków, ról użytkowników i logiki biznesowej, tym większy nakład pracy.",
  },
  {
    title: "Integracje",
    desc: "Płatności (Stripe, Przelewy24), API zewnętrzne, ERP, AI/LLM, OCR — każda integracja to dodatkowy czas.",
  },
  {
    title: "Web vs aplikacja mobilna",
    desc: "Aplikacja na iOS i Android (lub wspólny kod Capacitor) to więcej testów i wdrożeń niż sama strona.",
  },
  {
    title: "Projekt UX/UI",
    desc: "Gotowy system designu przyspiesza pracę; projekt od zera pod markę wydłuża etap projektowy.",
  },
  {
    title: "Termin",
    desc: "Bardzo krótki deadline zwykle podnosi koszt; spokojny harmonogram pozwala go optymalizować.",
  },
  {
    title: "Utrzymanie po wdrożeniu",
    desc: "Hosting, monitoring, poprawki i rozwój to osobny, zwykle miesięczny koszt.",
  },
];

const faqs = [
  {
    q: "Ile kosztuje stworzenie aplikacji mobilnej?",
    a: "Koszt zależy od zakresu: liczby ekranów, ról, płatności i integracji. Najtaniej wychodzi wspólny kod web + mobile (Capacitor/PWA). Każdą aplikację wyceniamy indywidualnie po ustaleniu zakresu — z konkretnymi widełkami i bez ukrytych kosztów.",
  },
  {
    q: "Ile kosztuje strona internetowa?",
    a: "Koszt zależy od zakresu — liczby podstron, panelu treści (CMS), integracji i wymagań SEO. Nie pracujemy z cennikiem z półki: po krótkiej rozmowie przygotowujemy konkretną, indywidualną wycenę z widełkami.",
  },
  {
    q: "Co to jest MVP i ile kosztuje?",
    a: "MVP to pierwsza, działająca wersja produktu z najważniejszymi funkcjami — pozwala szybko zweryfikować pomysł na rynku. Zwykle powstaje w 4–8 tygodni, a jego koszt zależy od zakresu, więc wyceniamy go indywidualnie.",
  },
  {
    q: "Czy dostanę dokładną wycenę z góry?",
    a: "Tak. Po krótkiej rozmowie i makiecie przedstawiamy konkretny plan z etapami i widełkami, zanim zaczniemy budowę. Pracujemy etapami, więc masz kontrolę nad budżetem.",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Programo", item: "https://programo.pl" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Ile kosztuje aplikacja",
      item: "https://programo.pl/ile-kosztuje-aplikacji",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Ile kosztuje aplikacja lub strona? Jak to wyceniamy",
  inLanguage: "pl-PL",
  author: { "@id": "https://programo.pl/#organization" },
  publisher: { "@id": "https://programo.pl/#organization" },
  mainEntityOfPage: "https://programo.pl/ile-kosztuje-aplikacji",
};

export default function IleKosztujeAplikacjiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <main className="min-h-screen bg-[var(--theme-bg-1,#051F20)] text-[var(--theme-text-1,#DAF1DE)]">
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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] opacity-60">
              Wycena · Software house Poznań
            </p>
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              Ile kosztuje stworzenie aplikacji lub strony?
            </h1>
            <p className="text-lg leading-relaxed opacity-85 md:text-xl">
              Krótko: koszt zależy od trzech rzeczy — <strong>zakresu</strong>,{" "}
              <strong>integracji</strong> i <strong>terminu</strong>. Dlatego nie mamy
              sztywnego cennika z półki, tylko każdy projekt wyceniamy{" "}
              <strong>indywidualnie</strong> po krótkiej rozmowie. Niżej tłumaczymy, co
              konkretnie wpływa na cenę i jak wygląda nasza wycena.
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
              Orientacyjne terminy — każdy projekt wyceniamy zawsze indywidualnie.
              Zobacz, jak podchodzimy do{" "}
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
                <div key={f.title} className="rounded-2xl border border-current/15 p-6">
                  <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed opacity-75">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Ile kosztuje MVP?
            </h2>
            <p className="text-base leading-relaxed opacity-85 md:text-lg">
              MVP to pierwsza działająca wersja produktu z najważniejszymi funkcjami —
              pozwala szybko sprawdzić pomysł na rynku bez budowania od razu całego
              systemu. W Programo MVP powstaje zwykle w <strong>4–8 tygodni</strong>, a
              jego koszt zależy od zakresu, więc wyceniamy go{" "}
              <strong>indywidualnie</strong>. To najtańszy sposób, by ruszyć i zacząć
              zbierać realny feedback od użytkowników.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Jak wyceniamy projekty w Programo?
            </h2>
            <ol className="space-y-4 text-base leading-relaxed opacity-85 md:text-lg">
              <li>
                <strong>1. Krótka rozmowa</strong> — ustalamy cel, zakres, ryzyka i
                budżet.
              </li>
              <li>
                <strong>2. Makieta i widełki</strong> — dostajesz konkretny plan z
                etapami i priorytetami, zanim zaczniemy kodować.
              </li>
              <li>
                <strong>3. Budowa i wdrożenie</strong> — projektujemy, kodujemy,
                testujemy i wypuszczamy produkcyjnie, etapami.
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
                  <h3 className="mb-2 text-lg font-semibold">{f.q}</h3>
                  <p className="leading-relaxed opacity-75">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-current/15 p-8 md:p-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Chcesz poznać koszt swojego projektu?
            </h2>
            <p className="mb-6 max-w-2xl opacity-80">
              Opisz pomysł w dwie minuty — wrócimy z konkretnymi widełkami i propozycją
              pierwszych kroków. Bezpłatnie i bez zobowiązań.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-[var(--theme-accent,#235347)] px-6 py-3 text-sm font-semibold text-[var(--theme-bg-1,#051F20)] transition hover:opacity-90"
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
      </main>
    </>
  );
}
