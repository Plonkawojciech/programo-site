"use client";

import Image from "next/image";
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
// marker means something instead of decorating every tile identically.
const statusDot: Record<ProjectStatus, string> = {
  live: "bg-primary",
  development: "bg-on-surface-variant",
  "coming-soon": "bg-outline",
  planned: "bg-outline",
};

export default function OwnProducts() {
  const { t } = useI18n();

  // Status and screenshot are read from projects.ts so this listing can never
  // drift out of sync with the project pages. The guard also means renaming a
  // slug in projects.ts drops the tile instead of crashing the homepage — today
  // all five resolve.
  const entries = ORDER.flatMap((entry) => {
    const project = projects.find((p) => p.slug === entry.slug);
    if (!project) return [];
    return [{ ...entry, status: project.status, shot: project.screenshots?.[0] }];
  });

  return (
    <section className="relative bg-surface-dim py-section-tight">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <h2 className="font-headline text-h2 font-semibold tracking-tight text-on-surface text-balance [font-stretch:110%]">
            {t("home.products.title.v2")}
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead leading-relaxed text-on-surface-variant text-pretty">
            {t("home.products.subtitle.v2")}
          </p>
        </div>
      </div>

      {/* ── Tile row ─────────────────────────────────────────────
          Deliberately the quieter sibling of the ClientWork rail above: small
          tiles, caption underneath the image instead of over it. Same room, two
          voices — the client work is the pitch, this is the evidence that we
          build for ourselves too.

          Full-bleed and scrollable up to `lg`, a five-column grid above it.
          Five products fit a 1400px container at ~230px each, which is exactly
          where a screenshot stops being readable, so the grid stops there and
          does not try to also serve 6 or 7 tiles later. */}
      {/* `scroll-px-*` has to mirror `px-*`. A snap container aligns to its
          SNAPPORT, which ignores padding unless scroll-padding says otherwise —
          without it the browser parks the first tile flush against the screen
          edge on load, one gutter to the left of the heading above it. */}
      <div className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 md:mt-12 md:gap-5 md:scroll-px-12 md:px-12 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-24">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/projects/${entry.slug}`}
            className="group w-[62vw] shrink-0 snap-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 sm:w-[38vw] md:w-[30vw] lg:w-auto"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-card shadow-card transition-shadow duration-300 group-hover:shadow-card-hover">
              {entry.shot && (
                <Image
                  src={entry.shot}
                  alt={entry.name}
                  fill
                  sizes="(max-width: 640px) 62vw, (max-width: 1024px) 30vw, 230px"
                  className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              )}
            </div>

            <h3 className="mt-3.5 font-headline text-lg font-semibold tracking-tight text-on-surface">
              {entry.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-on-surface-variant text-pretty">
              {t(entry.descKey)}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 rounded-full ${statusDot[entry.status]}`}
              />
              {t(statusKey[entry.status])}
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-[1400px] justify-center px-6 md:px-12 lg:px-24">
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
    </section>
  );
}
