"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function ProjectCard({ project, lang }: { project: Project; lang: Lang }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full max-w-7xl mx-auto py-16 border-b border-[#DAF1DE]/10 last:border-0"
    >
      {/* Image Container */}
      <div className="relative w-full md:w-3/5 aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl bg-[#0A2A28] border border-[#DAF1DE]/5">
        <Link href={`/projects/${project.slug}`} className="block w-full h-full">
          {project.screenshots?.[0] ? (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} 
              className="h-full w-full origin-center will-change-transform transform-gpu"
            >
              <Image 
                src={project.screenshots[0]} 
                alt={project.title} 
                fill 
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
              />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-sans text-6xl font-light text-[#DAF1DE]/20">{project.title[0]}</span>
            </div>
          )}
        </Link>
      </div>
      
      {/* Content */}
      <div className="w-full md:w-2/5 flex flex-col justify-center px-4 md:px-0">
        <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-[#8EB69B] mb-4">
          {project.tags.join(" • ")}
        </span>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-sans font-light text-[#DAF1DE] mb-4 tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-white transition-colors">
            {project.title}
          </Link>
        </h3>
        <h4 className="text-lg md:text-xl text-[#8EB69B]/80 mb-6 font-normal">
          {project.subtitle[lang]}
        </h4>
        <p className="text-sm md:text-base text-[#DAF1DE]/60 leading-relaxed font-light mb-8">
          {project.description[lang]}
        </p>
        
        <Link 
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 text-sm text-[#DAF1DE] hover:text-white transition-colors group/link w-fit"
        >
          <span className="font-medium tracking-wide">Explore Project</span>
          <motion.span 
            className="block will-change-transform transform-gpu"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

const CategorySection = ({ title, items, lang }: { title: string; items: Project[]; lang: Lang }) => {
  if (items.length === 0) return null;

  return (
    <div className="relative py-20 md:py-32 w-full">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-4xl font-sans font-light text-[#DAF1DE] tracking-tight"
          >
            {title}
          </motion.h2>
          <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-[#DAF1DE]/20 to-transparent" />
        </div>
        
        <div className="flex flex-col gap-8 md:gap-16">
          {items.map((project) => (
            <ProjectCard key={project.slug} project={project} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FeaturedWork() {
  const { t, lang } = useI18n();

  const naszeSystemy = projects.filter(p => p.category === "nasze-systemy");
  const stronyZrobione = projects.filter(p => p.category === "strony-zrobione");
  const pozostaleProjekty = projects.filter(p => p.category === "projekty");

  return (
    <section id="work" className="relative min-h-screen bg-[#051F20] overflow-hidden">
      <div className="relative z-10 flex min-h-[40vh] md:min-h-[50vh] flex-col items-center justify-end px-6 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-light tracking-tight text-[#DAF1DE] mb-6">
            {t("work.title")}
          </h1>
          <p className="text-base md:text-xl text-[#8EB69B] font-light max-w-2xl mx-auto">
            {t("work.label")} — {t("work.desc" as never) || "Curated selection of high-impact digital products"}
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col pb-40">
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
