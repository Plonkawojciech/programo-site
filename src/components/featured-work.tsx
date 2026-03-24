"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";
import MagneticWrapper from "@/components/magnetic";

function ProjectCard({
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

  const y = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -100 : 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <motion.div
      ref={container}
      style={{ y }}
      className={`relative mb-24 flex flex-col md:mb-40 ${
        index % 2 === 0 ? "items-start" : "items-end"
      }`}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group relative w-full overflow-hidden md:w-[70%] lg:w-[60%] 2xl:w-[55%]"
      >
        <motion.div
          style={{ scale }}
          className="aspect-[16/10] overflow-hidden rounded-[2rem] 2xl:rounded-[3rem] bg-surface-container-low"
        >
          {project.screenshots?.[0] ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              <Image
                src={project.screenshots[0]}
                alt={project.title}
                fill
                className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high">
              <span className="font-headline text-9xl font-bold opacity-10">
                {project.title[0]}
              </span>
            </div>
          )}
        </motion.div>

        {/* Hover info */}
        <div className="absolute bottom-10 left-10 z-20 translate-y-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-xs 2xl:text-sm font-bold uppercase tracking-[0.3em] text-white">
            {project.year}
          </span>
          <h3 className="font-headline text-4xl font-bold text-white md:text-6xl 2xl:text-[5vw]">
            {project.title}
          </h3>
        </div>
      </Link>

      <div
        className={`mt-8 md:mt-16 px-2 md:px-4 max-w-full md:max-w-sm 2xl:max-w-xl ${
          index % 2 === 0 ? "text-left" : "text-right"
        }`}
      >
        <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.4em] text-primary">
          {project.tags.slice(0, 2).join(" • ")}
        </span>
        <h4 className="mt-4 font-headline text-2xl font-medium tracking-tight text-on-surface md:text-3xl 2xl:text-5xl">
          {project.subtitle[lang]}
        </h4>
        <p className="mt-4 text-sm 2xl:text-lg font-light leading-relaxed text-on-surface-variant">
          {project.description[lang]}
        </p>
      </div>
    </motion.div>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();
  const container = useRef<HTMLElement>(null);

  return (
    <section
      id="work"
      ref={container}
      className="relative py-32 md:py-56 lg:py-72"
    >
      {/* Background kinetic text */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden opacity-[0.03]">
        <div className="flex flex-col gap-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`whitespace-nowrap font-headline text-[20vw] font-bold uppercase tracking-tighter w-max will-change-transform transform-gpu ${i % 2 === 0 ? "animate-slide-left" : "animate-slide-right"}`}
            >
              PROJECTS PROJECTS PROJECTS PROJECTS PROJECTS PROJECTS PROJECTS
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        <div className="mb-24 flex flex-col items-baseline justify-between gap-8 md:mb-56 md:flex-row">
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
            {t("work.label")} — {t("work.desc" as never) || "Curated selection of high-impact digital products built with precision and passion."}
          </motion.p>
        </div>

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              lang={lang}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Footer CTA in Work section */}
      <div className="mt-32 flex justify-center md:mt-56">
        <MagneticWrapper strength={0.4}>
          <Link
            href="/projects"
            className="group relative flex h-64 w-64 items-center justify-center rounded-full border border-primary/10 transition-colors hover:bg-on-surface hover:text-surface"
          >
            <span className="text-center font-headline text-xl font-bold italic tracking-tighter">
              Explore All <br /> Archives
            </span>
          </Link>
        </MagneticWrapper>
      </div>
    </section>
  );
}
