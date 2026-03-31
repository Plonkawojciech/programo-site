"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function BentoCard({
  project,
  lang,
  className,
  index,
  t,
}: {
  project: Project;
  lang: Lang;
  className?: string;
  index: number;
  t: (key: any) => string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const statusLabel =
    project.status === "live"
      ? t("work.live")
      : project.status === "development"
      ? t("work.inDevelopment")
      : t("work.comingSoon");

  const statusDotClass =
    project.status === "live"
      ? "bg-emerald-400"
      : project.status === "development"
      ? "bg-amber-400/70 animate-pulse"
      : "bg-white/40";

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bento-card group cursor-pointer ${className || ""}`}
      data-cursor="view"
    >
      {/* Cursor-following spotlight */}
      <div
        className="card-spotlight"
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.06), transparent 40%)`
            : "none",
        }}
      />

      <Link href={`/projects/${project.slug}`} className="relative block h-full w-full">
        {/* Screenshot */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          {project.screenshots?.[0] ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              <Image
                src={project.screenshots[0]}
                alt={project.title}
                fill
                className="object-cover transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-container-high to-surface">
              <span className="font-headline text-8xl font-bold text-on-surface/5">
                {project.title[0]}
              </span>
            </div>
          )}

          {/* Bottom gradient overlay with info */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                    {project.year}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                      {statusLabel}
                    </span>
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-white md:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400 line-clamp-1 max-w-md">
                  {project.subtitle[lang]}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("work.viewProject")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();

  return (
    <section id="work" className="relative py-24 md:py-32 lg:py-40">
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant mb-4 block"
          >
            {t("work.label")}
          </motion.span>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-bold tracking-tight text-on-surface md:text-6xl"
            >
              <span className="gradient-text">{t("work.title")}</span>
            </motion.h2>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {/* Estalo — large hero card, 2 columns */}
          {projects[0] && (
            <BentoCard
              project={projects[0]}
              lang={lang}
              index={0}
              t={t}
              className="md:col-span-2 aspect-[16/9] md:aspect-[2/1]"
            />
          )}

          {/* Baulx — 1 column */}
          {projects[1] && (
            <BentoCard
              project={projects[1]}
              lang={lang}
              index={1}
              t={t}
              className="aspect-square md:aspect-[4/3]"
            />
          )}

          {/* Athlix — 1 column */}
          {projects[2] && (
            <BentoCard
              project={projects[2]}
              lang={lang}
              index={2}
              t={t}
              className="aspect-square md:aspect-[4/3]"
            />
          )}

          {/* LearnAI — full width, shorter */}
          {projects[3] && (
            <BentoCard
              project={projects[3]}
              lang={lang}
              index={3}
              t={t}
              className="md:col-span-2 aspect-[16/9] md:aspect-[3/1]"
            />
          )}
        </div>
      </div>
    </section>
  );
}
