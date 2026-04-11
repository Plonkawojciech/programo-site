"use client";

import { useRef, useEffect, useState } from "react";
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif italic text-[#051F20]/5 pointer-events-none select-none z-0">
        0{index + 1}
      </div>

      <Link href={`/projects/${project.slug}`} className="relative z-10 w-full md:w-[55%] aspect-[4/5] md:aspect-[16/10] overflow-hidden group rounded-2xl">
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
        <div className="absolute inset-0 border border-[#051F20]/10 pointer-events-none rounded-2xl" />
      </Link>

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
          <span>{lang === 'pl' ? 'Odkryj Projekt' : 'Discover Case'}</span>
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
      <motion.h2 
        style={{ x }}
        className="text-[15vw] font-sans font-black uppercase tracking-tighter text-[#051F20]/5 whitespace-nowrap select-none"
      >
        {title} — {title} — {title}
      </motion.h2>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-[#FCFCFA] px-12 py-6 border border-[#051F20]/10 shadow-sm rounded-full">
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
  const [activeSection, setActiveSection] = useState<string>("nasze-systemy");

  const naszeSystemy = projects.filter(p => p.category === "nasze-systemy");
  const stronyZrobione = projects.filter(p => p.category === "strony-zrobione");
  const pozostaleProjekty = projects.filter(p => p.category === "projekty");

  const categories = [
    { id: "nasze-systemy", label: lang === 'pl' ? "Nasze Systemy" : "Our Systems", count: naszeSystemy.length },
    { id: "strony-zrobione", label: lang === 'pl' ? "Strony Które Zrobiliśmy" : "Websites We Made", count: stronyZrobione.length },
    { id: "projekty", label: lang === 'pl' ? "Projekty" : "Projects", count: pozostaleProjekty.length },
  ].filter(c => c.count > 0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(c => document.getElementById(`category-${c.id}`));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentActive = categories[0]?.id;
      sections.forEach(section => {
        if (section && section.offsetTop <= scrollPosition) {
          currentActive = section.id.replace('category-', '');
        }
      });
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  return (
    <section id="work" className="relative bg-[#FCFCFA] w-full pb-40 overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[1px] h-64 bg-[#051F20]/10 rotate-45" />
        <div className="absolute top-[30%] right-[10%] w-32 h-32 border border-[#051F20]/5 rotate-12 rounded-3xl" />
        <div className="absolute top-[60%] left-[15%] w-64 h-[1px] bg-[#051F20]/10 -rotate-12" />
        <div className="absolute bottom-[20%] right-[5%] w-48 h-48 border border-[#051F20]/5 rounded-full" />
      </div>

      {/* Sticky Sidebar Indicator */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-8 mix-blend-difference text-white">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="relative flex items-center group cursor-pointer" onClick={() => {
             document.getElementById(`category-${cat.id}`)?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <span className={`w-2 h-2 rounded-full transition-all duration-500 ${activeSection === cat.id ? 'bg-white scale-150' : 'bg-white/30 group-hover:bg-white/70'}`} />
            <span className={`absolute left-8 uppercase tracking-[0.2em] text-[10px] whitespace-nowrap transition-all duration-500 origin-left ${activeSection === cat.id ? 'opacity-100 scale-100 font-bold' : 'opacity-0 scale-75 group-hover:opacity-50'}`}>
              {cat.label}
            </span>
          </div>
        ))}
        {/* Progress line */}
        <div className="absolute left-[3px] top-4 bottom-4 w-[2px] bg-white/10 -z-10" />
      </div>

      <div className="max-w-[2560px] mx-auto px-6 md:px-12 lg:px-24 xl:px-48 relative z-10">
        
        {naszeSystemy.length > 0 && (
          <div id="category-nasze-systemy">
            <CategoryTitle title={lang === 'pl' ? "Nasze Systemy" : "Our Systems"} index={0} />
            <div className="pt-10">
              {naszeSystemy.map((project, idx) => (
                <ProjectItem key={project.slug} project={project} lang={lang} index={idx} />
              ))}
            </div>
          </div>
        )}

        {stronyZrobione.length > 0 && (
          <div id="category-strony-zrobione">
            <CategoryTitle title={lang === 'pl' ? "Strony Które Zrobiliśmy" : "Websites We Made"} index={1} />
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

      </div>
    </section>
  );
}
