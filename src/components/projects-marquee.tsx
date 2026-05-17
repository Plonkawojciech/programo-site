"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { projects, type Project } from "@/lib/projects";

// Curated, ordered subset shown in the homepage strip. Order matters visually.
const MARQUEE_SLUGS = [
  "estalo",
  "baulx",
  "athlix",
  "learnai",
  "jedmar",
  "ks-posnania",
  "wks-poznan",
  "wsafefinanse",
];

function getMarqueeProjects(): Project[] {
  return MARQUEE_SLUGS.map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}

function ProjectTile({ project }: { project: Project }) {
  const { lang } = useI18n();
  const screenshot = project.screenshots?.[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative shrink-0 w-[320px] md:w-[380px] lg:w-[440px] aspect-[4/3] overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/40 transition-all duration-500 ease-out hover:scale-125 hover:z-20 hover:border-primary/60 hover:shadow-2xl hover:shadow-black/30"
      aria-label={`${project.title} — ${project.subtitle[lang]}`}
    >
      {screenshot ? (
        <Image
          src={screenshot}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 320px, (max-width: 1024px) 380px, 440px"
          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: project.bgColor }}
        />
      )}

      {/* Bottom gradient for readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Accent line on top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: project.accentColor }}
          >
            {project.tags[0] ?? project.category}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
            · {project.year}
          </span>
        </div>
        <h3 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-white">
          {project.title}
        </h3>
        <p className="mt-2 text-sm md:text-base font-light text-white/80 leading-snug line-clamp-2">
          {project.subtitle[lang]}
        </p>
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
      id="realizacje"
      aria-labelledby="realizations-heading"
      className="relative bg-surface py-24 md:py-32 lg:py-40 border-t border-outline-variant/20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
            >
              {t("realizations.label")}
            </motion.span>
            <motion.h2
              id="realizations-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 font-headline text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tighter text-on-surface"
            >
              {t("realizations.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-base md:text-lg font-light text-on-surface/70 max-w-xl"
            >
              {t("realizations.subtitle")}
            </motion.p>
          </div>

          <Link
            href="/projekty"
            className="hidden md:inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium text-on-surface hover:text-primary transition-all hover:gap-5"
          >
            {t("realizations.viewAll")} <span>→</span>
          </Link>
        </div>
      </div>

      {/* Marquee track — extends edge-to-edge */}
      <div
        className="projects-marquee group/marquee relative w-full"
        aria-hidden={false}
      >
        {/* Side fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-surface to-transparent" />

        <div className="projects-marquee__track flex gap-5 md:gap-7 py-2">
          {/* Duplicated twice for seamless loop */}
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex gap-5 md:gap-7 shrink-0"
              aria-hidden={dup === 1}
            >
              {items.map((project) => (
                <ProjectTile
                  key={`${dup}-${project.slug}`}
                  project={project}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-only "view all" link */}
      <div className="mx-auto max-w-[1400px] px-6 md:hidden mt-10">
        <Link
          href="/projekty"
          className="inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium text-on-surface hover:text-primary transition-all"
        >
          {t("realizations.viewAll")} <span>→</span>
        </Link>
      </div>
    </section>
  );
}
