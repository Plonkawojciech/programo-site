"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import type { Lang } from "@/lib/i18n";

function ProjectCard({
  project,
  lang,
  index,
  total,
  progress,
}: {
  project: Project;
  lang: Lang;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse parallax within card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  // Per-card scroll progress for image effects
  const cardStart = index / total;
  const cardCenter = (index + 0.5) / total;
  const cardEnd = (index + 1) / total;

  const imageScale = useTransform(
    progress,
    [cardStart, cardCenter, cardEnd],
    [0.85, 1, 0.85]
  );
  const imageFilter = useTransform(
    progress,
    [cardStart, cardCenter, cardEnd],
    [1, 0, 1]
  );
  // imageBlur removed — using overlay-based desaturation instead

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Move image OPPOSITE to mouse for parallax
    mouseX.set((e.clientX - centerX) * -0.02);
    mouseY.set((e.clientY - centerY) * -0.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="relative flex-shrink-0 w-[85vw] md:w-[80vw] h-full flex items-center justify-center px-4 md:px-8"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor="view"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden rounded-2xl md:rounded-3xl group"
      >
        <motion.div
          className="absolute inset-0"
          style={{
            scale: imageScale,
            x: springX,
            y: springY,
          }}
        >
          {project.screenshots?.[0] ? (
            <motion.div className="relative w-full h-full overflow-hidden">
              <Image
                src={project.screenshots[0]}
                alt={project.title}
                fill
                className="object-cover"
                sizes="85vw"
                priority={index === 0}
              />
              {/* Grayscale overlay driven by scroll */}
              <motion.div
                className="absolute inset-0 bg-dark mix-blend-saturation"
                style={{ opacity: imageFilter }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-dark-card">
              <span className="font-headline text-[20vw] font-bold opacity-5 text-text">
                {project.title[0]}
              </span>
            </div>
          )}
        </motion.div>

        {/* Project title — bottom-left overlay */}
        <motion.div
          className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0.8, y: isHovered ? 0 : 5 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="font-headline text-[8vw] md:text-[6vw] font-bold italic leading-[0.9] tracking-tight text-text">
            {project.title}
          </h3>
        </motion.div>

        {/* Year — top-right */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-text/60">
            {project.year}
          </span>
        </div>

        {/* Tags — bottom-right pills */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex flex-wrap gap-2 justify-end">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium uppercase tracking-[0.15em] text-text/70 border border-white/10 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}

export default function FeaturedWork() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalProjects = projects.length;

  // The section height determines how much vertical scroll maps to horizontal movement
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll to horizontal translateX
  const xTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(totalProjects - 1) * 85}vw`]
  );

  // Smooth spring
  const smoothX = useSpring(xTranslate, { damping: 30, stiffness: 100 });

  // Track current card index
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const idx = Math.round(v * (totalProjects - 1));
      setCurrentIndex(Math.min(idx, totalProjects - 1));
    });
    return unsubscribe;
  }, [scrollYProgress, totalProjects]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative"
      style={{ height: `${totalProjects * 100}vh` }}
    >
      {/* Section number */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <span className="absolute top-8 left-8 text-[11px] font-medium tracking-[0.2em] text-coral z-20">
          02
        </span>

        {/* Background gradient blob */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="orb-coral absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, #FF3D00 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Section heading */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-headline text-[8vw] md:text-[5vw] font-bold tracking-tighter text-text"
          >
            {t("work.title")}
          </motion.h2>
        </div>

        {/* Counter — fixed position */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 flex items-baseline gap-2">
          <span className="font-headline text-3xl md:text-5xl font-bold text-coral italic">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-sm text-text-muted font-light">
            / {String(totalProjects).padStart(2, "0")}
          </span>
        </div>

        {/* Horizontal scroll container */}
        <motion.div
          className="flex items-center h-full pt-20"
          style={{ x: smoothX }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              lang={lang}
              index={index}
              total={totalProjects}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
