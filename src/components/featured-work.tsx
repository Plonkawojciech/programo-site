"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface Project {
  title: string;
  subtitleKey: string;
  descKey: string;
  href: string;
  bg: string;
  accent: string;
  accentHex: string;
  pattern: React.ReactNode;
}

const projects: Project[] = [
  {
    title: "Estalo",
    subtitleKey: "work.estalo.subtitle",
    descKey: "work.estalo.desc",
    href: "https://estalo.pl",
    bg: "bg-[#1a1a1a]",
    accent: "text-[#c8a951]",
    accentHex: "#c8a951",
    pattern: (
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 300">
        <defs>
          <pattern id="grid-estalo" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" />
            <path d="M40 0L0 40" stroke="#c8a951" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid-estalo)" />
      </svg>
    ),
  },
  {
    title: "Baulx",
    subtitleKey: "work.baulx.subtitle",
    descKey: "work.baulx.desc",
    href: "https://baulx.pl",
    bg: "bg-[#0f1b2d]",
    accent: "text-[#5ba4c9]",
    accentHex: "#5ba4c9",
    pattern: (
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 400 300">
        <defs>
          <pattern id="hex-baulx" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,2 56,15 56,37 30,50 4,37 4,15" fill="none" stroke="#5ba4c9" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#hex-baulx)" />
      </svg>
    ),
  },
  {
    title: "WUP2TCN",
    subtitleKey: "work.wup2tcn.subtitle",
    descKey: "work.wup2tcn.desc",
    href: "https://baulx.vercel.app",
    bg: "bg-[#1a2e1a]",
    accent: "text-[#6abf69]",
    accentHex: "#6abf69",
    pattern: (
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 300">
        <defs>
          <pattern id="dots-wup2tcn" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.5" fill="#6abf69" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#dots-wup2tcn)" />
      </svg>
    ),
  },
];

function ProjectCard({ project, t }: { project: Project; t: (key: never) => string }) {
  return (
    <a
      key={project.title}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden rounded-2xl ${project.bg} p-8 md:p-12 lg:p-16`}
      >
        {/* Background pattern */}
        <div className="transition-opacity duration-700 group-hover:opacity-150">
          {project.pattern}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

        {/* Glow on hover */}
        <div
          className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-[0.08]"
          style={{ backgroundColor: project.accentHex }}
        />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className={`mb-2 text-xs tracking-[0.25em] uppercase transition-all duration-500 group-hover:tracking-[0.35em] ${project.accent}`}>
              {t(project.subtitleKey as never)}
            </p>
            <h3 className="font-serif text-4xl text-white transition-transform duration-500 group-hover:translate-x-1 md:text-5xl lg:text-6xl">
              {project.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-white/65 md:text-base">
              {t(project.descKey as never)}
            </p>

            {/* View project link that appears on hover */}
            <div className="mt-6 flex items-center gap-2 text-sm opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0" style={{ color: project.accentHex }}>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </div>
        </div>
      </motion.article>
    </a>
  );
}

export default function FeaturedWork() {
  const { t } = useI18n();

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
            <ProjectCard key={project.title} project={project} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
