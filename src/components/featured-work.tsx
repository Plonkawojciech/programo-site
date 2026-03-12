"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project, ProjectStatus } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function getSvgPattern(project: Project): React.ReactNode {
  switch (project.slug) {
    case "estalo":
      return (
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 300">
          <defs>
            <pattern id="grid-estalo" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="none" />
              <path d="M40 0L0 40" stroke={project.accentColor} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid-estalo)" />
        </svg>
      );
    case "baulx":
      return (
        <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 400 300">
          <defs>
            <pattern id="hex-baulx" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon points="30,2 56,15 56,37 30,50 4,37 4,15" fill="none" stroke={project.accentColor} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#hex-baulx)" />
        </svg>
      );
    case "baulx-sell":
      return (
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 300">
          <defs>
            <pattern id="cross-baulxsell" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M16 8v16M8 16h16" stroke={project.accentColor} strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#cross-baulxsell)" />
        </svg>
      );
    case "estalo-portal":
      return (
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 300">
          <defs>
            <pattern id="diamond-portal" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M18 4L32 18L18 32L4 18Z" stroke={project.accentColor} strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#diamond-portal)" />
        </svg>
      );
    case "sporttrack":
      return (
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 300">
          <defs>
            <pattern id="dots-sporttrack" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1.5" fill={project.accentColor} />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#dots-sporttrack)" />
        </svg>
      );
    default:
      return null;
  }
}

function getStatusBadge(status: ProjectStatus, t: (key: never) => string) {
  if (status === "planned") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-white/60 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        {t("work.comingSoon" as never)}
      </span>
    );
  }
  if (status === "development") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-white/60 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70 animate-pulse" />
        {t("work.inDevelopment" as never)}
      </span>
    );
  }
  return null;
}

function ProjectCard({ project, t, lang }: { project: Project; t: (key: never) => string; lang: Lang }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl p-8 md:p-12 lg:p-16"
        style={{ backgroundColor: project.bgColor }}
      >
        {/* Background pattern */}
        <div className="transition-opacity duration-700 group-hover:opacity-150">
          {getSvgPattern(project)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

        {/* Glow on hover */}
        <div
          className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-[0.08]"
          style={{ backgroundColor: project.accentColor }}
        />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            {/* Status badge */}
            {project.status !== "live" && (
              <div className="mb-4">
                {getStatusBadge(project.status, t)}
              </div>
            )}

            <p
              className="mb-2 text-xs tracking-[0.25em] uppercase transition-all duration-500 group-hover:tracking-[0.35em]"
              style={{ color: project.accentColor }}
            >
              {project.subtitle[lang]}
            </p>
            <h3 className="font-serif text-4xl text-white transition-transform duration-500 group-hover:translate-x-1 md:text-5xl lg:text-6xl">
              {project.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-white/65 md:text-base">
              {project.description[lang]}
            </p>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] tracking-wider uppercase text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* View project link that appears on hover */}
            <div
              className="mt-6 flex items-center gap-2 text-sm opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              style={{ color: project.accentColor }}
            >
              <span className="tracking-wider uppercase font-medium text-xs">
                {t("work.viewProject" as never)}
              </span>
              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          <div className="flex shrink-0 items-end">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-white/30 group-hover:scale-110 group-hover:rotate-[-8deg]">
              <svg
                className="h-5 w-5 text-white/40 transition-all duration-500 group-hover:text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();

  return (
    <section id="work" className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="mb-3 text-sm tracking-[0.2em] uppercase text-sage-muted">
            {t("work.label")}
          </p>
          <h2 className="font-serif text-4xl tracking-tight text-sage md:text-5xl">
            {t("work.title")}
          </h2>
        </div>

        <div className="mt-16 space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} t={t} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
