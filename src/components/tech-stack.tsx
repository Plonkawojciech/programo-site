"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TechItem {
  name: string;
  description: string;
  size: "sm" | "md" | "lg" | "xl";
  font: "serif" | "sans";
}

export default function TechStack() {
  const { t } = useI18n();

  const technologies: TechItem[] = [
    { name: "Next.js", description: t("stack.nextjs"), size: "xl", font: "sans" },
    { name: "React", description: t("stack.react"), size: "md", font: "serif" },
    { name: "TypeScript", description: t("stack.typescript"), size: "lg", font: "sans" },
    { name: "Tailwind CSS", description: t("stack.tailwind"), size: "sm", font: "serif" },
    { name: "Supabase", description: t("stack.supabase"), size: "lg", font: "serif" },
    { name: "Neon", description: t("stack.neon"), size: "xl", font: "sans" },
    { name: "Drizzle", description: t("stack.drizzle"), size: "md", font: "serif" },
    { name: "Vercel", description: t("stack.vercel"), size: "sm", font: "sans" },
    { name: "Capacitor", description: t("stack.capacitor"), size: "md", font: "serif" },
    { name: "Azure AI", description: t("stack.azure"), size: "lg", font: "sans" },
    { name: "Anthropic", description: t("stack.anthropic"), size: "xl", font: "serif" },
    { name: "Stripe", description: t("stack.stripe"), size: "sm", font: "sans" },
    { name: "Resend", description: t("stack.resend"), size: "md", font: "serif" },
    { name: "Three.js", description: t("stack.threejs"), size: "lg", font: "sans" },
    { name: "Konva.js", description: t("stack.konvajs"), size: "sm", font: "serif" },
  ];

  const sizeClasses: Record<string, string> = {
    sm: "text-sm md:text-base",
    md: "text-xl md:text-3xl",
    lg: "text-3xl md:text-5xl",
    xl: "text-5xl md:text-7xl",
  };

  // Split technologies into two rows
  const row1 = technologies.slice(0, 8);
  const row2 = technologies.slice(8);

  function renderMarqueeItems(items: TechItem[], count: number) {
    const repeated = [];
    for (let r = 0; r < count; r++) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        repeated.push(
          <span
            key={`${r}-${i}`}
            className={`inline-flex items-center gap-4 transition-colors duration-300 hover:text-primary cursor-default ${
              sizeClasses[item.size]
            } ${
              item.font === "serif"
                ? "font-headline italic"
                : "font-body font-light"
            } text-[#0A0A0A]`}
          >
            {item.name}
          </span>,
          <span
            key={`sep-${r}-${i}`}
            className="mx-4 text-[#0A0A0A]/20 text-sm md:mx-6"
          >
            &mdash;
          </span>
        );
      }
    }
    return repeated;
  }

  return (
    <section id="stack" className="relative overflow-hidden bg-[#F0F0EC] py-32 md:py-48 lg:py-64">
      {/* Background "TECH" text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none font-headline text-[30vw] font-bold uppercase tracking-tighter text-[#0A0A0A]/[0.02]">
          TECH
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[2560px] px-6 md:px-16 2xl:px-40">
        {/* Section heading */}
        <div className="mb-20 md:mb-32">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 block text-[11px] font-bold uppercase tracking-[0.5em] text-primary"
          >
            {t("stack.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline text-5xl font-bold tracking-tighter text-[#0A0A0A] md:text-8xl lg:text-9xl"
          >
            {t("stack.title")}
          </motion.h2>
        </div>
      </div>

      {/* Marquee Row 1 — slides left */}
      <div className="mb-8 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:mb-12">
        <div className="flex items-baseline gap-0 pr-8 animate-slide-left w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
          {renderMarqueeItems(row1, 4)}
        </div>
      </div>

      {/* Marquee Row 2 — slides right */}
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex items-baseline gap-0 pr-8 animate-slide-right w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
          {renderMarqueeItems(row2, 5)}
        </div>
      </div>
    </section>
  );
}
