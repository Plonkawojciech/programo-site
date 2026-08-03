"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import PhoneFrame from "@/components/ui/phone-frame";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project, ProjectStatus } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";
import { trackPortfolioClick } from "@/lib/tracking";

// Fixed filter order — independent of the order projects appear in the data.
const FILTERS: { key: Project["category"] | null; label: { pl: string; en: string } }[] = [
  { key: null, label: { pl: "Wszystkie", en: "All" } },
  { key: "produkty", label: { pl: "Produkty Programo", en: "Programo products" } },
  { key: "dla-klientow", label: { pl: "Dla klientów", en: "Client work" } },
  { key: "marketing", label: { pl: "Tracking i reklamy", en: "Tracking & ads" } },
];

const CATEGORY_LABELS: Record<Project["category"], { pl: string; en: string }> = {
  produkty: { pl: "Produkty Programo", en: "Programo products" },
  "dla-klientow": { pl: "Dla klientów", en: "Client work" },
  marketing: { pl: "Tracking i reklamy", en: "Tracking & ads" },
};

// General status badge shown on cards. The detailed `statusLabel` lives on the
// project detail page (per content deck §10).
const STATUS_LABELS: Record<ProjectStatus, { pl: string; en: string }> = {
  live: { pl: "Live", en: "Live" },
  development: { pl: "W rozwoju", en: "In development" },
  "coming-soon": { pl: "Wkrótce", en: "Coming soon" },
  planned: { pl: "Planowany", en: "Planned" },
};

// Best phone screenshot for a mobile-app card: prefer an actual app screen, then
// the mobile web capture, then anything.
function phoneShot(project: Project): string | undefined {
  const shots = project.screenshots ?? [];
  return shots.find((s) => /-app[-\d]/.test(s)) ?? shots.find((s) => /mobile/.test(s)) ?? shots[0];
}

// Small overlay pill with the real domain — keeps the "this is live" trust cue
// without repeating a fake browser chrome on every card.
function DomainPill({ url }: { url: string }) {
  const host = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return (
    // black/55 + white/90 measured 4.2:1 over a white screenshot, under the 4.5:1
    // this 10px text needs. black/70 composites to #4D4D4D and carries white at 8.4:1.
    <span className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
      </svg>
      {host}
    </span>
  );
}

function CardMedia({ project }: { project: Project }) {
  const darkCard = project.presentation === "dark" || project.presentation === "mosaic";
  const canvasStyle = darkCard
    ? { backgroundColor: project.bgColor }
    : {
        background: `linear-gradient(150deg, ${project.accentColor}1f 0%, ${project.accentColor}0a 55%, transparent 100%)`,
      };

  if (project.kind === "mobile-app") {
    const src = phoneShot(project);
    return (
      <div
        className="relative flex h-[230px] items-start justify-center overflow-hidden rounded-t-2xl pt-7 sm:h-[250px] md:h-[270px]"
        style={{
          background: `radial-gradient(130% 90% at 50% 0%, ${project.accentColor}2e, transparent 72%)`,
        }}
      >
        {src && (
          <div className="w-[46%] max-w-[150px] shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
            <PhoneFrame src={src} alt={project.title} fadeBottom ownStatusBar={/-app[-\d]/.test(src)} />
          </div>
        )}
        {project.liveUrl && <DomainPill url={project.liveUrl} />}
      </div>
    );
  }

  const desktop = project.screenshots?.[0];
  // Clean screenshot panel on a per-project canvas: offset down-right so the
  // crop reads as a deliberate diagonal peek, no fake browser chrome.
  return (
    <div
      className={`relative h-[230px] overflow-hidden rounded-t-2xl sm:h-[250px] md:h-[270px] ${
        darkCard ? "" : "bg-surface-container-high/40"
      }`}
      style={canvasStyle}
    >
      {desktop && (
        <div className="absolute left-[7%] right-[-5%] top-[13%] overflow-hidden rounded-lg border border-black/10 shadow-[0_10px_30px_-8px_rgba(5,31,32,0.35)] transition-transform duration-500 ease-out group-hover:-translate-y-2 dark:border-white/10">
          <Image
            src={desktop}
            alt={project.title}
            width={1440}
            height={900}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 430px"
            className="h-auto w-full"
          />
        </div>
      )}
      {project.liveUrl && <DomainPill url={project.liveUrl} />}
    </div>
  );
}

function ProjectCard({ project, lang }: { project: Project; lang: Lang }) {
  const primaryMetric = project.metrics?.[0];
  const meta = project.client ?? project.scope;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        onClick={() => trackPortfolioClick(project.slug, `/projects/${project.slug}`)}
        aria-label={`${project.title} — ${project.subtitle[lang]}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {/* Accent line */}
        <span
          className="h-1 w-full shrink-0"
          style={{ backgroundColor: project.accentColor }}
          aria-hidden="true"
        />

        <CardMedia project={project} />

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              {CATEGORY_LABELS[project.category][lang]}
              <span className="text-on-surface-variant/50"> · {project.year}</span>
            </span>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${
                project.status === "live"
                  ? "border-primary/40 text-primary"
                  : "border-outline-variant/60 text-on-surface-variant"
              }`}
            >
              {STATUS_LABELS[project.status][lang]}
            </span>
          </div>

          <h3 className="mt-3 font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-2 text-sm font-light leading-snug text-on-surface/70">
            {project.subtitle[lang]}
          </p>

          {primaryMetric && (
            <p className="mt-4 flex items-baseline gap-2">
              <span className="font-headline text-xl font-bold text-primary md:text-2xl">
                {primaryMetric.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                {primaryMetric.label[lang]}
              </span>
            </p>
          )}

          {meta && (
            <p className="mt-3 text-xs font-light leading-snug text-on-surface-variant">
              {meta[lang]}
            </p>
          )}

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-outline-variant/50 bg-surface px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<Project["category"] | null>(null);

  const filtered = filter ? projects.filter((p) => p.category === filter) : projects;

  return (
    <section id="work" className="relative w-full bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32 lg:px-24">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary md:text-xs">
              {lang === "pl" ? "Portfolio" : "Portfolio"}
            </span>
            {/* This section is the /projekty route's only content, so it owns the page h1. */}
            <h1 className="mt-6 font-headline text-4xl font-bold leading-[1.05] tracking-tight text-on-surface md:text-6xl 2xl:text-7xl">
              {lang === "pl" ? "Wybrane realizacje" : "Selected work"}
            </h1>
            <p className="mt-5 text-base font-light leading-relaxed text-on-surface/70 md:text-lg">
              {lang === "pl"
                ? "Uczciwie rozdzielone: nasze własne produkty i praca dla klientów. Każdy projekt możesz kliknąć i sprawdzić."
                : "Honestly separated: our own products and client work. Every project is one click away from verification."}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key ?? "all"}
                type="button"
                onClick={() => setFilter(key)}
                className={`min-h-[40px] cursor-pointer rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-colors ${
                  filter === key
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-on-surface"
                }`}
              >
                {label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} lang={lang} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer CTA */}
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-outline-variant/20 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-base font-light text-on-surface/70 md:text-lg">
            {lang === "pl"
              ? "Masz pomysł na własny system lub aplikację?"
              : "Have an idea for your own system or app?"}
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:gap-5 hover:bg-primary-container"
          >
            {t("nav.cta")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
