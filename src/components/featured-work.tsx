"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project, ProjectStatus } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";
import {
  easeEntry,
  easeDefault,
  durationSlow,
  durationMedium,
  staggerItem,
  clipRevealUp,
} from "@/lib/motion";

function getStatusBadge(status: ProjectStatus, t: (key: never) => string) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {t("work.live" as never)}
      </span>
    );
  }
  if (status === "planned") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-on-surface-variant">
        <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
        {t("work.comingSoon" as never)}
      </span>
    );
  }
  if (status === "development") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        {t("work.inDevelopment" as never)}
      </span>
    );
  }
  return null;
}

function ProjectCard({
  project,
  t,
  lang,
  index,
}: {
  project: Project;
  t: (key: never) => string;
  lang: Lang;
  index: number;
}) {
  const isOdd = index % 2 === 1;
  // Directional stagger: odd indices (0, 2) from left, even indices (1, 3) from right
  const directionX = index % 2 === 0 ? -60 : 60;

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 30, x: directionX }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: durationMedium,
          delay: index * staggerItem,
          ease: easeDefault,
        }}
        className={isOdd ? "mt-0 md:mt-16" : ""}
      >
        {/* Image area with clip-path reveal */}
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: durationSlow,
            delay: index * staggerItem + 0.15,
            ease: easeEntry,
          }}
          className="aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-surface-container-low"
        >
          {project.screenshots && project.screenshots.length > 0 ? (
            <motion.div
              className="w-full h-full relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: durationMedium, ease: easeDefault }}
            >
              <Image
                src={project.screenshots[0]}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          ) : (
            <motion.div
              className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: durationMedium, ease: easeDefault }}
            >
              <span className="font-headline text-6xl text-outline-variant/30 select-none">
                {project.title[0]}
              </span>

              {/* Hover overlay with large initial letter */}
              <motion.div
                className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: easeEntry }}
              >
                <span className="font-headline text-[120px] text-primary/20 select-none">
                  {project.title[0]}
                </span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex justify-between items-start">
          <div>
            <div className="mb-3">
              {getStatusBadge(project.status, t)}
            </div>
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary mb-2 block">
              {project.tags.join(" / ")}
            </span>
            <h3 className="font-headline text-2xl md:text-3xl font-medium text-on-surface mb-2">
              {project.title}
            </h3>
            <p className="text-sm font-normal text-on-surface-variant max-w-sm leading-relaxed">
              {project.description[lang]}
            </p>
          </div>
          <svg
            className="h-6 w-6 text-outline mt-1 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </div>
      </motion.article>
    </Link>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();

  return (
    <section id="work" className="py-20 md:py-28 lg:py-32 px-8 md:px-24 max-w-[1920px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
        <motion.h2
          variants={clipRevealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-on-surface"
        >
          {t("work.title")}
        </motion.h2>
        <p className="text-[11px] font-medium uppercase tracking-widest text-on-surface-variant mt-4 md:mt-0">
          {t("work.label")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20 md:gap-x-10 md:gap-y-24">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            t={t}
            lang={lang}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
