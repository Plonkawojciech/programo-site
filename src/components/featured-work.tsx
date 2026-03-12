"use client";

import { motion } from "framer-motion";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  bg: string;
  accent: string;
  pattern: React.ReactNode;
}

const projects: Project[] = [
  {
    title: "Estalo",
    subtitle: "CRM for Real Estate",
    description:
      "AI-powered CRM that automates property listings, client management, and portal integrations for real estate agencies across Poland.",
    bg: "bg-[#1a1a1a]",
    accent: "text-[#c8a951]",
    pattern: (
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 400 300"
      >
        <defs>
          <pattern
            id="grid-estalo"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect width="40" height="40" fill="none" />
            <path d="M40 0L0 40" stroke="#c8a951" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid-estalo)" />
      </svg>
    ),
  },
  {
    title: "Baulx",
    subtitle: "CNC & Woodworking Suite",
    description:
      "Studio, Convert, and Flow \u2014 three tools that streamline design-to-production workflows for CNC manufacturers and custom furniture makers.",
    bg: "bg-[#0f1b2d]",
    accent: "text-[#5ba4c9]",
    pattern: (
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 400 300"
      >
        <defs>
          <pattern
            id="hex-baulx"
            width="60"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="30,2 56,15 56,37 30,50 4,37 4,15"
              fill="none"
              stroke="#5ba4c9"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#hex-baulx)" />
      </svg>
    ),
  },
  {
    title: "Athlix",
    subtitle: "Sports & Health Platform",
    description:
      "Pilot and TrainMate \u2014 athlete performance tracking and AI-powered training plans for coaches and athletes.",
    bg: "bg-[#1a2e1a]",
    accent: "text-[#6abf69]",
    pattern: (
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 400 300"
      >
        <defs>
          <pattern
            id="dots-athlix"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="12" r="1.5" fill="#6abf69" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#dots-athlix)" />
      </svg>
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function FeaturedWork() {
  return (
    <section id="work" className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm tracking-[0.2em] uppercase text-sage-muted">
            Selected Projects
          </p>
          <h2 className="font-serif text-4xl tracking-tight text-sage md:text-5xl">
            Featured Work
          </h2>
        </motion.div>

        <div className="mt-16 space-y-8">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className={`group relative overflow-hidden rounded-2xl ${project.bg} p-8 md:p-12 lg:p-16`}
            >
              {/* Pattern background */}
              {project.pattern}

              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

              <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <p
                    className={`mb-2 text-xs tracking-[0.25em] uppercase ${project.accent}`}
                  >
                    {project.subtitle}
                  </p>
                  <h3 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/50 md:text-base">
                    {project.description}
                  </p>
                </div>

                {/* Abstract visual element */}
                <div className="flex shrink-0 items-end">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-white/25 group-hover:scale-110`}
                  >
                    <svg
                      className="h-5 w-5 text-white/40 transition-colors group-hover:text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Decorative shape */}
              <div
                className={`absolute -bottom-20 -right-20 h-64 w-64 rounded-full opacity-[0.03] blur-3xl ${
                  project.title === "Estalo"
                    ? "bg-[#c8a951]"
                    : project.title === "Baulx"
                      ? "bg-[#5ba4c9]"
                      : "bg-[#6abf69]"
                }`}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
