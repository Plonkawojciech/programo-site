"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

interface TechItem {
  name: string;
  description: string;
}

// Brand colours; the three "white" brands get a neutral slate so the letter
// tile stays visible on the light card as well as the dark one.
const techColors: Record<string, string> = {
  "Next.js": "#64748B",
  "React": "#61DAFB",
  "TypeScript": "#3178C6",
  "Tailwind CSS": "#06B6D4",
  "Supabase": "#3FCF8E",
  "Neon": "#00E699",
  "Drizzle": "#C5F74F",
  "Vercel": "#64748B",
  "Capacitor": "#53B9FF",
  "Azure AI": "#0078D4",
  "Anthropic": "#D4A574",
  "Stripe": "#635BFF",
  "Resend": "#64748B",
  "Three.js": "#049EF4",
  "Konva.js": "#0D83CD",
};

function TechCard({ item, index }: { item: TechItem; index: number }) {
  const color = techColors[item.name] || "#8EB69B";

  return (
    <div
      className="tech-card-line card-hover group relative flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-card p-7 shadow-card md:p-8"
      style={{
        animationDelay: `${index * 0.1}s`,
        // @ts-expect-error CSS custom property for tech-card-line hover color
        "--tech-color": color,
      }}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500"
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        <span
          className="font-headline text-2xl font-bold tracking-tighter group-hover:rotate-12 transition-transform duration-500 group-hover:text-white"
          style={{ color: "inherit" }}
        >
          {item.name[0]}
        </span>
      </div>
      <h3 className="font-headline text-2xl font-bold tracking-tighter text-on-surface">
        {item.name}
      </h3>
      <p className="text-sm font-light leading-relaxed text-on-surface-variant">
        {item.description}
      </p>

      {/* Decorative dot with tech color */}
      <div
        className="absolute right-8 top-8 h-2 w-2 rounded-full transition-all duration-500 group-hover:animate-pulse"
        style={{
          backgroundColor: `${color}33`,
        }}
      />

      {/* Hover background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 rounded-[2rem] pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)` }}
      />
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
    <section id="stack" className="relative bg-surface py-section">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          {/* h1, not h2: this component is only ever mounted by /stack, where it
              is the page title. Solid fill, not bg-clip-text: forced-colors mode
              drops background images and the page's only h1 would vanish. */}
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface text-balance md:text-7xl">
            {t("stack.title")}
          </h1>
          <p className="mt-4 text-lead leading-relaxed text-on-surface-variant text-pretty">
            {t("stack.desc")}
          </p>
        </Reveal>

        {/* A plain grid. The previous two auto-scrolling marquee rows clipped
            the first and last card on every viewport and showed only six of
            fifteen tools on a phone without a way to reach the rest. */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {technologies.map((tech, i) => (
            <li key={tech.name}>
              <Reveal delay={Math.min(i, 8) * 0.05}>
                <TechCard item={tech} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
