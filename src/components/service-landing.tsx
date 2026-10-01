import Image from "next/image";
import Link from "next/link";
import CompactLeadForm from "@/components/compact-lead-form";
import { COMPANY } from "@/lib/company";
import { getProjectBySlug } from "@/lib/projects";
import {
  buildBreadcrumbs,
  buildFaqPage,
  buildService,
  buildWebPage,
  ref,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

/**
 * Shared body for the service pages added in 2026-10 (/strony-internetowe-poznan,
 * /aplikacje-mobilne-dla-firm, /aplikacje-webowe-dla-firm,
 * /wdrozenie-ga4-tracking-konwersji). Hardcoded Polish like the older SEO
 * pages; everything renders on the server so crawlers that do not run JS read
 * the whole page.
 *
 * Each page passes facts only: prices come from the /cennik table, project
 * claims from projects.ts. The component adds nothing of its own beyond
 * headings and the contact block.
 */
export type ServiceLandingData = {
  path: string;
  breadcrumb: string;
  h1: string;
  lead: string;
  /** schema.org serviceType and Service name. */
  serviceType: string;
  schemaDescription: string;
  /** "Kiedy to ma sens" — situations a buyer recognises. */
  fit: { heading: string; items: { title: string; desc: string }[] };
  /** What is in scope. */
  scope: { heading: string; intro?: string; items: { title: string; desc: string }[] };
  /** Ordered steps with a duration where we can state one. */
  process: { heading: string; steps: { title: string; desc: string }[] };
  price: { heading: string; rows: { name: string; range: string; term?: string }[]; note: string };
  /** Case studies: slug from projects.ts plus one sentence on what is relevant here. */
  work: { heading: string; items: { slug: string; relevance: string }[] };
  faqs: { q: string; a: string }[];
  /** Other pages worth reading next. */
  related: { href: string; label: string }[];
  form: { formId: string; projectType: string; heading: string };
};

export function buildServiceLandingGraph(data: ServiceLandingData): string {
  const service = buildService({
    path: data.path,
    serviceType: data.serviceType,
    name: data.h1,
    description: data.schemaDescription,
  });
  return renderGraph([
    buildWebPage({
      path: data.path,
      name: data.h1,
      description: data.schemaDescription,
      dateModified: STATIC_ROUTE_UPDATED_AT[data.path],
      mainEntity: ref(service),
    }),
    buildBreadcrumbs([
      { name: "Programo", path: "/" },
      { name: data.breadcrumb, path: data.path },
    ]),
    service,
    buildFaqPage(data.faqs),
  ]);
}

const h2 = "mb-6 font-headline text-2xl font-semibold tracking-tight text-balance md:mb-8 md:text-4xl";
const card = "rounded-2xl bg-card p-6 shadow-card";

export default function ServiceLanding({ data }: { data: ServiceLandingData }) {
  const contactHref = `#${data.form.formId}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildServiceLandingGraph(data) }} />

      {/* No <main> here — the root layout already wraps every page in one. */}
      <div className="min-h-screen bg-surface text-on-surface">
        <article className="mx-auto max-w-5xl px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36">
          <nav aria-label="breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-on-surface-variant">
            <Link href="/" className="inline-flex min-h-11 items-center hover:underline">
              Programo
            </Link>
            <span className="mx-2">/</span>
            <span>{data.breadcrumb}</span>
          </nav>

          <header className="mb-16 md:mb-20">
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-balance md:text-6xl">
              {data.h1}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-on-surface-variant text-pretty md:text-xl">{data.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={contactHref}
                className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Poproś o wycenę
              </a>
              <a
                href={`tel:${COMPANY.phone}`}
                className="inline-flex min-h-12 items-center rounded-full border border-on-surface/30 px-7 py-3 text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-primary"
              >
                Zadzwoń: {COMPANY.phoneDisplay}
              </a>
            </div>
          </header>

          <section className="mb-16 md:mb-20">
            <h2 className={h2}>{data.fit.heading}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {data.fit.items.map((item) => (
                <div key={item.title} className={card}>
                  <h3 className="mb-2 font-headline text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 md:mb-20">
            <h2 className={h2}>{data.scope.heading}</h2>
            {data.scope.intro && (
              <p className="mb-8 max-w-3xl text-base leading-relaxed text-on-surface-variant md:text-lg">{data.scope.intro}</p>
            )}
            <dl className="divide-y divide-outline-variant/40 border-y border-outline-variant/40">
              {data.scope.items.map((item) => (
                <div key={item.title} className="grid gap-2 py-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:gap-10 md:py-6">
                  <dt className="font-headline text-lg font-bold tracking-tight">{item.title}</dt>
                  <dd className="text-sm leading-relaxed text-on-surface-variant md:text-base">{item.desc}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mb-16 md:mb-20">
            <h2 className={h2}>{data.process.heading}</h2>
            <ol className="grid gap-5 md:grid-cols-2">
              {data.process.steps.map((step, index) => (
                <li key={step.title} className={card}>
                  <span className="font-headline text-sm font-bold tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mb-2 mt-2 font-headline text-xl font-bold tracking-tight">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">{step.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16 md:mb-20">
            <h2 className={h2}>{data.price.heading}</h2>
            <div className="overflow-hidden rounded-2xl bg-card shadow-card">
              {data.price.rows.map((row) => (
                <div
                  key={row.name}
                  className="flex flex-col gap-1 border-b border-outline-variant/30 px-5 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 md:px-7 md:py-5"
                >
                  <div>
                    <p className="font-medium text-on-surface">{row.name}</p>
                    {row.term && <p className="text-sm text-on-surface-variant">Termin: {row.term}</p>}
                  </div>
                  <p className="shrink-0 font-headline text-lg font-bold tabular-nums tracking-tight">{row.range}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
              {data.price.note}{" "}
              <Link href="/cennik" className="font-medium text-primary underline underline-offset-4">
                Pełny cennik i zasady wyceny
              </Link>
              .
            </p>
          </section>

          <section className="mb-16 md:mb-20">
            <h2 className={h2}>{data.work.heading}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {data.work.items.map(({ slug, relevance }) => {
                const project = getProjectBySlug(slug);
                if (!project) return null;
                const shot = project.screenshots?.find((s) => s.includes("desktop")) ?? project.screenshots?.[0];
                return (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {shot && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-low">
                        <Image
                          src={shot}
                          alt={`${project.title} - zrzut ekranu realizacji`}
                          fill
                          sizes="(max-width: 768px) 100vw, 460px"
                          className="object-cover object-top"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-headline text-xl font-bold tracking-tight group-hover:underline">{project.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant md:text-base">{relevance}</p>
                      <span className="mt-4 text-sm font-medium text-primary">Zobacz opis realizacji →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mb-16 md:mb-20">
            <h2 className={h2}>Najczęstsze pytania</h2>
            <div className="max-w-3xl divide-y divide-outline-variant/40 border-y border-outline-variant/40">
              {data.faqs.map((faq) => (
                <div key={faq.q} className="py-5 md:py-6">
                  <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <nav aria-label="Zobacz też" className="mb-4">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">Zobacz też</h2>
            <ul className="flex flex-wrap gap-2">
              {data.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-full border border-outline-variant/60 px-5 py-2 text-sm text-on-surface transition-colors hover:border-primary hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>

        <CompactLeadForm formId={data.form.formId} projectType={data.form.projectType} heading={data.form.heading} />
      </div>
    </>
  );
}
