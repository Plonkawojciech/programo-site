"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function ProjectItem({ project, lang, index }: { project: Project; lang: Lang; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  // Parallax effects for an asymmetric, "crazy" look
  const yImage = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yText = useTransform(scrollYProgress, [0, 1], [-50, 150]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const smoothScale = useSpring(scaleImage, { stiffness: 100, damping: 30 });

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`relative w-full flex flex-col md:flex-row items-center gap-12 md:gap-32 mb-40 md:mb-64 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Background massive index */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif italic text-[#051F20]/5 pointer-events-none select-none z-0">
        0{index + 1}
      </div>

      {/* Image Container */}
      <Link href={`/projects/${project.slug}`} className="relative z-10 w-full md:w-[55%] aspect-[4/5] md:aspect-[16/10] overflow-hidden group">
        <motion.div style={{ y: yImage, scale: smoothScale }} className="w-full h-full transform-gpu will-change-transform">
          {project.screenshots?.[0] ? (
            <Image 
              src={project.screenshots[0]} 
              alt={project.title} 
              fill 
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out" 
            />
          ) : (
            <div className="w-full h-full bg-[#051F20] flex items-center justify-center">
              <span className="text-[#DAF1DE] font-serif text-8xl italic opacity-20">{project.title[0]}</span>
            </div>
          )}
        </motion.div>
        {/* Border frame that stays static */}
        <div className="absolute inset-0 border border-[#051F20]/10 pointer-events-none" />
      </Link>

      {/* Text Info */}
      <motion.div 
        style={{ y: yText }} 
        className={`relative z-20 w-full md:w-[45%] flex flex-col ${isEven ? 'items-start text-left' : 'items-end text-right'}`}
      >
        <span className="text-[#163832] font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
          {project.tags.slice(0,3).join(" // ")}
        </span>
        
        <h3 className="text-[#051F20] text-5xl md:text-7xl lg:text-[6rem] font-sans font-light tracking-tighter leading-[0.9] mb-8">
          {project.title}
        </h3>
        
        <h4 className="text-[#163832] text-xl md:text-2xl font-serif italic tracking-tight mb-8">
          {project.subtitle[lang]}
        </h4>
        
        <p className="text-[#051F20]/70 text-sm md:text-base font-sans font-light leading-relaxed max-w-md">
          {project.description[lang]}
        </p>

        <Link 
          href={`/projects/${project.slug}`}
          className="mt-12 group flex items-center gap-4 text-[#051F20] font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] border-b border-[#051F20]/20 pb-3 hover:border-[#051F20] transition-colors"
        >
          <span>Discover Case</span>
          <span className="transform transition-transform group-hover:translate-x-3">→</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

const CategoryTitle = ({ title, index }: { title: string, index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -300 : 300, index % 2 === 0 ? 300 : -300]);

  return (
    <div ref={ref} className="relative py-32 md:py-56 overflow-hidden flex items-center justify-center">
      {/* Background kinetic text */}
      <motion.h2 
        style={{ x }}
        className="text-[15vw] font-sans font-black uppercase tracking-tighter text-[#051F20]/5 whitespace-nowrap select-none"
      >
        {title} — {title} — {title}
      </motion.h2>
      
      {/* Foreground elegant title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-[#FCFCFA] px-12 py-6 border border-[#051F20]/10 shadow-sm">
          <h3 className="text-2xl md:text-4xl font-serif italic text-[#051F20] tracking-tight">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWork() {
  const { lang } = useI18n();

  const naszeSystemy = projects.filter(p => p.category === "nasze-systemy");
  const stronyZrobione = projects.filter(p => p.category === "strony-zrobione");
  const pozostaleProjekty = projects.filter(p => p.category === "projekty");

  return (
    <section id="work" className="relative bg-[#FCFCFA] w-full pb-40 overflow-hidden">
      
      {/* Global decorative scattered shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[1px] h-64 bg-[#051F20]/10 rotate-45" />
        <div className="absolute top-[30%] right-[10%] w-32 h-32 border border-[#051F20]/5 rotate-12" />
        <div className="absolute top-[60%] left-[15%] w-64 h-[1px] bg-[#051F20]/10 -rotate-12" />
        <div className="absolute bottom-[20%] right-[5%] w-48 h-48 border border-[#051F20]/5 rounded-full" />
      </div>

      <div className="max-w-[2560px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Nasze Systemy */}
        {naszeSystemy.length > 0 && (
          <div>
            <CategoryTitle title={lang === 'pl' ? "Nasze Systemy" : "Our Systems"} index={0} />
            <div className="pt-10">
              {naszeSystemy.map((project, idx) => (
                <ProjectItem key={project.slug} project={project} lang={lang} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Strony Które Zrobiliśmy */}
        {stronyZrobione.length > 0 && (
          <div>
            <CategoryTitle title={lang === 'pl' ? "Strony Które Zrobiliśmy" : "Websites We Made"} index={1} />
            <div className="pt-10">
              {stronyZrobione.map((project, idx) => (
                <ProjectItem key={project.slug} project={project} lang={lang} index={idx + naszeSystemy.length} />
              ))}
            </div>
          </div>
        )}

        {/* Projekty */}
        {pozostaleProjekty.length > 0 && (
          <div>
            <CategoryTitle title={lang === 'pl' ? "Projekty" : "Projects"} index={2} />
            <div className="pt-10">
              {pozostaleProjekty.map((project, idx) => (
                <ProjectItem key={project.slug} project={project} lang={lang} index={idx + naszeSystemy.length + stronyZrobione.length} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
