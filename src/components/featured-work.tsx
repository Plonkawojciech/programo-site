"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

const NoiseOverlay = () => (
  <div className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.04] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full opacity-50">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

function ProjectCard({ project, lang, index }: { project: Project; lang: Lang; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -25]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotateX, scale, opacity, perspective: 1200 }}
      className={`relative my-32 flex flex-col items-center justify-center group`}
    >
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
        className="absolute -left-10 -top-10 z-0 h-40 w-40 rounded-full bg-green-500/20 blur-3xl" 
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
        className="absolute -bottom-10 -right-10 z-0 h-48 w-48 rounded-full bg-emerald-700/20 blur-3xl" 
      />

      <Link href={`/projects/${project.slug}`} className="relative z-10 block w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-green-900/40 bg-green-950/30 backdrop-blur-xl transition-all hover:border-green-400/60 shadow-[0_0_50px_rgba(16,185,129,0.05)] hover:shadow-[0_0_80px_rgba(16,185,129,0.15)]">
        <div className="flex flex-col lg:flex-row h-full min-h-[500px]">
          <div className="relative w-full lg:w-3/5 h-[300px] lg:h-auto overflow-hidden">
            {project.screenshots?.[0] ? (
              <motion.div whileHover={{ scale: 1.15, rotate: 1 }} transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }} className="h-full w-full origin-center">
                <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000" />
              </motion.div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-900 to-emerald-950">
                <span className="font-headline text-9xl font-black opacity-10 text-green-300">{project.title[0]}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#020a04] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020a04]/80 via-transparent to-transparent opacity-80 lg:block hidden" />
          </div>
          
          <div className="p-8 md:p-12 lg:w-2/5 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#051108] to-[#020603]">
            <motion.div
               animate={{ x: ["-100%", "200%"] }}
               transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
               className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50"
            />
            
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-green-400 mb-6">{project.tags.join(" • ")}</span>
            <h3 className="font-headline text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-green-300 transition-colors drop-shadow-md">{project.title}</h3>
            <h4 className="text-xl md:text-2xl text-green-200/80 mb-6 font-medium">{project.subtitle[lang]}</h4>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed line-clamp-4 font-light">{project.description[lang]}</p>
            
            <motion.div 
               className="mt-10 self-start rounded-full border border-green-500/30 px-8 py-3 text-sm font-bold tracking-widest uppercase text-green-300 backdrop-blur-md transition-all group-hover:bg-green-500/20 group-hover:border-green-400/60"
               whileTap={{ scale: 0.95 }}
            >
              Explore Project
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const CategorySection = ({ title, items, lang }: { title: string; items: Project[]; lang: Lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [-300, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  if (items.length === 0) return null;

  return (
    <div className="relative py-32 w-full" ref={ref}>
      <motion.div 
        style={{ opacity }} 
        className="absolute top-1/2 -translate-y-1/2 w-full z-0 overflow-hidden whitespace-nowrap opacity-[0.03] mix-blend-screen pointer-events-none"
      >
        <motion.h2 
          style={{ x }} 
          className="font-headline text-[25vw] font-black text-green-500 uppercase tracking-tighter"
        >
          {title} {title} {title}
        </motion.h2>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-24 flex items-center justify-center gap-8 md:gap-16">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white text-center whitespace-nowrap drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {title}
          </motion.h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
        </div>
        
        <div className="flex flex-col gap-20">
          {items.map((project, idx) => (
            <ProjectCard key={project.slug} project={project} lang={lang} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FeaturedWork() {
  const { t, lang } = useI18n();
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const naszeSystemy = projects.filter(p => p.category === "nasze-systemy");
  const stronyZrobione = projects.filter(p => p.category === "strony-zrobione");
  const pozostaleProjekty = projects.filter(p => p.category === "projekty");

  return (
    <section id="work" ref={container} className="relative min-h-screen bg-[#020804] overflow-hidden">
      <NoiseOverlay />
      
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: ["0%", "30%", "0%"],
            y: ["0%", "20%", "0%"],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] h-[80vh] w-[80vw] rounded-full bg-emerald-900/10 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: ["0%", "-40%", "0%"],
            y: ["0%", "30%", "0%"],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[0%] h-[70vh] w-[70vw] rounded-full bg-green-800/10 blur-[180px]"
        />
      </div>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 origin-left z-50 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
        style={{ scaleX }}
      />

      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative inline-block"
        >
          <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -inset-20 rounded-full border-[1px] border-dashed border-green-500/20 opacity-50"
          />
          <motion.div
             animate={{ rotate: -360 }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="absolute -inset-32 rounded-full border-[1px] border-dotted border-green-400/10 opacity-30"
          />
          <h1 className="font-headline text-[15vw] md:text-[10vw] leading-none font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-green-100 to-green-900 drop-shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            {t("work.title")}
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 max-w-3xl text-lg md:text-2xl text-green-100/60 font-light tracking-widest uppercase"
        >
          {t("work.label")} — {t("work.desc" as never) || "Curated selection of high-impact digital products"}
        </motion.p>
      </div>

      <div className="relative z-10 flex flex-col gap-32 pb-60">
        <CategorySection 
          title={lang === 'pl' ? "Nasze Systemy" : "Our Systems"} 
          items={naszeSystemy} 
          lang={lang} 
        />
        <CategorySection 
          title={lang === 'pl' ? "Strony Które Zrobiliśmy" : "Websites We Made"} 
          items={stronyZrobione} 
          lang={lang} 
        />
        <CategorySection 
          title={lang === 'pl' ? "Projekty" : "Projects"} 
          items={pozostaleProjekty} 
          lang={lang} 
        />
      </div>
    </section>
  );
}
