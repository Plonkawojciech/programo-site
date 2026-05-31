"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

const CATEGORY_LABELS: Record<Project["category"], { pl: string; en: string }> = {
  "nasze-systemy": { pl: "Nasze systemy", en: "Our systems" },
  "strony-zrobione": { pl: "Strony", en: "Websites" },
  projekty: { pl: "Projekty", en: "Projects" },
};

function ProjectCard({
  project,
  lang,
  featured,
}: {
  project: Project;
  lang: Lang;
  featured: boolean;
}) {
  const screenshot = project.screenshots?.[0];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/40 transition-all duration-500 ease-out hover:border-primary/50 hover:shadow-2xl hover:shadow-black/30 ${
        featured
          ? "md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[520px]"
          : "min-h-[320px]"
      }`}
    >
      {/* Visual */}
      {screenshot ? (
        <Image
          src={screenshot}
          alt={project.title}
          fill
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 66vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover opacity-55 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: project.bgColor }} />
      )}

      {/* Bottom gradient for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      {/* Accent line on top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Stretched link — whole card opens project detail. */}
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${project.title} — ${project.subtitle[lang]}`}
        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      />

      {/* Top row: category + external link (sits above stretched link) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-5 md:p-6">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: project.accentColor }}
        >
          {CATEGORY_LABELS[project.category][lang]}
          <span className="text-white/50"> · {project.year}</span>
        </span>
        {project.category === "strony-zrobione" && project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <span>{lang === "pl" ? "Zobacz" : "Visit"}</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      {/* Content */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-5 md:p-7 text-white">
        <h3
          className={`font-headline font-bold tracking-tight text-white ${
            featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-2 max-w-md text-sm font-light leading-snug text-white/80 line-clamp-2">
          {project.subtitle[lang]}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();
  const containerRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const allProjects = projects;
  const categories = Array.from(new Set(allProjects.map((p) => p.category)));
  const filteredProjects = filter
    ? allProjects.filter((p) => p.category === filter)
    : allProjects;

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative bg-surface w-full"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24 py-24 md:py-32">
        {/* Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary">
              {lang === "pl" ? "Realizacje" : "Selected work"}
            </span>
            <h2 className="mt-6 font-headline text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tighter text-on-surface leading-[1.05]">
              {lang === "pl" ? "Archiwum projektów" : "Project archive"}
            </h2>
            <p className="mt-5 text-base md:text-lg font-light text-on-surface/70 leading-relaxed">
              {lang === "pl"
                ? "Wybór systemów, aplikacji i stron, które zbudowaliśmy. Najedź, aby zobaczyć szczegóły."
                : "A selection of systems, apps and sites we have built. Hover for details."}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`min-h-[40px] rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-colors cursor-pointer ${
                filter === null
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-on-surface"
              }`}
            >
              {lang === "pl" ? "Wszystkie" : "All"}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`min-h-[40px] rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-colors cursor-pointer ${
                  filter === cat
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-on-surface"
                }`}
              >
                {CATEGORY_LABELS[cat][lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(0,1fr)] gap-5 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.slug}
                project={project}
                lang={lang}
                featured={!filter && idx === 0}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer CTA */}
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-outline-variant/20 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-base md:text-lg font-light text-on-surface/70 max-w-md">
            {lang === "pl"
              ? "Masz pomysł na własny system lub aplikację?"
              : "Have an idea for your own system or app?"}
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm uppercase tracking-widest font-medium text-on-primary transition-all hover:bg-primary-container hover:gap-5"
          >
            {t("nav.cta")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
