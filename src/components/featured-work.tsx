"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function HorizontalProject({ project, lang, index, totalCount }: { project: Project; lang: Lang; index: number; totalCount: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="relative shrink-0 w-[85vw] md:w-[60vw] lg:w-[50vw] 2xl:w-[45vw] h-full flex items-center transform-gpu"
    >
      <Link href={`/projects/${project.slug}`} className="relative w-full group">
        {/* Glass Card */}
        <div className="relative bg-white/60 md:backdrop-blur-[12px] rounded-2xl shadow-[0_20px_50px_rgba(26,24,22,0.06),0_0_0_1px_rgba(26,24,22,0.04)] overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_24px_60px_rgba(26,24,22,0.1)]">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
               style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

          {/* Image area */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#F0EDE6]">
            {project.screenshots?.[0] ? (
              <Image
                src={project.screenshots[0]}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#1A1816]/10 font-serif text-[15vw] md:text-[8vw] italic tracking-tighter select-none">{project.title[0]}</span>
              </div>
            )}
            {/* Top reflection on image */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          </div>

          {/* Content area */}
          <div className="p-6 md:p-8 2xl:p-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#6B6560]">
                {String(index + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-[#E5E0D5]" />
              <span className={`text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
                project.status === "live"
                  ? "text-[#8EB69B] border-[#8EB69B]/30 bg-[#8EB69B]/5"
                  : project.status === "development"
                  ? "text-[#C4A876] border-[#C4A876]/30 bg-[#C4A876]/5"
                  : "text-[#6B6560] border-[#6B6560]/20 bg-[#6B6560]/5"
              }`}>
                {project.status === "live" ? (lang === "pl" ? "Live" : "Live") : project.status === "development" ? (lang === "pl" ? "W realizacji" : "In Dev") : (lang === "pl" ? "Planowany" : "Planned")}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-sans font-light tracking-tighter text-[#1A1816] leading-tight mb-2">
              {project.title}
            </h3>
            <p className="text-[#6B6560] text-sm 2xl:text-base font-light leading-relaxed line-clamp-2 whitespace-normal">
              {project.subtitle[lang]}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[9px] font-mono uppercase tracking-wider text-[#6B6560]/70 bg-[#F0EDE6] px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CategorySection({ title, categoryProjects, lang, sectionIndex }: { title: string; categoryProjects: Project[]; lang: Lang; sectionIndex: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerHeight = `${categoryProjects.length * 100}vh`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 80 });
  const xTrack = useTransform(smoothProgress, [0, 1], ["5vw", `${-(categoryProjects.length - 1) * 55}vw`]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0.3]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: containerHeight }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col" style={{ contain: "layout style paint" }}>
        {/* Category title */}
        <motion.div style={{ opacity: titleOpacity }} className="pt-24 md:pt-28 px-[5vw] pb-6 z-10 transform-gpu will-change-opacity">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#8EB69B]">
              {String(sectionIndex + 1).padStart(2, "0")}
            </span>
            <div className="h-px w-12 bg-[#E5E0D5]" />
          </div>
          <h2 className="text-3xl md:text-5xl 2xl:text-7xl font-sans font-light tracking-tighter text-[#1A1816]">
            {title}
          </h2>
        </motion.div>

        {/* Horizontal scroll track */}
        <motion.div
          style={{ x: xTrack }}
          className="flex items-center gap-8 md:gap-12 2xl:gap-16 h-full px-[5vw] 2xl:px-[8vw] pb-16 transform-gpu will-change-transform"
        >
          {categoryProjects.map((project, idx) => (
            <HorizontalProject
              key={project.slug}
              project={project}
              lang={lang}
              index={idx}
              totalCount={categoryProjects.length}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function FeaturedWork() {
  const { lang } = useI18n();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const naszeSystemy = projects.filter(p => p.category === "nasze-systemy");
  const stronyZrobione = projects.filter(p => p.category === "strony-zrobione");
  const pozostaleProjekty = projects.filter(p => p.category === "projekty");

  const categories = [
    { id: "nasze-systemy", label: lang === "pl" ? "Nasze Systemy" : "Our Systems", projects: naszeSystemy },
    { id: "strony-zrobione", label: lang === "pl" ? "Strony" : "Websites", projects: stronyZrobione },
    { id: "projekty", label: lang === "pl" ? "Projekty" : "Projects", projects: pozostaleProjekty },
  ].filter(c => c.projects.length > 0);

  return (
    <div id="work" className="relative bg-[#FAF8F4]">
      {/* Continuing orbs from hero */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#8EB69B]/8 blur-[40px]" />
        <div className="absolute top-[50%] left-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#C4A876]/6 blur-[40px]" />
      </div>

      {categories.map((cat, idx) => (
        <CategorySection
          key={cat.id}
          title={cat.label}
          categoryProjects={cat.projects}
          lang={lang}
          sectionIndex={idx}
        />
      ))}
    </div>
  );
}
