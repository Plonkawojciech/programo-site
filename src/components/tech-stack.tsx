"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TechItem {
  name: string;
  description: string;
}

function GlassCard({
  item,
  index,
  mouseX,
  mouseY,
}: {
  item: TechItem;
  index: number;
  mouseX: number;
  mouseY: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on mouse move
  const getParallaxStyle = () => {
    if (!cardRef.current) return {};
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (mouseX - centerX) * 0.015;
    const offsetY = (mouseY - centerY) * 0.015;
    return {
      transform: `translate(${offsetX}px, ${offsetY}px)`,
    };
  };

  // Scattered organic positioning
  const positions = [
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
  ];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={getParallaxStyle()}
      className={`${positions[index % positions.length]} group relative flex flex-col gap-4 rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-300
        bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]
        hover:bg-white/[0.06] hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,229,255,0.08)]`}
    >
      {/* Icon placeholder */}
      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-surface">
        <span className="font-headline text-lg md:text-2xl font-bold tracking-tighter">
          {item.name[0]}
        </span>
      </div>

      <div>
        <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tighter text-on-surface">
          {item.name}
        </h3>
      </div>

      <p className="text-xs md:text-sm font-light leading-relaxed text-on-surface-variant">
        {item.description}
      </p>

      {/* Decorative corner dot */}
      <div className="absolute right-6 top-6 h-1.5 w-1.5 rounded-full bg-primary/20 transition-colors duration-500 group-hover:bg-primary" />
    </motion.div>
  );
}

export default function TechStack() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const technologies: TechItem[] = [
    { name: "Next.js", description: t("stack.nextjs") },
    { name: "React", description: t("stack.react") },
    { name: "TypeScript", description: t("stack.typescript") },
    { name: "Tailwind CSS", description: t("stack.tailwind") },
    { name: "Supabase", description: t("stack.supabase") },
    { name: "Neon", description: t("stack.neon") },
    { name: "Drizzle", description: t("stack.drizzle") },
    { name: "Vercel", description: t("stack.vercel") },
    { name: "Capacitor", description: t("stack.capacitor") },
    { name: "Azure AI", description: t("stack.azure") },
    { name: "Anthropic", description: t("stack.anthropic") },
    { name: "Stripe", description: t("stack.stripe") },
    { name: "Resend", description: t("stack.resend") },
    { name: "Three.js", description: t("stack.threejs") },
    { name: "Konva.js", description: t("stack.konvajs") },
  ];

  return (
    <section id="stack" className="relative overflow-hidden py-24 md:py-32 lg:py-56">
      {/* Background blurred gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="mesh-orb-1 absolute top-[10%] left-[15%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-primary/[0.04] blur-[80px] md:blur-[120px]" />
        <div className="mesh-orb-2 absolute bottom-[20%] right-[10%] h-[250px] w-[250px] md:h-[400px] md:w-[400px] rounded-full bg-accent/[0.03] blur-[80px] md:blur-[120px]" />
        <div className="mesh-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] md:h-[350px] md:w-[350px] rounded-full bg-primary/[0.02] blur-[80px]" />
      </div>

      <div ref={containerRef} className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        <div className="mb-20 md:mb-32 2xl:mb-48 flex flex-col items-end text-right">
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-primary"
          >
            {t("stack.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-6 font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-8xl 2xl:text-[8vw]"
          >
            {t("stack.title")}
          </motion.h2>
        </div>

        {/* Glass cards grid — organic scattered layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
          {technologies.map((tech, i) => (
            <GlassCard
              key={tech.name}
              item={tech}
              index={i}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
