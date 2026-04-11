"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function ProjectCell({ project, lang, index, isMobile }: { project: Project; lang: Lang; index: number; isMobile: boolean }) {
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
      layout="position"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-[#051F20] overflow-hidden group min-h-[350px] ${spanClass} transform-gpu will-change-transform`}
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
              className="object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-700 ease-out grayscale group-hover:grayscale-0" 
            />
            {/* Dark mechanical overlay */}
            <div className="absolute inset-0 bg-[#051F20] mix-blend-color opacity-80 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
            
            {/* Scanning line effect on hover */}
            <AnimatePresence>
              {isHovered && !isMobile && (
                <motion.div 
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 right-0 h-[2px] bg-[#DAF1DE] shadow-[0_0_15px_#DAF1DE] z-20 pointer-events-none opacity-50 transform-gpu"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-[#0A2A28] flex items-center justify-center transform-gpu">
            <span className="text-[#163832] font-serif text-8xl italic opacity-50">{project.title[0]}</span>
          </div>
        )}

        {/* Text overlay - always visible minimal, fully revealed on hover */}
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-30 pointer-events-none transform-gpu">
          <div className="flex justify-between items-start">
            <span className={`text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest bg-[#051F20]/80 px-2 py-1 border border-[#163832] ${isMobile ? '' : 'backdrop-blur-sm'}`}>
              {project.category} // {String(index + 1).padStart(2, '0')}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#163832] group-hover:bg-[#DAF1DE] transition-colors group-hover:animate-ping shadow-[0_0_10px_#DAF1DE] group-hover:shadow-[0_0_10px_#DAF1DE]" />
          </div>

          <motion.div 
            className={`flex flex-col gap-2 bg-[#051F20]/95 p-4 border border-[#163832] ${isMobile ? '' : 'backdrop-blur-md'} transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out will-change-transform`}
          >
            <h3 className="text-[#DAF1DE] text-2xl md:text-3xl font-sans font-light tracking-tight truncate">
              {project.title}
            </h3>
            
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden transform-gpu"
            >
              <p className="text-[#8EB69B] text-xs md:text-sm font-serif italic mb-2 line-clamp-2">
                {project.subtitle[lang]}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[#051F20] bg-[#8EB69B] text-[8px] md:text-[10px] font-mono uppercase px-1.5 py-0.5 tracking-wider">
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const allProjects = projects;
  const filteredProjects = filter ? allProjects.filter(p => p.category === filter) : allProjects;

  return (
    <section ref={containerRef} id="work" className="relative bg-[#051F20] w-full min-h-screen z-10">
      
      {/* Category Header as a Bento Cell across the top */}
      <div className="w-full bg-[#163832] p-[1px] grid grid-cols-1 md:grid-cols-4 gap-[1px]">
        
        {/* Header Cell with Filter */}
        <div className="col-span-1 md:col-span-4 bg-[#0A2A28] p-8 md:p-12 flex flex-col items-start justify-between border-b border-[#163832] transform-gpu">
           <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-end mb-12">
             <div>
               <span className="text-[#8EB69B] font-mono text-xs uppercase tracking-[0.4em] mb-4 block">DATABASE_QUERY: WORK</span>
               <h2 className="text-[#DAF1DE] text-4xl md:text-6xl lg:text-[5rem] font-serif italic tracking-tighter leading-none">
                 {lang === 'pl' ? "Archiwum" : "Archive"}
               </h2>
             </div>
             <div className="mt-8 md:mt-0 text-[#8EB69B] font-mono text-xs text-left md:text-right max-w-xs">
               A highly dense, structured matrix of our digital implementations. Hover to extract data.
             </div>
           </div>

           {/* Filter controls */}
           <div className="flex flex-wrap gap-2">
             <button 
               onClick={() => setFilter(null)}
               className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${filter === null ? 'bg-[#DAF1DE] text-[#051F20] border-[#DAF1DE]' : 'bg-[#051F20] text-[#8EB69B] border-[#163832] hover:border-[#8EB69B]'}`}
             >
               ALL_SYSTEMS
             </button>
             {Array.from(new Set(allProjects.map(p => p.category))).map(cat => (
               <button 
                 key={cat}
                 onClick={() => setFilter(cat)}
                 className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${filter === cat ? 'bg-[#DAF1DE] text-[#051F20] border-[#DAF1DE]' : 'bg-[#051F20] text-[#8EB69B] border-[#163832] hover:border-[#8EB69B]'}`}
               >
                 {cat.replace('-', '_')}
               </button>
             ))}
           </div>
        </div>

        {/* The Bento Grid of Projects */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <ProjectCell key={project.slug} project={project} lang={lang} index={idx} isMobile={isMobile} />
          ))}
        </AnimatePresence>
        
        {/* Footer Cell */}
        <div className="col-span-1 md:col-span-4 bg-[#051F20] p-12 flex items-center justify-center transform-gpu">
          <div className="flex items-center gap-4 text-[#8EB69B] font-mono text-xs uppercase tracking-[0.3em]">
             <span className="w-8 h-[1px] bg-[#163832]" />
             END_OF_RECORDS
             <span className="w-8 h-[1px] bg-[#163832]" />
          </div>
        </div>
      </div>
    </section>
  );
}