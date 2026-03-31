"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

export default function FeaturedWork() {
  const { t, lang } = useI18n();
  const scrollSection = useRef<HTMLElement>(null);
  const totalProjects = projects.length;

  const { scrollYProgress } = useScroll({
    target: scrollSection,
    offset: ["start start", "end end"],
  });

  // Translate the inner container horizontally based on vertical scroll
  const scrollPercent = ((totalProjects - 1) / totalProjects) * 100;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${scrollPercent}%`]);

  return (
    <section
      id="work"
      ref={scrollSection}
      className="relative bg-[#F0F0EC]"
      style={{ height: `${totalProjects * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Section heading */}
        <div className="flex items-end justify-between px-6 pt-8 pb-6 md:px-16 md:pt-12 md:pb-8">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-headline text-[10vw] font-bold tracking-tighter text-[#0A0A0A] md:text-7xl lg:text-8xl"
            >
              {t("work.title")}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-on-surface-variant md:block"
          >
            {t("work.label")}
          </motion.p>
        </div>

        {/* Horizontal scroll carousel */}
        <motion.div
          style={{ x }}
          className="flex h-full items-center gap-8 px-6 md:gap-12 md:px-16 will-change-transform"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              lang={lang}
              index={index}
              total={totalProjects}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  lang,
  index,
  total,
}: {
  project: (typeof projects)[number];
  lang: Lang;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="relative flex-shrink-0"
      style={{ width: "80vw" }}
    >
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="view"
        className="group relative block h-[60vh] w-full overflow-hidden rounded-3xl bg-surface-container-high md:h-[65vh]"
      >
        {/* Image with grayscale → color on hover */}
        {project.screenshots?.[0] ? (
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={project.screenshots[0]}
              alt={project.title}
              fill
              className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              sizes="80vw"
            />
          </motion.div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a]">
            <span className="font-headline text-[20vw] font-bold italic text-white/5">
              {project.title[0]}
            </span>
          </div>
        )}

        {/* Dark overlay gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Project title — bottom left */}
        <div className="absolute bottom-8 left-8 z-10 md:bottom-12 md:left-12">
          <h3 className="font-headline text-4xl font-bold italic text-white md:text-6xl lg:text-7xl">
            {project.title}
          </h3>
          <p className="mt-2 max-w-sm text-sm font-light text-white/70">
            {project.subtitle[lang]}
          </p>
        </div>

        {/* Year — top right */}
        <span className="absolute right-8 top-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 md:right-12 md:top-12">
          {project.year}
        </span>

        {/* Counter — bottom right */}
        <span className="absolute bottom-8 right-8 font-headline text-lg font-light italic text-white/40 md:bottom-12 md:right-12">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </Link>
    </div>
  );
}
