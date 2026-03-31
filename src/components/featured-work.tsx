"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function ProjectSlide({
  project,
  lang,
  index,
  total,
  scrollYProgress,
}: {
  project: Project;
  lang: Lang;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Each project occupies 1/total of the scroll range
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;
  const mid = start + segmentSize * 0.5;

  // Opacity: fade in during first half, fade out during second half (except last)
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [start, start + segmentSize * 0.1, end - segmentSize * 0.1, end]
      : index === total - 1
      ? [start, start + segmentSize * 0.2, end]
      : [start, start + segmentSize * 0.2, end - segmentSize * 0.15, end],
    index === 0
      ? [1, 1, 1, 0]
      : index === total - 1
      ? [0, 1, 1]
      : [0, 1, 1, 0]
  );

  // Scale: starts at 0.6, goes to 0.9 at midpoint
  const scale = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.6, 0.9, 0.85]
  );

  // Title Y: slides up into view
  const titleY = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.3],
    [80, 0]
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.3],
    [0, 1]
  );

  // Tags appear
  const tagsOpacity = useTransform(
    scrollYProgress,
    [start + segmentSize * 0.2, start + segmentSize * 0.4],
    [0, 1]
  );

  const tagsY = useTransform(
    scrollYProgress,
    [start + segmentSize * 0.2, start + segmentSize * 0.4],
    [20, 0]
  );

  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-20"
      style={{ opacity }}
    >
      {/* Background project number — very low opacity */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        style={{ opacity: 0.03 }}
      >
        <span
          className="font-headline text-[200px] md:text-[300px] lg:text-[400px] font-bold italic"
          style={{ color: "#C8A44E" }}
        >
          {num}
        </span>
      </div>

      {/* Tags — floating above image */}
      <motion.div
        className="relative z-20 flex flex-wrap gap-2 mb-6"
        style={{ opacity: tagsOpacity, y: tagsY }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-[10px] font-medium uppercase"
            style={{
              backgroundColor: "rgba(200, 164, 78, 0.1)",
              color: "#C8A44E",
              letterSpacing: "0.2em",
              border: "1px solid rgba(200, 164, 78, 0.15)",
            }}
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Screenshot */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative z-10 w-full max-w-5xl 2xl:max-w-6xl"
        data-cursor="view"
      >
        <motion.div
          className="relative aspect-[16/10] overflow-hidden rounded-2xl md:rounded-3xl"
          style={{
            scale,
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          {project.screenshots?.[0] ? (
            <Image
              src={project.screenshots[0]}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority={index === 0}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${project.bgColor} 0%, #0A0808 100%)`,
              }}
            >
              <span
                className="font-headline text-9xl font-bold italic"
                style={{ color: project.accentColor, opacity: 0.2 }}
              >
                {project.title[0]}
              </span>
            </div>
          )}
        </motion.div>
      </Link>

      {/* Project title — large serif below image */}
      <motion.div
        className="relative z-20 mt-8 md:mt-12 text-center"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        <h3
          className="font-headline text-[10vw] md:text-[6vw] lg:text-[5vw] font-bold italic leading-none tracking-tighter"
          style={{ color: "rgba(200, 164, 78, 0.9)" }}
        >
          {project.title}
        </h3>
        <p
          className="mt-3 text-sm md:text-base font-light max-w-lg mx-auto"
          style={{ color: "#8A8278" }}
        >
          {project.subtitle[lang]}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const total = projects.length;

  return (
    <section
      id="work"
      ref={container}
      className="relative"
      style={{ height: `${total * 100}vh` }}
    >
      {/* Section marker */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute top-8 left-6 md:left-10 font-headline text-xs italic z-30"
        style={{ color: "#C8A44E", letterSpacing: "0.3em" }}
      >
        II
      </motion.span>

      {/* Section divider line at top */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-[5%] right-[5%] h-[1px]"
        style={{ backgroundColor: "rgba(200, 164, 78, 0.08)", transformOrigin: "center" }}
      />

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Header */}
        <div className="absolute top-20 md:top-24 left-0 right-0 z-30 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-medium uppercase"
            style={{ color: "#C8A44E", letterSpacing: "0.5em" }}
          >
            {t("work.label")}
          </motion.span>
        </div>

        {/* Project slides */}
        {projects.map((project, index) => (
          <ProjectSlide
            key={project.slug}
            project={project}
            lang={lang}
            index={index}
            total={total}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Navigation dots — right side */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          {projects.map((project, i) => (
            <NavigationDot
              key={project.slug}
              index={i}
              total={total}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Project title list — left side (desktop only) */}
        <div className="hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2 z-30 flex-col gap-2">
          {projects.map((project, i) => (
            <ProjectLabel
              key={project.slug}
              title={project.title}
              index={i}
              total={total}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NavigationDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;

  const dotScale = useTransform(scrollYProgress, (v) =>
    v >= start && v < end ? 1 : 0.6
  );
  const dotOpacity = useTransform(scrollYProgress, (v) =>
    v >= start && v < end ? 1 : 0.3
  );
  const dotBg = useTransform(scrollYProgress, (v) =>
    v >= start && v < end ? "#C8A44E" : "transparent"
  );

  return (
    <motion.div
      className="h-2 w-2 rounded-full border transition-colors duration-300"
      style={{
        borderColor: "#C8A44E",
        scale: dotScale,
        opacity: dotOpacity,
        backgroundColor: dotBg,
      }}
    />
  );
}

function ProjectLabel({
  title,
  index,
  total,
  scrollYProgress,
}: {
  title: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;

  const isActive = useTransform(scrollYProgress, (v) =>
    v >= start && v < end ? 1 : 0.3
  );

  return (
    <motion.span
      className="text-[10px] font-medium uppercase block"
      style={{
        color: "#C8A44E",
        letterSpacing: "0.3em",
        opacity: isActive,
      }}
    >
      {title}
    </motion.span>
  );
}
