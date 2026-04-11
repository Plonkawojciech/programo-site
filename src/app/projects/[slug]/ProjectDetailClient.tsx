"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { getProjectBySlug, getAdjacentProjects, type Project, type SubProduct } from "@/lib/projects";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function ParallaxImage({ src, alt, speed = 0.5, className = "" }: { src: string, alt: string, speed?: number, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: 1.15 }} className="absolute inset-0 w-full h-full origin-center">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

function ProjectImage({ src, alt, priority = false, parallaxY = 0, accentColor, scale = 1 }: { src: string, alt: string, priority?: boolean, parallaxY?: any, accentColor?: string, scale?: any }) {
  const isPlaceholder = src.includes("PLACEHOLDER");
  const isIcon = src.includes("-icon.");

  if (isPlaceholder) {
    const placeholderText = src.replace("/", "").replace(".png", "").replace(/_/g, " ");
    return (
      <motion.div style={parallaxY ? { y: parallaxY, scale: scale || 1 } : { scale: scale || 1 }} className="absolute inset-0 flex items-center justify-center bg-surface-container-high border border-outline-variant/10">
        <span className="text-on-surface-variant/40 font-headline text-2xl uppercase tracking-widest font-bold text-center px-6">
          [Wstaw zdjęcie: {placeholderText}]
        </span>
      </motion.div>
    );
  }

  if (isIcon) {
    const accent = accentColor || "#6abf69";
    return (
      <motion.div style={parallaxY ? { y: parallaxY, scale: scale || 1 } : { scale: scale || 1 }} className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${accent}18 0%, #0a0a0a 70%)` }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative w-32 h-32 md:w-48 md:h-48 2xl:w-56 2xl:h-56 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ boxShadow: `0 0 80px ${accent}30, 0 25px 50px rgba(0,0,0,0.5)` }}>
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              className="object-cover"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div style={parallaxY ? { y: parallaxY, scale: scale || 1 } : { scale: scale || 1 }} className="absolute inset-0 h-[120%] -top-[10%] w-full transform-gpu will-change-transform">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover opacity-90"
      />
    </motion.div>
  );
}

function ProjectContent({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const project = getProjectBySlug(slug);
  const { prev, next } = getAdjacentProjects(slug);
  
  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const smoothImageScale = useSpring(imageScale, { stiffness: 100, damping: 30 });

  if (!project) return null;

  const formattedDescription = project.longDescription[lang].split('\n').filter(line => line.trim() !== '');
  const hasIconScreenshots = project.screenshots?.some(s => s.includes("-icon.")) ?? false;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <Navbar />

      <main>
        {/* Cinematic Hero - Massive Typography Overlap */}
        <section ref={headerRef} className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
          <motion.div className="absolute inset-0 h-full w-full">
             {project.subProducts && project.subProducts.length > 0 ? (
               <motion.div style={{ y: headerY }} className="absolute inset-0">
                 <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${project.accentColor}15 0%, #0a0a0a 65%)` }} />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="flex items-center gap-8 md:gap-16">
                     {project.subProducts.map((sub, i) => (
                       <div key={sub.name} className="relative w-24 h-24 md:w-40 md:h-40 rounded-3xl overflow-hidden ring-1 ring-white/10" style={{ boxShadow: `0 0 60px ${sub.accentColor || project.accentColor}25` }}>
                         {sub.icon && <Image src={sub.icon} alt={sub.name} fill priority className="object-cover" />}
                       </div>
                     ))}
                   </div>
                 </div>
               </motion.div>
             ) : project.screenshots?.[0] ? (
               <ProjectImage src={project.screenshots[0]} alt={project.title} priority={true} parallaxY={headerY} accentColor={project.accentColor} scale={smoothImageScale} />
             ) : (
               <div className="h-full w-full bg-[#0A0A0A]" />
             )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
          </motion.div>

          <div className="relative flex h-full flex-col justify-center items-center px-6 md:px-24 text-white mx-auto max-w-[2560px] text-center pointer-events-none">
            <motion.div
              style={{ opacity: headerOpacity }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-6 mb-8 overflow-hidden">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/50">{project.year}</span>
                <span className="w-16 h-px bg-white/30" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/50">{project.tags[0]}</span>
              </div>
              <h1 className="font-serif italic text-[18vw] md:text-[14vw] font-light leading-[0.8] tracking-tighter mix-blend-overlay opacity-90 whitespace-nowrap">
                {project.title}
              </h1>
              <h1 className="font-sans text-[15vw] md:text-[12vw] font-black uppercase leading-[0.8] tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-plus-lighter whitespace-nowrap text-white/80">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* The Story / Editorial Overview */}
        <section className="relative z-10 bg-[#FDFDFD] px-6 py-32 md:px-12 lg:px-24 md:py-56">
          <div className="mx-auto max-w-[2560px]">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-20 md:gap-32"
            >
              {/* Massive Pull Quote on Left */}
              <div className="lg:col-span-5 flex flex-col justify-start">
                <div className="sticky top-40">
                  <h2 className="font-serif text-5xl md:text-7xl lg:text-[5rem] font-light italic tracking-tight text-[#0A0A0A] leading-[1.1] mb-12">
                    "{project.subtitle[lang]}"
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-8">
                     {project.tech.map((t) => (
                      <span key={t} className="px-4 py-2 rounded-full border border-[#0A0A0A]/10 text-xs font-mono uppercase tracking-widest text-[#0A0A0A]/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Paragraphs on Right */}
              <div className="lg:col-span-7 flex flex-col gap-12 pt-12 lg:pt-0">
                <div className="grid grid-cols-2 gap-8 border-b border-[#0A0A0A]/10 pb-12 mb-12">
                   <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0A0A0A]/40 mb-2">Role</h3>
                      <p className="font-sans text-xl md:text-2xl text-[#0A0A0A]">{project.role[lang]}</p>
                   </div>
                   {project.liveUrl && (
                     <div className="flex items-end justify-end">
                       <a href={project.liveUrl} target="_blank" className="group inline-flex items-center gap-4 border-b border-[#0A0A0A] pb-1">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0A0A0A]">Live Site</span>
                          <span className="transform transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
                       </a>
                     </div>
                   )}
                </div>

                <div className="flex flex-col gap-10">
                  {formattedDescription.map((paragraph, idx) => {
                    if (paragraph.includes('•') || paragraph.startsWith('Darmowe:') || paragraph.startsWith('Płatne:')) return null;
                    return (
                      <p key={idx} className="text-xl md:text-3xl font-light leading-relaxed text-[#0A0A0A]/70">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* Asymmetric Grids for Screenshots */}
        {project.screenshots && project.screenshots.length > 1 && !hasIconScreenshots && !project.subProducts?.length && (
          <section className="w-full pb-32 md:pb-56 px-6 md:px-12 lg:px-24">
            <div className="mx-auto max-w-[2560px] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2 }}
                className="md:col-span-8 relative aspect-[16/10] overflow-hidden rounded-3xl"
              >
                <ParallaxImage src={project.screenshots[1]} alt="Detail 1" className="w-full h-full" speed={0.2} />
              </motion.div>

              {project.screenshots[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="md:col-span-4 relative aspect-[4/5] overflow-hidden rounded-3xl mt-12 md:mt-48"
                >
                  <ParallaxImage src={project.screenshots[2]} alt="Detail 2" className="w-full h-full" speed={0.3} />
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Sub-Products Ecosystem */}
        {project.subProducts && project.subProducts.length > 0 && (
          <section className="bg-[#0A0A0A] text-white py-32 md:py-56 px-6 md:px-12 lg:px-24 rounded-t-[3rem] md:rounded-t-[5rem]">
            <div className="mx-auto max-w-[2560px]">
              <div className="text-center mb-32">
                <h2 className="font-serif italic text-6xl md:text-[8rem] font-light tracking-tighter leading-none mb-8 text-[#FDFDFD]">
                  {lang === "pl" ? "Ekosystem" : "Ecosystem"}
                </h2>
                <p className="font-sans text-xl md:text-3xl font-light text-[#FDFDFD]/50 max-w-2xl mx-auto">
                  {lang === "pl" ? "Zintegrowane rozwiązania dla jednego celu." : "Integrated solutions for one goal."}
                </p>
              </div>

              {project.subProducts.map((sub, idx) => {
                const isReversed = idx % 2 !== 0;
                return (
                  <div key={sub.name} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 md:gap-32 items-center mb-32 md:mb-56`}>
                    <div className="lg:w-1/2">
                       <h3 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter mb-6">{sub.name}</h3>
                       <p className="font-serif italic text-2xl md:text-4xl text-white/70 mb-8">{sub.tagline[lang]}</p>
                       <p className="text-lg md:text-xl font-light text-white/50 leading-relaxed mb-12">{sub.description[lang]}</p>
                    </div>
                    <div className="lg:w-1/2 flex flex-col gap-8 w-full">
                       {sub.screenshots.slice(0,2).map((s, i) => (
                         <div key={i} className={`relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl ${i === 1 ? 'w-4/5 ml-auto -mt-20 z-10' : 'w-full z-0'}`}>
                           <Image src={s} alt={sub.name} fill className="object-cover" />
                         </div>
                       ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Capabilities Editorial View */}
        <section className="bg-[#FDFDFD] py-32 md:py-48 px-6 md:px-12 lg:px-24 border-t border-[#0A0A0A]/10">
          <div className="mx-auto max-w-[2560px]">
            <h2 className="font-sans text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-[#0A0A0A] mb-24 md:mb-40">
              Capabilities<span className="text-primary">.</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-x-24 gap-y-16">
              {project.features[lang].map((f, i) => {
                const cleanF = f.replace(/•/g, '').trim();
                const parts = cleanF.split('—');
                const hasTitle = parts.length > 1;

                return (
                  <div key={i} className="group border-t-2 border-[#0A0A0A] pt-8 flex gap-8">
                    <span className="font-serif italic text-3xl text-[#0A0A0A]/30 group-hover:text-primary transition-colors">
                      0{i + 1}
                    </span>
                    <div>
                      {hasTitle ? (
                        <>
                          <h4 className="font-sans text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">{parts[0].trim()}</h4>
                          <p className="font-serif text-xl font-light text-[#0A0A0A]/70 leading-relaxed">{parts[1].trim()}</p>
                        </>
                      ) : (
                        <h4 className="font-sans text-3xl md:text-4xl font-bold text-[#0A0A0A]">{cleanF}</h4>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Next Project Footer */}
        {next && (
          <section className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
            <Link href={`/projects/${next.slug}`} className="group flex h-full w-full items-center justify-center">
              <div className="absolute inset-0 z-0">
                {next.screenshots?.[0] && !next.screenshots[0].includes("-icon.") && (
                  <Image src={next.screenshots[0]} alt={next.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-1000" />
              </div>
              
              <div className="relative z-10 text-center flex flex-col items-center pointer-events-none">
                <span className="mb-6 font-mono text-xs uppercase tracking-[0.5em] text-white/50 group-hover:text-white transition-colors">Next Project</span>
                <h2 className="font-serif italic text-[12vw] md:text-[10vw] font-light leading-none tracking-tighter text-white">
                  {next.title}
                </h2>
              </div>
            </Link>
          </section>
        )}
      </main>

      {!next && <Footer />}
    </div>
  );
}

export default function ProjectDetailClient({ slug }: { slug: string }) {
  return (
    <I18nProvider>
      <ProjectContent slug={slug} />
    </I18nProvider>
  );
}
