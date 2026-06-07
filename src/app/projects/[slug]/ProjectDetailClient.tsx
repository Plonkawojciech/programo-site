"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { getProjectBySlug, getAdjacentProjects, type Project, type SubProduct } from "@/lib/projects";
import { useSmoothInput } from "@/lib/use-smooth-input";

function ParallaxImage({ src, alt, speed = 0.5, className = "", enabled = true }: { src: string, alt: string, speed?: number, className?: string, enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y: enabled ? y : 0, scale: enabled ? 1.15 : 1 }} className="absolute inset-0 w-full h-full origin-center">
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
        className="object-cover opacity-70 blur-2xl scale-110"
      />
    </motion.div>
  );
}

// Single App-Store-style phone mockup: rounded bezel + notch, screenshot inside.
function PhoneFrame({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative mx-auto w-[220px] sm:w-[230px] lg:w-[250px]">
      {/* Device body — dark bezel with rounded corners */}
      <div className="relative aspect-[9/19.5] rounded-[2.6rem] bg-[#0A0A0A] p-[3px] shadow-2xl ring-1 ring-white/10">
        {/* Inner screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-[#0A0A0A]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="260px"
            className="object-cover object-top"
          />
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-10 h-[1.45rem] w-[38%] -translate-x-1/2 rounded-b-2xl bg-[#0A0A0A]" />
        </div>
      </div>
    </div>
  );
}

// App-Store-style showcase: phone mockups floating on a dark stage with accent glow.
function PhoneGallery({
  screenshots,
  title,
  accentColor,
  lang,
}: {
  screenshots: string[];
  title: string;
  accentColor: string;
  lang: Lang;
}) {
  const shots = screenshots.filter((s) => !s.includes("PLACEHOLDER") && !s.includes("-icon."));
  if (shots.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0A] py-24 md:py-36 px-6 sm:px-8 md:px-12 lg:px-20 rounded-t-[2rem] md:rounded-t-[4rem]">
      {/* Accent stage glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${accentColor}1f 0%, #0a0a0a 65%)` }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24 text-center">
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/40">
            {lang === "pl" ? "Aplikacja mobilna" : "Mobile app"}
          </span>
          <h2 className="mt-4 font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-none text-[#FDFDFD] break-words">
            {lang === "pl" ? "iOS i Android" : "iOS & Android"}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-12 sm:flex-row sm:flex-wrap sm:items-end md:gap-10 lg:gap-14">
          {shots.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              // Center phone sits slightly raised for an App-Store hero arrangement.
              className={`shrink-0${i === 1 ? " sm:-translate-y-8 md:-translate-y-12" : ""}`}
            >
              <PhoneFrame src={src} alt={`${title} — ${lang === "pl" ? "ekran aplikacji" : "app screen"} ${i + 1}`} priority={i === 0} />
            </motion.div>
          ))}
        </div>

        {/* TODO: add store badges (App Store / Google Play) once the app is published */}
      </div>
    </section>
  );
}

function ProjectContent({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const project = getProjectBySlug(slug);
  const { prev, next } = getAdjacentProjects(slug);
  const smooth = useSmoothInput();
  
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
      <div>
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
               <ProjectImage src={project.screenshots[0]} alt={project.title} priority={true} parallaxY={smooth ? headerY : 0} accentColor={project.accentColor} scale={smooth ? smoothImageScale : 1} />
             ) : (
               <div className="h-full w-full bg-[#0A0A0A]" />
             )}
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-95" />
          </motion.div>

          <div className="relative flex h-full flex-col justify-center items-center px-4 sm:px-6 md:px-12 text-white mx-auto max-w-7xl text-center">
            <motion.div
              style={{ opacity: headerOpacity }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col items-center pointer-events-none w-full"
            >
              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 overflow-hidden">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/60">{project.year}</span>
                <span className="w-10 md:w-16 h-px bg-white/40" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/60">{project.tags[0]}</span>
              </div>
              <h1 className="font-sans font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.5)] max-w-full break-words" style={{ fontSize: 'clamp(2.5rem, 13vw, 10rem)' }}>
                {project.title}
              </h1>
              <p className="mt-4 md:mt-6 font-serif italic text-sm sm:text-base md:text-xl font-light text-white/70 max-w-xl leading-snug px-4">
                {project.subtitle[lang]}
              </p>
            </motion.div>

            {/* Scroll indicator — animated arrows + line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.4 }}
              style={{ opacity: headerOpacity }}
              className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
                {lang === "pl" ? "Przewiń" : "Scroll"}
              </span>
              <motion.div
                animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-12 bg-gradient-to-b from-transparent via-white/80 to-white origin-top"
              />
              <motion.div
                animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center -space-y-2"
              >
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-white/70">
                  <path d="M1 1L9 8L17 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-white">
                  <path d="M1 1L9 8L17 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* The Story / Editorial Overview */}
        <section className="relative z-10 bg-[#FDFDFD] px-6 py-24 sm:px-8 md:px-12 lg:px-20 md:py-40">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-20"
            >
              {/* Pull Quote on Left */}
              <div className="lg:col-span-5 flex flex-col justify-start min-w-0">
                <div className="lg:sticky lg:top-32">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic tracking-tight text-[#0A0A0A] leading-[1.15] mb-8 md:mb-10 break-words hyphens-auto">
                    "{project.subtitle[lang]}"
                  </h2>
                  <div className="flex flex-wrap gap-2 md:gap-3 mt-6">
                     {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1.5 rounded-full border border-[#0A0A0A]/10 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#0A0A0A]/60 whitespace-nowrap">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Paragraphs on Right */}
              <div className="lg:col-span-7 flex flex-col gap-10 lg:pt-0 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-b border-[#0A0A0A]/10 pb-10 mb-2">
                   <div className="min-w-0">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0A0A0A]/40 mb-3">Made by</h3>
                      <Link href="/" aria-label="Programo" className="inline-flex items-center group">
                        <Image
                          src="/programo-logo-dark.svg"
                          alt="Programo"
                          width={240}
                          height={170}
                          className="h-auto w-[140px] md:w-[160px] select-none transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </Link>
                   </div>
                   {project.liveUrl && (
                     <div className="flex items-end sm:justify-end">
                       <a href={project.liveUrl} target="_blank" className="group inline-flex items-center gap-3 border-b border-[#0A0A0A] pb-1">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0A0A0A]">{project.status === "live" ? "Live Site" : "Podgląd"}</span>
                          <span className="transform transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
                       </a>
                     </div>
                   )}
                </div>

                <div className="flex flex-col gap-6 md:gap-8">
                  {formattedDescription.map((paragraph, idx) => {
                    if (paragraph.includes('•') || paragraph.startsWith('Darmowe:') || paragraph.startsWith('Płatne:')) return null;
                    const isHeading = /^(Co robi|Co zrobiliśmy|Na czym (jest|będzie) zbudowan[ay]|Jak (jest|to) zbudowane|Stack|Dlaczego tak|Dlaczego (tak|w ten sposób)|Efekt|Why|Why this way|What it does|What we did|How it'?s built|Outcome):?\s*$/i.test(paragraph.trim());
                    if (isHeading) {
                      return (
                        <h3 key={idx} className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#0A0A0A]/50 mt-4 first:mt-0">
                          {paragraph.replace(/:$/, '')}
                        </h3>
                      );
                    }
                    return (
                      <p key={idx} className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-[#0A0A0A]/75 break-words hyphens-auto">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* App-Store-style phone gallery — only for mobile-app projects */}
        {project.kind === "mobile-app" && project.screenshots && project.screenshots.length > 0 && (
          <PhoneGallery
            screenshots={project.screenshots}
            title={project.title}
            accentColor={project.accentColor}
            lang={lang}
          />
        )}

        {/* Asymmetric Grids for Screenshots */}
        {project.kind !== "mobile-app" && project.screenshots && project.screenshots.length > 1 && !hasIconScreenshots && !project.subProducts?.length && (
          <section className="w-full pb-20 md:pb-32 px-6 sm:px-8 md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2 }}
                className="md:col-span-8 relative aspect-[16/10] overflow-hidden rounded-2xl md:rounded-3xl"
              >
                <ParallaxImage src={project.screenshots[1]} alt={`${project.title} — zrzut ekranu`} className="w-full h-full" speed={0.2} enabled={smooth} />
              </motion.div>

              {project.screenshots[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="md:col-span-4 relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl md:mt-24"
                >
                  <ParallaxImage src={project.screenshots[2]} alt={`${project.title} — interfejs`} className="w-full h-full" speed={0.3} enabled={smooth} />
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Sub-Products Ecosystem */}
        {project.subProducts && project.subProducts.length > 0 && (
          <section className="bg-[#0A0A0A] text-white py-24 md:py-36 px-6 sm:px-8 md:px-12 lg:px-20 rounded-t-[2rem] md:rounded-t-[4rem]">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-20 md:mb-28">
                <h2 className="font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none mb-6 text-[#FDFDFD] break-words">
                  {lang === "pl" ? "Ekosystem" : "Ecosystem"}
                </h2>
                <p className="font-sans text-base sm:text-lg md:text-xl font-light text-[#FDFDFD]/50 max-w-2xl mx-auto">
                  {lang === "pl" ? "Zintegrowane rozwiązania dla jednego celu." : "Integrated solutions for one goal."}
                </p>
              </div>

              {project.subProducts.map((sub, idx) => {
                const isReversed = idx % 2 !== 0;
                return (
                  <div key={sub.name} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 md:gap-16 lg:gap-20 items-center mb-20 md:mb-32 last:mb-0`}>
                    <div className="lg:w-1/2 min-w-0">
                       <h3 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 break-words">{sub.name}</h3>
                       <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white/70 mb-6 break-words">{sub.tagline[lang]}</p>
                       <p className="text-base md:text-lg font-light text-white/60 leading-relaxed break-words">{sub.description[lang]}</p>
                    </div>
                    <div className="lg:w-1/2 flex flex-col gap-6 w-full">
                       {sub.screenshots.slice(0,2).map((s, i) => (
                         <div key={i} className={`relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl ${i === 1 ? 'w-4/5 ml-auto -mt-10 md:-mt-16 z-10' : 'w-full z-0'}`}>
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
        <section className="bg-[#FDFDFD] py-24 md:py-36 px-6 sm:px-8 md:px-12 lg:px-20 border-t border-[#0A0A0A]/10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-[#0A0A0A] mb-16 md:mb-24 break-words">
              Capabilities<span className="text-primary">.</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-10 md:gap-y-12">
              {project.features[lang].filter(f => f.trim() !== '').map((f, i) => {
                const cleanF = f.replace(/•/g, '').trim();
                const parts = cleanF.split('—');
                const hasTitle = parts.length > 1;

                return (
                  <div key={i} className="group border-t-2 border-[#0A0A0A] pt-6 flex gap-4 md:gap-6 min-w-0">
                    <span className="font-serif italic text-xl md:text-2xl text-[#0A0A0A]/30 group-hover:text-primary transition-colors shrink-0">
                      0{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      {hasTitle ? (
                        <>
                          <h4 className="font-sans text-lg sm:text-xl md:text-2xl font-bold text-[#0A0A0A] mb-2 break-words">{parts[0].trim()}</h4>
                          <p className="font-serif text-sm sm:text-base md:text-lg font-light text-[#0A0A0A]/70 leading-relaxed break-words">{parts.slice(1).join('—').trim()}</p>
                        </>
                      ) : (
                        <h4 className="font-sans text-lg sm:text-xl md:text-2xl font-bold text-[#0A0A0A] break-words">{cleanF}</h4>
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
              
              <div className="relative z-10 text-center flex flex-col items-center pointer-events-none px-6 max-w-full">
                <span className="mb-4 md:mb-6 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/50 group-hover:text-white transition-colors">Next Project</span>
                <h2 className="font-serif italic font-light leading-none tracking-tighter text-white max-w-full break-words" style={{ fontSize: 'clamp(3rem, 11vw, 9rem)' }}>
                  {next.title}
                </h2>
              </div>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetailClient({ slug }: { slug: string }) {
  return <ProjectContent slug={slug} />;
}
