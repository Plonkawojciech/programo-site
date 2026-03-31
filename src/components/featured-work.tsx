"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function StickyProjectCard({
  project,
  lang,
  index,
}: {
  project: Project;
  lang: Lang;
  index: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  // Image starts at scale 0.8 grayscale, scales to 1.0 full color as user scrolls
  const imageScale = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.8, 0.95, 1]);
  const imageFilter = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    ["grayscale(100%)", "grayscale(40%)", "grayscale(0%)"]
  );
  const infoY = useTransform(scrollYProgress, [0.2, 0.45], [80, 0]);
  const infoOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);

  return (
    <div
      ref={container}
      className="relative min-h-[120vh] md:min-h-[150vh]"
    >
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <Link
          href={`/projects/${project.slug}`}
          className="group relative w-full"
          data-cursor="view"
        >
          {/* Full viewport image container */}
          <div className="relative mx-auto w-[90vw] md:w-[80vw] lg:w-[70vw] 2xl:w-[60vw] aspect-[16/10] overflow-hidden rounded-2xl md:rounded-3xl 2xl:rounded-[3rem]">
            {project.screenshots?.[0] ? (
              <motion.div
                style={{ scale: imageScale, filter: imageFilter }}
                className="h-full w-full origin-center"
              >
                <Image
                  src={project.screenshots[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 70vw"
                />
              </motion.div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
                <span className="font-headline text-[15vw] font-bold text-on-surface/5">
                  {project.title[0]}
                </span>
              </div>
            )}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/20 to-transparent" />
          </div>

          {/* Project info slides in from bottom */}
          <motion.div
            style={{ y: infoY, opacity: infoOpacity }}
            className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12 md:pb-12 lg:px-20"
          >
            <div className="mx-auto max-w-[2560px]">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.4em] text-primary">
                    {project.tags.slice(0, 2).join(" / ")} — {project.year}
                  </span>
                  <h3 className="mt-2 font-headline text-4xl font-bold tracking-tight text-on-surface md:text-6xl 2xl:text-8xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm font-light text-on-surface-variant md:text-base 2xl:text-lg">
                    {project.subtitle[lang]}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60 transition-colors group-hover:text-primary">
                  View Project
                </span>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Spacer between projects */}
      {index < projects.length - 1 && <div className="h-[10vh]" />}
    </div>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();

  return (
    <section
      id="work"
      className="relative py-32 md:py-56 lg:py-72"
    >
      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        <div className="mb-24 flex flex-col items-baseline justify-between gap-8 md:mb-40 md:flex-row">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-headline text-[13vw] font-bold tracking-tighter text-on-surface md:text-8xl lg:text-[10vw]"
            >
              {t("work.title")}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-[90vw] md:max-w-xs 2xl:max-w-md text-[10px] md:text-xs 2xl:text-sm font-medium uppercase tracking-[0.3em] text-on-surface-variant leading-relaxed"
          >
            {t("work.label")}
          </motion.p>
        </div>
      </div>

      {/* Sticky scroll project cards */}
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <StickyProjectCard
            key={project.slug}
            project={project}
            lang={lang}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
