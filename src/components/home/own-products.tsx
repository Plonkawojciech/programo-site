"use client";

import Link from "next/link";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { projects, type ProjectStatus } from "@/lib/projects";

interface ProductEntry {
  slug: string;
  name: string;
  descKey: TranslationKey;
}

// Every project in projects.ts with `category: "produkty"`, ordered by how much
// there is to show: shipped products first, then the ones still being built,
// then the one that has not launched. Names mirror each project's `title` so
// this listing reads the same as the project page it links to.
const ORDER: ProductEntry[] = [
  { slug: "estalo", name: "Estalo", descKey: "home.products.estalo.desc" },
  { slug: "rejestr-pro", name: "Rejestr Pro", descKey: "home.products.rejestr.desc" },
  { slug: "solvio", name: "Solvio", descKey: "home.products.solvio.desc" },
  { slug: "pooltimer", name: "PoolTimer", descKey: "home.products.pooltimer.desc" },
  { slug: "eportal-prawny", name: "ePortal Prawny", descKey: "home.products.eportal.desc" },
];

const statusKey: Record<ProjectStatus, TranslationKey> = {
  live: "work.live",
  development: "work.inDevelopment",
  // "coming-soon" and "planned" both mean "not usable yet" to a visitor, so
  // they share one label rather than inventing a distinction nobody can act on.
  "coming-soon": "work.comingSoon",
  planned: "work.comingSoon",
};

// Only "live" carries the accent. Anything unfinished gets a muted dot, so the
// marker means something instead of decorating every row identically.
const statusDot: Record<ProjectStatus, string> = {
  live: "bg-primary",
  development: "bg-on-surface-variant",
  "coming-soon": "bg-outline",
  planned: "bg-outline",
};

export default function OwnProducts() {
  const { t } = useI18n();

  // Status is read from projects.ts so this listing can never drift out of sync
  // with the project pages. The guard also means renaming a slug in projects.ts
  // drops the row instead of crashing the homepage — today all five resolve.
  const entries = ORDER.flatMap((entry) => {
    const project = projects.find((p) => p.slug === entry.slug);
    return project ? [{ ...entry, status: project.status }] : [];
  });

  return (
    <section className="relative bg-surface-dim py-section-tight">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* ── Section heading ──────────────────────────────────── */}
        <div className="max-w-2xl">
          <h2 className="font-headline text-h2 font-semibold tracking-tight text-on-surface text-balance [font-stretch:110%]">
            {t("home.products.title.v2")}
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead leading-relaxed text-on-surface-variant text-pretty">
            {t("home.products.subtitle.v2")}
          </p>
        </div>

        {/* ── Product listing ─────────────────────────────────── */}
        <ul className="mt-10 flex flex-col" role="list">
          {entries.map((entry, i) => {
            return (
              <li
                key={entry.slug}
                className={
                  i > 0
                    ? "border-t border-outline-variant"
                    : ""
                }
              >
                <Link
                  href={`/projects/${entry.slug}`}
                  className="group flex flex-col gap-2 py-5 transition-colors sm:flex-row sm:items-baseline sm:gap-6 md:py-6"
                >
                  {/* Name */}
                  <h3 className="shrink-0 font-headline text-h4 font-semibold tracking-tight text-on-surface sm:w-40 md:w-48">
                    {entry.name}
                  </h3>

                  {/* Description */}
                  <p className="flex-1 text-base leading-relaxed text-on-surface-variant text-pretty">
                    {t(entry.descKey)}
                  </p>

                  {/* Status + arrow */}
                  <span className="flex shrink-0 items-center gap-3 text-sm text-on-surface-variant sm:ml-auto">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className={`inline-block h-1.5 w-1.5 rounded-full ${statusDot[entry.status]}`}
                      />
                      {t(statusKey[entry.status])}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-on-surface-variant transition-transform duration-300 ease-out group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── View all link ───────────────────────────────────── */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/projekty"
            className="group inline-flex items-center gap-3 rounded-full border border-outline px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            {t("home.products.viewAll")}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
