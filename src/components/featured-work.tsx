"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";

// Inner Project Component to handle local parallax and text offsets
function HorizontalProject({ project, index, progress, lang, totalProjects }: { project: Project, index: number, progress: MotionValue<number>, lang: string, totalProjects: number }) {
  // Determine start and end points of this project's visibility in the global progress (0 to 1)
  const center = index / Math.max(1, (totalProjects - 1));
  const start = Math.max(0, center - 0.2);
  const end = Math.min(1, center + 0.2);

  // Inner image parallax (moves inside its container boundaries)
  const imageX = useTransform(progress, [start, end], ["-30%", "30%"]);
  
  // Project text moving at a different speed (offset relative to the main container)
  const textX = useTransform(progress, [start, end], ["15vw", "-15vw"]);

  return (
    <div className="w-[80vw] h-[80vh] flex-shrink-0 flex items-center justify-center relative mx-[5vw]">
      
      {/* Text layer with separate parallax speed */}
      <motion.div style={{ x: textX }} className="absolute z-30 left-[5vw] top-1/4 max-w-3xl pointer-events-none">
        <h3 className="text-[6vw] font-sans font-black tracking-tighter leading-[0.8] text-[#DAF1DE] uppercase mix-blend-difference drop-shadow-2xl">
          {project.title}
        </h3>
        <p className="mt-8 text-[#051F20] bg-[#DAF1DE] inline-block font-mono text-sm md:text-lg uppercase tracking-widest p-4 shadow-xl">
          {project.subtitle[lang as 'pl' | 'en']}
        </p>
      </motion.div>

      {/* Image layer */}
      <Link href={`/projects/${project.slug}`} className="relative z-20 w-[60vw] md:w-[45vw] aspect-[16/10] overflow-hidden group rounded-xl shadow-2xl border border-[#163832]/50 block cursor-pointer transform-gpu hover:scale-[1.02] transition-transform duration-500">
        <motion.div style={{ x: imageX, width: "160%", left: "-30%" }} className="relative h-full">
          {project.screenshots?.[0] ? (
            <Image 
              src={project.screenshots[0]} 
              alt={project.title} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100" 
            />
          ) : (
             <div className="w-full h-full bg-[#0A2A28] flex items-center justify-center">
               <span className="text-[#8EB69B] font-serif text-8xl italic opacity-20">{project.title[0]}</span>
             </div>
          )}
        </motion.div>
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#051F20]/80 via-transparent to-[#051F20]/80 opacity-50 pointer-events-none transition-opacity duration-500 group-hover:opacity-20" />
      </Link>
      
      {/* Decorative details */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 text-[#8EB69B] font-mono text-sm uppercase tracking-widest text-right z-20 pointer-events-none">
        <span className="bg-[#051F20]/80 px-4 py-2 border border-[#163832] backdrop-blur-sm">Project // {String(index + 1).padStart(2, '0')}</span>
        <div className="flex gap-2">
          {project.tags.slice(0, 3).map((t: string) => <span key={t} className="px-3 py-1 border border-[#163832] bg-[#0A2A28]/80 backdrop-blur-sm rounded-sm">{t}</span>)}
        </div>
      </div>
    </div>
  )
}

export default function FeaturedWork() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });
  
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const { lang } = useI18n();

  // Combine all categories into one massive timeline
  const naszeSystemy = projects.filter(p => p.category === "nasze-systemy");
  const stronyZrobione = projects.filter(p => p.category === "strony-zrobione");
  const pozostaleProjekty = projects.filter(p => p.category === "projekty");
  const allProjects = [...naszeSystemy, ...stronyZrobione, ...pozostaleProjekty];

  const totalProjects = allProjects.length;
  // Dynamic height based on amount of content to ensure comfortable scrolling
  const containerHeight = `${totalProjects * 100}vh`;

  // Main track horizontal movement: from 0vw to the very end of the projects
  // We offset it so the last project aligns near the center or left edge at the end of the scroll
  const xMain = useTransform(smoothProgress, [0, 1], ["0vw", `-${totalProjects * 90}vw`]);

  // Background big numbers scrolling at a different (slower) speed
  const xBgNumbers = useTransform(smoothProgress, [0, 1], ["0vw", `-${totalProjects * 40}vw`]);

  return (
    <section ref={containerRef} className="relative bg-[#051F20] text-[#DAF1DE]" style={{ height: containerHeight }}>
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        
        {/* BIG NUMBERS BACKGROUND TRACK (Slower) */}
        <motion.div 
          style={{ x: xBgNumbers }}
          className="absolute top-1/2 -translate-y-1/2 flex items-center h-full pointer-events-none z-0 whitespace-nowrap"
        >
           {allProjects.map((p, i) => (
             <div key={`bg-${i}`} className="w-[80vw] mx-[5vw] flex-shrink-0 flex justify-center text-[40vw] font-serif italic text-[#DAF1DE]/5 leading-none select-none">
                0{i + 1}
             </div>
           ))}
        </motion.div>

        {/* MAIN PROJECTS TRACK */}
        <motion.div 
          style={{ x: xMain }}
          className="relative z-10 flex items-center h-full whitespace-nowrap"
        >
          {/* Pad the start so it connects smoothly from Hero's exit */}
          <div className="w-[20vw] flex-shrink-0" />

          {allProjects.map((project, index) => (
             <HorizontalProject 
               key={project.slug} 
               project={project} 
               index={index} 
               progress={smoothProgress} 
               lang={lang}
               totalProjects={totalProjects}
             />
          ))}
          
          {/* Pad the end so the last item can reach the center */}
          <div className="w-[50vw] flex-shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
