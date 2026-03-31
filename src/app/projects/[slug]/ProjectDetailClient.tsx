"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { getProjectBySlug, getAdjacentProjects, type SubProduct } from "@/lib/projects";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function ProjectImage({ src, alt, priority = false, parallaxY = 0, accentColor }: { src: string, alt: string, priority?: boolean, parallaxY?: any, accentColor?: string }) {
  const isPlaceholder = src.includes("PLACEHOLDER");
  const isIcon = src.includes("-icon.");

  if (isPlaceholder) {
    const placeholderText = src.replace("/", "").replace(".png", "").replace(/_/g, " ");
    return (
      <motion.div style={parallaxY ? { y: parallaxY } : {}} className="absolute inset-0 flex items-center justify-center bg-surface-container-high border border-outline-variant">
        <span className="text-on-surface-variant/40 font-headline text-2xl uppercase tracking-widest font-bold text-center px-6">
          [Insert image: {placeholderText}]
        </span>
      </motion.div>
    );
  }

  if (isIcon) {
    const accent = accentColor || "#6abf69";
    return (
      <motion.div style={parallaxY ? { y: parallaxY } : {}} className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${accent}18 0%, #09090B 70%)` }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative w-32 h-32 md:w-48 md:h-48 2xl:w-56 2xl:h-56 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ boxShadow: `0 0 80px ${accent}30, 0 25px 50px rgba(0,0,0,0.5)` }}>
            <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
          </div>
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/30">
            {alt}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div style={parallaxY ? { y: parallaxY } : {}} className="absolute inset-0 h-[120%] -top-[10%] w-full">
      <Image src={src} alt={alt} fill priority={priority} className="object-cover opacity-90 transition-all duration-1000" />
    </motion.div>
  );
}

function ProjectContent({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const project = getProjectBySlug(slug);
  const { next } = getAdjacentProjects(slug);

  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  if (!project) return null;

  const formattedDescription = project.longDescription[lang].split('\n').filter(line => line.trim() !== '');
  const hasIconScreenshots = project.screenshots?.some(s => s.includes("-icon.")) ?? false;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main>
        {/* Cinematic Hero */}
        <section ref={headerRef} className="relative h-screen w-full overflow-hidden bg-bg">
          <motion.div style={{ scale: imageScale }} className="absolute inset-0 h-full w-full">
            {project.subProducts && project.subProducts.length > 0 ? (
              <motion.div style={headerY ? { y: headerY } : {}} className="absolute inset-0">
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${project.accentColor}15 0%, #09090B 65%)` }} />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(${project.accentColor} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-8 md:gap-16 2xl:gap-24">
                    {project.subProducts.map((sub, i) => (
                      <motion.div
                        key={sub.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center gap-4 md:gap-6"
                      >
                        {sub.icon && (
                          <div className="relative w-20 h-20 md:w-32 md:h-32 2xl:w-40 2xl:h-40 rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-white/10" style={{ boxShadow: `0 0 60px ${sub.accentColor || project.accentColor}25, 0 20px 40px rgba(0,0,0,0.4)` }}>
                            <Image src={sub.icon} alt={sub.name} fill priority className="object-cover" />
                          </div>
                        )}
                        <span className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.3em] text-white/25">
                          {sub.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : project.screenshots?.[0] ? (
              <ProjectImage src={project.screenshots[0]} alt={project.title} priority={true} parallaxY={headerY} accentColor={project.accentColor} />
            ) : (
              <div className="h-full w-full bg-bg" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>

          <div className="relative flex h-full flex-col justify-end px-6 pb-24 md:px-24 2xl:px-40 text-on-surface mx-auto max-w-[2560px]">
            <motion.div
              style={{ opacity: headerOpacity }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div className="flex items-center gap-6 mb-8 overflow-hidden">
                <motion.span initial={{x: -50}} animate={{x: 0}} transition={{delay: 0.8, duration: 1}} className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-primary">
                  {project.year}
                </motion.span>
                <motion.span initial={{scaleX: 0}} animate={{scaleX: 1}} transition={{delay: 1, duration: 1}} className="w-16 h-px bg-primary/50 origin-left" />
                <motion.span initial={{x: 50}} animate={{x: 0}} transition={{delay: 0.8, duration: 1}} className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-on-surface/70">
                  {project.tags[0]}
                </motion.span>
              </div>
              <h1 className="font-headline text-[15vw] md:text-[12vw] 2xl:text-[10vw] font-bold leading-[0.85] tracking-tighter">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Overview */}
        <section className="relative z-10 bg-bg px-6 py-32 md:px-24 2xl:px-40 md:py-48">
          <div className="mx-auto max-w-[2560px]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-20 md:gap-32"
            >
              <div className="lg:col-span-8 flex flex-col gap-12">
                <h2 className="font-headline text-5xl md:text-7xl 2xl:text-8xl font-medium tracking-tight text-on-surface leading-[1.1] mb-12">
                  {project.subtitle[lang]}
                </h2>
                <div className="flex flex-col gap-10">
                  {formattedDescription.map((paragraph, idx) => {
                    const isFeatureList = paragraph.includes('\u2022') || paragraph.startsWith('Darmowe:') || paragraph.startsWith('P\u0142atne:');
                    if (isFeatureList) return null;
                    return (
                      <p key={idx} className="text-xl md:text-2xl 2xl:text-4xl font-light leading-relaxed text-on-surface-variant max-w-4xl">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-16 lg:pl-16 lg:border-l border-outline-variant">
                <div>
                  <span className="block w-4 h-px bg-primary mb-6" />
                  <h3 className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Role</h3>
                  <p className="font-headline text-3xl 2xl:text-4xl text-on-surface">{project.role[lang]}</p>
                </div>

                <div>
                  <span className="block w-4 h-px bg-primary mb-6" />
                  <h3 className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Technologies</h3>
                  <div className="flex flex-col gap-3">
                    {project.tech.map((techItem) => (
                      <span key={techItem} className="text-base 2xl:text-xl font-light text-on-surface border-b border-outline-variant pb-3">
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>

                {project.liveUrl && (
                  <div className="pt-8">
                    <a href={project.liveUrl} target="_blank" className="group inline-flex items-center gap-6">
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary transition-transform duration-500 group-hover:scale-110">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="text-sm 2xl:text-lg font-bold uppercase tracking-[0.3em] text-on-surface group-hover:text-primary transition-colors">
                        Launch
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Edge-to-Edge Image */}
        {project.screenshots && project.screenshots.length > 1 && !hasIconScreenshots && !project.subProducts?.length && (
          <section className="w-full pb-32 md:pb-48">
            <motion.div
              initial={{ opacity: 0, clipPath: "inset(10% 0 10% 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-[60vh] md:h-[120vh] overflow-hidden"
            >
              <ProjectImage src={project.screenshots[1]} alt={`${project.title} detailed view`} accentColor={project.accentColor} />
            </motion.div>
          </section>
        )}

        {/* Sub-Products Ecosystem */}
        {project.subProducts && project.subProducts.length > 0 && (
          <>
            <section className="bg-bg py-24 md:py-40 px-6 md:px-24 2xl:px-40 overflow-hidden border-t border-outline-variant">
              <div className="mx-auto max-w-[2560px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center mb-8"
                >
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-on-surface-variant block mb-8">
                    {lang === "pl" ? "Ekosystem" : "Ecosystem"}
                  </span>
                  <h2 className="font-headline text-5xl md:text-8xl 2xl:text-[9vw] font-bold tracking-tighter text-on-surface leading-[0.9]">
                    {lang === "pl" ? "Trzy produkty." : "Three products."}
                    <br />
                    <span className="italic font-light gradient-text">
                      {lang === "pl" ? "Jeden cel." : "One goal."}
                    </span>
                  </h2>
                </motion.div>
              </div>
            </section>

            {project.subProducts.map((sub, idx) => {
              const isReversed = idx % 2 !== 0;
              const accent = sub.accentColor || project.accentColor;

              return (
                <section key={sub.name} className="bg-bg overflow-hidden px-6 md:px-24 2xl:px-40 py-20 md:py-28">
                  <div className="mx-auto max-w-[2560px] grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={isReversed ? 'lg:order-2' : ''}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        {sub.icon && (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10" style={{ boxShadow: `0 0 30px ${accent}20` }}>
                            <Image src={sub.icon} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-on-surface-variant">
                          {(idx + 1).toString().padStart(2, '0')} / {project.subProducts!.length.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-on-surface mb-3 leading-[1.05]">
                        {sub.name}
                      </h3>
                      <p className="font-headline text-xl md:text-2xl font-light mb-6" style={{ color: accent }}>
                        {sub.tagline[lang]}
                      </p>
                      <p className="text-base md:text-lg font-light leading-relaxed text-on-surface-variant mb-8 max-w-lg">
                        {sub.description[lang]}
                      </p>
                      {sub.liveUrl && (
                        <a href={sub.liveUrl} target="_blank" className="group inline-flex items-center gap-4">
                          <span className="relative flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: accent }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="#000" strokeWidth="2.5" strokeLinecap="square"/></svg>
                          </span>
                          <span className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-on-surface transition-colors">
                            {lang === "pl" ? "Otw\u00f3rz" : "Launch"}
                          </span>
                        </a>
                      )}
                    </motion.div>

                    <div className={`flex flex-col gap-4 md:gap-5 ${isReversed ? 'lg:order-1' : ''}`}>
                      {sub.screenshots.slice(0, 2).map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30 + i * 10, scale: 0.97 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="group relative overflow-hidden rounded-xl md:rounded-2xl"
                          style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px -12px ${accent}12` }}
                        >
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <Image src={s} alt={`${sub.name} \u2014 ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {idx < project.subProducts!.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="mx-auto max-w-[2560px] h-px bg-outline-variant origin-left mt-20 md:mt-28"
                    />
                  )}
                </section>
              );
            })}
          </>
        )}

        {/* Capabilities */}
        <section className="bg-bg py-24 md:py-32 px-6 md:px-24 2xl:px-40 border-t border-outline-variant">
          <div className="mx-auto max-w-[2560px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-24 md:mb-40 text-center"
            >
              <h2 className="font-headline text-5xl md:text-8xl 2xl:text-[8vw] font-bold tracking-tighter text-on-surface">
                Platform <span className="italic gradient-text font-light">Capabilities.</span>
              </h2>
            </motion.div>

            <div className="grid gap-x-16 gap-y-20 md:gap-y-32 md:grid-cols-2">
              {project.features[lang].map((f, i) => {
                const cleanF = f.replace(/\u2022/g, '').trim();
                const parts = cleanF.split('\u2014');
                const hasTitle = parts.length > 1;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 2) * 0.1, duration: 1 }}
                    className="flex flex-col gap-6 md:gap-10 border-t border-outline-variant pt-8"
                  >
                    <span className="font-headline text-2xl italic text-primary/40">{(i + 1).toString().padStart(2, '0')}</span>
                    {hasTitle ? (
                      <div>
                        <h4 className="font-headline text-3xl 2xl:text-5xl font-medium text-on-surface mb-4 leading-tight">{parts[0].trim()}</h4>
                        <p className="text-lg 2xl:text-2xl font-light leading-relaxed text-on-surface-variant">
                          {parts[1].trim()}
                        </p>
                      </div>
                    ) : (
                      <h4 className="font-headline text-3xl 2xl:text-5xl font-medium text-on-surface leading-tight">
                        {cleanF}
                      </h4>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Screens */}
        {project.screenshots && project.screenshots.length > 2 && !hasIconScreenshots && !project.subProducts?.length && (
          <section className="w-full pb-32 md:pb-48 px-6 md:px-24 2xl:px-40">
            <div className="mx-auto max-w-[2560px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {project.screenshots.slice(2, 4).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] 2xl:rounded-[4rem]"
                >
                  <ProjectImage src={s} alt={`${project.title} view ${i}`} accentColor={project.accentColor} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Next Project */}
        {next && (
          <section className="relative h-screen w-full overflow-hidden bg-bg">
            <Link href={`/projects/${next.slug}`} className="group flex h-full w-full items-center justify-center">
              <div className="absolute inset-0 z-0">
                {next.screenshots?.[0] && !next.screenshots[0].includes("-icon.") && (
                  <ProjectImage src={next.screenshots[0]} alt={next.title} accentColor={next.accentColor} />
                )}
                <div className="absolute inset-0 bg-black/60 transition-opacity duration-1000 group-hover:bg-black/30" />
              </div>

              <div className="relative z-10 text-center flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <span className="mb-8 block text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-on-surface-variant group-hover:text-primary transition-colors">
                    Next Project
                  </span>
                  <h2 className="font-headline text-[15vw] font-bold leading-none tracking-tighter text-on-surface md:text-[10vw]">
                    {next.title}
                  </h2>
                </motion.div>
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
