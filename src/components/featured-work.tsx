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
    href: "https://baulx.vercel.app",
    bg: "bg-[#0f1b2d]",
    accent: "text-[#5ba4c9]",
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
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.article
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className={`group relative overflow-hidden rounded-2xl ${project.bg} p-8 md:p-12 lg:p-16`}
              >
                {project.pattern}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

                <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <p className={`mb-2 text-xs tracking-[0.25em] uppercase ${project.accent}`}>
                      {t(project.subtitleKey as never)}
                    </p>
                    <h3 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/50 md:text-base">
                      {t(project.descKey as never)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-end">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-white/25 group-hover:scale-110">
                      <svg
                        className="h-5 w-5 text-white/40 transition-colors group-hover:text-white/70"
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

                <div
                  className={`absolute -bottom-20 -right-20 h-64 w-64 rounded-full opacity-[0.03] blur-3xl ${
                    project.title === "Estalo"
                      ? "bg-[#c8a951]"
                      : project.title === "Baulx"
                        ? "bg-[#5ba4c9]"
                        : "bg-[#6abf69]"
                  }`}
                />
              </motion.article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
