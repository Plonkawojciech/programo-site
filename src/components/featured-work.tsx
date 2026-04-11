"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function ProjectItem({ project, lang, index }: { project: Project; lang: Lang; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const yImage = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yText = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const smoothScale = useSpring(scaleImage, { stiffness: 100, damping: 30 });

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`relative w-full flex flex-col items-center gap-12 md:gap-24 mb-48 md:mb-80`}
    >
      <Link href={`/projects/${project.slug}`} className="relative z-10 w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden group rounded-sm shadow-sm border border-[#F5F5F5]">
        <motion.div style={{ y: yImage, scale: smoothScale }} className="w-full h-full transform-gpu will-change-transform transition-opacity duration-700 group-hover:opacity-90">
          {project.screenshots?.[0] ? (
            <Image 
              src={project.screenshots[0]} 
              alt={project.title} 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out" 
            />
          ) : (
            <div className="w-full h-full bg-[#FAFAFA] flex items-center justify-center">
              <span className="text-black font-sans text-8xl font-bold opacity-5">{project.title[0]}</span>
            </div>
          )}
        </motion.div>
      </Link>

      <motion.div 
        style={{ y: yText }} 
        className={`relative z-20 w-full max-w-4xl flex flex-col items-center text-center`}
      >
        <span className="text-black/40 font-sans text-[10px] uppercase tracking-[0.5em] mb-6">
          {project.tags.slice(0,3).join(" / ")}
        </span>
        
        <h3 className="text-black text-4xl md:text-7xl font-sans font-bold tracking-tighter leading-none mb-8 uppercase">
          {project.title}
        </h3>
        
        <p className="text-black/60 text-base md:text-lg font-sans font-light leading-relaxed max-w-2xl mb-10">
          {project.description[lang]}
        </p>

        <Link 
          href={`/projects/${project.slug}`}
          className="group flex items-center gap-6 text-black font-sans text-[10px] md:text-xs uppercase tracking-[0.5em] border-b border-black/10 pb-4 hover:border-black transition-colors"
        >
          <span>{lang === 'pl' ? 'Zobacz Projekt' : 'View Project'}</span>
          <span className="transform transition-transform group-hover:translate-x-4">→</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

const CategoryTitle = ({ title, index }: { title: string, index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.9, 1, 0.9]);

  return (
    <div ref={ref} className="relative py-48 md:py-72 flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity, scale }} className="text-center">
          <span className="text-black/20 font-sans text-xs uppercase tracking-[1em] mb-4 block">Section 0{index + 1}</span>
          <h2 className="text-6xl md:text-9xl font-sans font-bold uppercase tracking-tighter text-black">
            {title}
          </h2>
        </motion.div>
    </div>
  );
}

export default function FeaturedWork() {
  const { lang } = useI18n();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skew = useTransform(smoothVelocity, [-1000, 1000], [-1, 1]);

  const naszeSystemy = projects.filter(p => p.category === "nasze-systemy");
  const stronyZrobione = projects.filter(p => p.category === "strony-zrobione");
  const pozostaleProjekty = projects.filter(p => p.category === "projekty");

  return (
    <section ref={containerRef} id="work" className="relative bg-white w-full pb-40 overflow-hidden">
      
      {/* Subtle Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
        style={{ 
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "200px 200px"
        }}
      />

      <motion.div 
        style={{ skewY: skew }}
        className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 xl:px-32 relative z-10"
      >
        
        {naszeSystemy.length > 0 && (
          <div id="category-nasze-systemy">
            <CategoryTitle title={lang === 'pl' ? "Systemy" : "Systems"} index={0} />
            <div className="pt-10">
              {naszeSystemy.map((project, idx) => (
                <ProjectItem key={project.slug} project={project} lang={lang} index={idx} />
              ))}
            </div>
          </div>
        )}

        {stronyZrobione.length > 0 && (
          <div id="category-strony-zrobione">
            <CategoryTitle title={lang === 'pl' ? "Strony" : "Websites"} index={1} />
            <div className="pt-10">
              {stronyZrobione.map((project, idx) => (
                <ProjectItem key={project.slug} project={project} lang={lang} index={idx + naszeSystemy.length} />
              ))}
            </div>
          </div>
        )}

        {pozostaleProjekty.length > 0 && (
          <div id="category-projekty">
            <CategoryTitle title={lang === 'pl' ? "Projekty" : "Projects"} index={2} />
            <div className="pt-10">
              {pozostaleProjekty.map((project, idx) => (
                <ProjectItem key={project.slug} project={project} lang={lang} index={idx + naszeSystemy.length + stronyZrobione.length} />
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </section>
  );
}
