import type { Metadata } from "next";
import Link from "next/link";
import AuditClient from "./AuditClient";

export const metadata: Metadata = {
  title: "Darmowy audyt strony www — Programo | Sprawdź wydajność, SEO i mobilność",
  description:
    "Darmowy audyt cyfrowy Twojej firmy. Wpisz adres strony i w 30 sekund sprawdź wydajność, mobilność, SEO, bezpieczeństwo i obecność online. Raport + plan naprawy od software house Programo.",
  alternates: { canonical: "https://programo.pl/audyt" },
  openGraph: {
    title: "Darmowy audyt strony www — Programo",
    description:
      "Sprawdź swoją stronę w 30 sekund: wydajność, mobilność, SEO, bezpieczeństwo. Darmowy raport + plan naprawy.",
    url: "https://programo.pl/audyt",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
  keywords: [
    "darmowy audyt strony",
    "audyt strony www",
    "test strony internetowej",
    "audyt SEO",
    "audyt wydajności strony",
    "sprawdź swoją stronę",
    "audyt cyfrowy firmy",
    "PageSpeed test",
    "software house Poznań",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Programo", item: "https://programo.pl" },
    { "@type": "ListItem", position: 2, name: "Darmowy audyt strony", item: "https://programo.pl/audyt" },
  ],
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Programo Audyt",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://programo.pl/audyt",
  description:
    "Darmowe narzędzie do audytu strony www: wydajność, mobilność, SEO, bezpieczeństwo i obecność online.",
  provider: { "@id": "https://programo.pl/#organization" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
};

const checks = [
  { icon: "⚡", title: "Wydajność", desc: "Szybkość ładowania (Google Lighthouse) — wolna strona = utracone konwersje." },
  { icon: "📱", title: "Mobilność", desc: "Czy strona dobrze działa na telefonie, gdzie jest większość ruchu." },
  { icon: "🔍", title: "SEO", desc: "Tytuły, opisy, nagłówki, dane strukturalne — czy Google Cię widzi." },
  { icon: "🔒", title: "Bezpieczeństwo", desc: "HTTPS i nagłówki bezpieczeństwa — zaufanie i pozycja w Google." },
  { icon: "✨", title: "Obecność i UX", desc: "Podgląd w social mediach, PWA, favicon — jak wyglądasz na zewnątrz." },
];

const deliverables = [
  { title: "Wynik 0–100", desc: "Natychmiastowa, obiektywna ocena 5 obszarów Twojej strony." },
  { title: "Konkretne braki", desc: "Lista tego, co działa, a co tracisz — bez ogólników." },
  { title: "Plan naprawy + wycena", desc: "Pełny raport z krokami i kosztem — co da największy efekt najszybciej." },
];

export default function AudytPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      <main className="min-h-screen bg-[var(--theme-bg-1)] text-[var(--theme-text-1)]">
        <article className="mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-20">
          <nav aria-label="breadcrumb" className="mb-10 text-xs uppercase tracking-widest opacity-60">
            <Link href="/" className="hover:underline">Programo</Link>
            <span className="mx-2">/</span>
            <span>Darmowy audyt</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] opacity-60">
              Darmowe narzędzie · Programo
            </p>
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              Sprawdź, ile klientów traci Twoja strona
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed opacity-80 md:text-xl">
              Wpisz adres strony i w ~30 sekund dostań ocenę wydajności, mobilności,
              SEO, bezpieczeństwa i obecności online. Za darmo, bez logowania.
            </p>
          </header>

          {/* The tool */}
          <section className="mb-20 rounded-3xl border border-current/15 bg-[rgba(var(--theme-text-1-rgb),0.02)] p-6 md:p-10">
            <AuditClient />
          </section>

          {/* What we check */}
          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Co sprawdzamy
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {checks.map((c) => (
                <div key={c.title} className="rounded-2xl border border-current/15 p-6">
                  <div className="mb-3 text-2xl">{c.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm leading-relaxed opacity-75">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What you get */}
          <section className="mb-16">
            <h2 className="mb-8 font-headline text-2xl font-semibold tracking-tight md:text-4xl">
              Co dostajesz
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {deliverables.map((d, i) => (
                <div key={d.title} className="rounded-2xl border border-current/15 p-6">
                  <div className="mb-3 font-headline text-3xl font-bold opacity-30">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{d.title}</h3>
                  <p className="text-sm leading-relaxed opacity-75">{d.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trust / CTA */}
          <section className="rounded-3xl border border-current/15 p-8 md:p-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              Audyt to dopiero początek
            </h2>
            <p className="mb-6 max-w-2xl opacity-80">
              Programo to software house z Poznania. Naprawiamy to, co audyt wykryje —
              od szybkiej strony, przez sklep, po system SaaS i aplikację mobilną.
              Zobacz nasze realizacje (np. sklep mobilny iOS + Android dla Jedmar).
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-full bg-[var(--theme-accent)] px-6 py-3 text-sm font-semibold text-[var(--theme-bg-1)] transition hover:opacity-90"
              >
                Zobacz portfolio
              </Link>
              <a
                href="mailto:biuro@programo.pl"
                className="rounded-full border border-current/30 px-6 py-3 text-sm font-medium opacity-80 transition hover:opacity-100"
              >
                biuro@programo.pl
              </a>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
