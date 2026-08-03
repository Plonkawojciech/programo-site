"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects, type Project } from "@/lib/projects";
import { trackPortfolioClick } from "@/lib/tracking";
import Reveal from "@/components/ui/reveal";

// Curated, ordered subset shown in the homepage strip. Order matters visually.
const MARQUEE_SLUGS = [
  "estalo",
  "solvio",
  "rejestr-pro",
  "pooltimer",
  "jedmar",
  "wks-poznan",
  "wsafefinanse",
];

function getMarqueeProjects(): Project[] {
  return MARQUEE_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => Boolean(p)
  );
}

function ProjectTile({ project }: { project: Project }) {
  const { lang } = useI18n();
  const screenshot = project.screenshots?.[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() => trackPortfolioClick(project.slug, `/projects/${project.slug}`)}
      className="group relative aspect-[4/3] w-[80vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/40 sm:w-[360px] md:w-[380px] md:card-hover lg:w-[440px]"
      aria-label={`${project.title} — ${project.subtitle[lang]}`}
    >
      {screenshot ? (
        <Image
          src={screenshot}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 380px, 440px"
          className="object-cover object-top opacity-70 transition-all duration-500 ease-out md:group-hover:scale-105 md:group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: project.bgColor }} />
      )}

      {/* Bottom scrim — the tile's copy sits on a photograph, so this is what
          buys the contrast ratio. Sized for the worst case: a screenshot that
          is pure white behind the text and hovered (image at opacity-100). At
          black/75 that composites to #404040, which carries the copy at 7.3:1. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/75 to-transparent" />

      {/* Accent line on top */}
      <div
        className="absolute left-0 right-0 top-0 h-1 opacity-80"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Status badge for non-live projects */}
      {project.status !== "live" && (
        <span className="absolute right-4 top-4 z-20 rounded-full border border-white/30 bg-black/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          {lang === "pl" ? "Wkrótce" : "Coming soon"}
        </span>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-7">
        <div className="mb-2 flex items-center gap-2">
          {/* Tag label uses a fixed brand mint instead of each project's own
              accentColor — per-project accents (yellow, blue...) read as
              off-palette noise when used as a tag chip. This tile always sits
              on the same dark gradient regardless of site theme (like the
              white title/status-badge text below), so the color is fixed
              rather than the theme-reactive --color-primary token, which
              turns dark green in light mode and would lose contrast here. */}
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8EB69B]">
            {project.tags[0] ?? project.category}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/80">
            · {project.year}
          </span>
        </div>
        <h3 className="font-headline text-3xl font-bold tracking-tighter text-white md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm font-light leading-snug text-white/80 md:text-base">
          {project.subtitle[lang]}
        </p>
        {project.metric && (
          <p
            className="mt-3 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-wider md:text-xs"
            style={{ color: project.accentColor }}
          >
            <span aria-hidden="true">▸</span>
            {project.metric[lang]}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function ProjectsMarquee() {
  const { t } = useI18n();
  const items = getMarqueeProjects();

  if (items.length === 0) return null;

  return (
    <section
      // No `id="realizacje"` here: every page that renders this component also
      // declares that anchor at the point it actually wants the jump to land.
      // Duplicating it made the document invalid and the target ambiguous.
      aria-labelledby="realizations-heading"
      className="relative overflow-hidden border-t border-outline-variant/20 bg-surface py-24 md:py-32 lg:py-40"
    >
      {/* Self-contained CSS-keyframes marquee: pauses on hover, static when the
          visitor prefers reduced motion. No JS animation loop. */}
      <style>{`
        @keyframes pmScroll { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        .pm-track { width: max-content; animation: pmScroll 60s linear infinite; will-change: transform; }
        .pm-viewport:hover .pm-track,
        .pm-viewport:focus-within .pm-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .pm-track { animation: none; } }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary md:text-xs">
              {t("realizations.label")}
            </span>
            <h2
              id="realizations-heading"
              className="mt-6 font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-6xl 2xl:text-7xl"
            >
              {t("realizations.title")}
            </h2>
            <p className="mt-4 max-w-xl text-base font-light text-on-surface/70 md:text-lg">
              {t("realizations.subtitle")}
            </p>
          </Reveal>

          <Link
            href="/projekty"
            className="hidden items-center gap-3 text-sm font-medium uppercase tracking-widest text-on-surface transition-all hover:gap-5 hover:text-primary md:inline-flex"
          >
            {t("realizations.viewAll")} <span>→</span>
          </Link>
        </div>
      </div>

      {/* MOBILE: native swipeable horizontal scroll with snap */}
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
          {items.map((project) => (
            <ProjectTile key={project.slug} project={project} />
          ))}
          {/* Trailing spacer so last tile can snap to centre */}
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* DESKTOP: CSS-keyframes auto-scroll marquee */}
      <div className="pm-viewport relative hidden w-full md:block">
        {/* Side fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent md:w-32" />

        <div className="pm-track flex gap-5 py-6 md:gap-7">
          {/* Duplicated twice for a seamless loop */}
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-5 md:gap-7" aria-hidden={dup === 1}>
              {items.map((project) => (
                <ProjectTile key={`${dup}-${project.slug}`} project={project} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-only "view all" link */}
      <div className="mx-auto mt-10 max-w-[1400px] px-6 md:hidden">
        <Link
          href="/projekty"
          className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-on-surface transition-all hover:text-primary"
        >
          {t("realizations.viewAll")} <span>→</span>
        </Link>
      </div>
    </section>
  );
}
