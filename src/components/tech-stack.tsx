"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TechItem {
  name: string;
  description: string;
}

function TechCard({ item }: { item: TechItem }) {
  return (
    <div className="group relative flex min-w-[280px] flex-col gap-4 rounded-[2rem] border border-outline-variant/10 bg-surface p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2.5 hover:border-primary/20 hover:shadow-2xl md:min-w-[320px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
        <span className="font-headline text-2xl font-bold tracking-tighter">
          {item.name[0]}
        </span>
      </div>
      <div>
        <h3 className="font-headline text-2xl font-bold tracking-tighter text-on-surface">
          {item.name}
        </h3>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
          Expertise Layer
        </p>
      </div>
      <p className="text-sm font-light leading-relaxed text-on-surface-variant">
        {item.description}
      </p>

      {/* Decorative dot */}
      <div className="absolute right-8 top-8 h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-500" />
    </div>
  );
}

export default function TechStack() {
  const { t } = useI18n();

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
      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
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

        {/* Marquee Rows */}
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Row 1 */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex gap-8 md:gap-12 pr-8 md:pr-12 animate-slide-left w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
              {[...technologies, ...technologies].map((tech, i) => (
                <TechCard key={`r1-${i}`} item={tech} />
              ))}
            </div>
          </div>

          {/* Row 2 (Reverse) */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex gap-8 md:gap-12 pr-8 md:pr-12 animate-slide-right w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
              {[...technologies, ...technologies].reverse().map((tech, i) => (
                <TechCard key={`r2-${i}`} item={tech} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
