"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function ProjectCell({ project, lang, index }: { project: Project; lang: Lang; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const spans = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
  ];

  const spanClass = spans[index % spans.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-[var(--theme-bg-1)] overflow-hidden group min-h-[350px] 2xl:min-h-[450px] ${spanClass} transform-gpu will-change-transform`}
    >
      <Link href={`/projects/${project.slug}`} className="block w-full h-full">
        {project.screenshots?.[0] ? (
          <motion.div
            className="absolute inset-0 w-full h-full origin-center transform-gpu will-change-transform"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={project.screenshots[0]}
              alt={project.title}
              fill
              className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700 ease-out"
            />
            {/* Dark overlay that lifts on hover */}
            <div className="absolute inset-0 bg-[var(--theme-bg-1)]/60 group-hover:bg-[var(--theme-bg-1)]/10 transition-all duration-700 pointer-events-none" />

            {/* Scanning line effect on hover — uses project accent color */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none opacity-60 transform-gpu hidden md:block"
                  style={{
                    backgroundColor: project.accentColor,
                    boxShadow: `0 0 15px ${project.accentColor}`,
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-[var(--theme-bg-2)] flex items-center justify-center transform-gpu">
            <span className="text-[var(--theme-border-1)] font-serif text-8xl italic opacity-50">{project.title[0]}</span>
          </div>
        )}

        {/* Text overlay */}
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-30 pointer-events-none transform-gpu">
          <div className="flex justify-between items-start gap-2">
            <span className="text-[var(--theme-text-2)] font-mono text-[10px] uppercase tracking-widest bg-[var(--theme-bg-1)]/90 px-2 py-1 border border-[var(--theme-border-1)]">
              {project.category} // {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              {/* Visit site link — always visible for strony-zrobione */}
              {project.category === "strony-zrobione" && project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[var(--theme-text-1)] bg-[var(--theme-bg-1)]/90 border px-2.5 py-1 pointer-events-auto transition-colors hover:bg-[var(--theme-bg-1)]"
                  style={{ borderColor: `${project.accentColor}66` }}
                >
                  <span>VISIT</span>
                  <span>↗</span>
                </a>
              )}
              {/* Status dot — glows with accent color on hover */}
              <div
                className="w-2 h-2 rounded-full bg-[var(--theme-border-1)] transition-colors duration-300"
                style={{
                  backgroundColor: isHovered ? project.accentColor : undefined,
                  boxShadow: isHovered ? `0 0 12px ${project.accentColor}, 0 0 4px ${project.accentColor}` : "none",
                }}
              />
            </div>
          </div>

          <motion.div
            className="flex flex-col gap-2 bg-[var(--theme-bg-1)]/95 p-4 border border-[var(--theme-border-1)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out will-change-transform"
            style={{
              borderLeftColor: isHovered ? project.accentColor : undefined,
              borderLeftWidth: isHovered ? "3px" : undefined,
            }}
          >
            <h3 className="text-[var(--theme-text-1)] text-2xl md:text-3xl 2xl:text-4xl font-sans font-light tracking-tight truncate">
              {project.title}
            </h3>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden transform-gpu"
            >
              <p className="text-[var(--theme-text-2)] text-xs md:text-sm font-serif italic mb-2 line-clamp-2">
                {project.subtitle[lang]}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-[var(--theme-bg-1)] text-[8px] md:text-[10px] font-mono uppercase px-1.5 py-0.5 tracking-wider transition-colors duration-300"
                    style={{ backgroundColor: isHovered ? project.accentColor : "var(--theme-accent)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedWork() {
  const { lang } = useI18n();
  const containerRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const allProjects = projects;
  const filteredProjects = filter ? allProjects.filter(p => p.category === filter) : allProjects;

  return (
    <section ref={containerRef} id="work" className="relative bg-[var(--theme-bg-1)] w-full min-h-screen z-10">

      {/* Category Header as a Bento Cell across the top */}
      <div className="w-full bg-[var(--theme-border-1)] p-[1px] grid grid-cols-1 md:grid-cols-4 gap-[1px]">

        {/* Header Cell with Filter */}
        <div className="col-span-1 md:col-span-4 bg-[var(--theme-bg-2)] p-8 md:p-12 flex flex-col items-start justify-between border-b border-[var(--theme-border-1)] transform-gpu">
           <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-end mb-12">
             <div>
               <span className="text-[var(--theme-text-2)] font-mono text-xs uppercase tracking-[0.4em] mb-4 block">DATABASE_QUERY: WORK</span>
               <h2 className="text-[var(--theme-text-1)] text-4xl md:text-6xl lg:text-[5rem] 2xl:text-[6rem] font-serif italic tracking-tighter leading-none">
                 {lang === 'pl' ? "Archiwum" : "Archive"}
               </h2>
             </div>
             <div className="mt-8 md:mt-0 text-[var(--theme-text-2)] font-mono text-xs text-left md:text-right max-w-xs">
               A highly dense, structured matrix of our digital implementations. Hover to extract data.
             </div>
           </div>

           {/* Filter controls */}
           <div className="flex flex-wrap gap-2">
             <button
               onClick={() => setFilter(null)}
               className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${filter === null ? 'bg-[var(--theme-text-1)] text-[var(--theme-bg-1)] border-[var(--theme-text-1)]' : 'bg-[var(--theme-bg-1)] text-[var(--theme-text-2)] border-[var(--theme-border-1)] hover:border-[var(--theme-accent)]'}`}
             >
               ALL_SYSTEMS
             </button>
             {Array.from(new Set(allProjects.map(p => p.category))).map(cat => (
               <button
                 key={cat}
                 onClick={() => setFilter(cat)}
                 className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${filter === cat ? 'bg-[var(--theme-text-1)] text-[var(--theme-bg-1)] border-[var(--theme-text-1)]' : 'bg-[var(--theme-bg-1)] text-[var(--theme-text-2)] border-[var(--theme-border-1)] hover:border-[var(--theme-accent)]'}`}
               >
                 {cat.replace('-', '_')}
               </button>
             ))}
           </div>
        </div>

        {/* The Bento Grid of Projects */}
        <AnimatePresence mode="wait">
          {filteredProjects.map((project, idx) => (
            <ProjectCell key={project.slug} project={project} lang={lang} index={idx} />
          ))}
        </AnimatePresence>

        {/* Footer Cell */}
        <div className="col-span-1 md:col-span-4 bg-[var(--theme-bg-1)] p-12 flex items-center justify-center transform-gpu">
          <div className="flex items-center gap-4 text-[var(--theme-text-2)] font-mono text-xs uppercase tracking-[0.3em]">
             <span className="w-8 h-[1px] bg-[var(--theme-border-1)]" />
             END_OF_RECORDS
             <span className="w-8 h-[1px] bg-[var(--theme-border-1)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
