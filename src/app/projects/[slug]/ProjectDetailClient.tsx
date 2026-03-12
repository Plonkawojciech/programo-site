"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { getProjectBySlug, getAdjacentProjects, type Project } from "@/lib/projects";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function StatusBadge({ status, t }: { status: Project["status"]; t: (key: never) => string }) {
  const config = {
    live: {
      label: t("project.statusLive" as never),
      dotClass: "bg-emerald-400",
    },
    development: {
      label: t("project.statusDev" as never),
      dotClass: "bg-amber-400 animate-pulse",
    },
    planned: {
      label: t("project.statusPlanned" as never),
      dotClass: "bg-white/40",
    },
  };
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-white/70 backdrop-blur-sm">
      <span className={`h-2 w-2 rounded-full ${c.dotClass}`} />
      {c.label}
    </span>
  );
}

function ProjectContent({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const project = getProjectBySlug(slug);
  const { prev, next } = getAdjacentProjects(slug);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-beige-light">
        <p className="text-sage-muted">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      <Navbar />

      {/* Hero section with project accent bg */}
      <section
        className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
        style={{ backgroundColor: project.bgColor }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />

        {/* Accent glow */}
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ backgroundColor: project.accentColor }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors duration-300 hover:text-white/80"
            >
              {t("project.backToProjects")}
            </Link>
          </motion.div>

          {/* Title area */}
          <motion.div
            className="mt-10 md:mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="mb-5">
              <StatusBadge status={project.status} t={t} />
            </div>
            <h1 className="font-serif text-5xl tracking-tight text-white md:text-7xl lg:text-8xl">
              {project.title}
            </h1>
            <p
              className="mt-4 text-lg tracking-wide md:text-xl"
              style={{ color: project.accentColor }}
            >
              {project.subtitle[lang]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature image — full-width hero screenshot */}
      {project.screenshots && project.screenshots.length > 0 && (
        <section className="px-4 md:px-6 lg:px-8 -mt-10 md:-mt-16 relative z-10">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="overflow-hidden rounded-2xl"
            >
              <img
                src={project.screenshots[0]}
                alt={`${project.title}`}
                className="w-full h-auto block"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="grid gap-16 md:grid-cols-3">
          {/* Left column — About + Features */}
          <motion.div
            className="md:col-span-2 space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* About */}
            <div>
              <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-sage-muted">
                {t("project.about")}
              </h2>
              <p className="text-lg leading-relaxed text-sage/80 md:text-xl md:leading-relaxed">
                {project.longDescription[lang]}
              </p>
            </div>

            {/* What we built */}
            <div>
              <h2 className="mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-sage-muted">
                {t("project.whatWeBuilt")}
              </h2>
              <ul className="space-y-3">
                {project.features[lang].map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                    className="flex items-start gap-3 text-sage/70"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: project.accentColor }}
                    />
                    <span className="text-base leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right column — Metadata sidebar */}
          <motion.aside
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {/* Role */}
            <div>
              <h3 className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-sage-muted">
                {t("project.role")}
              </h3>
              <p className="text-sm text-sage">{project.role[lang]}</p>
            </div>

            {/* Status */}
            <div>
              <h3 className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-sage-muted">
                {t("project.status")}
              </h3>
              <StatusBadge status={project.status} t={t} />
            </div>

            {/* Year */}
            <div>
              <h3 className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-sage-muted">
                {t("project.year")}
              </h3>
              <p className="text-sm text-sage">{project.year}</p>
            </div>

            {/* Tech stack */}
            <div>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-sage-muted">
                {t("project.techStack")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-sage/10 bg-sage/5 px-3 py-1.5 text-xs font-medium text-sage/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Visit site button */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-sage px-6 py-3 text-sm font-medium tracking-wide text-sage transition-all duration-300 hover:bg-sage hover:text-beige-light min-h-[44px]"
              >
                {t("project.visitSite")}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            )}
          </motion.aside>
        </div>
      </section>

      {/* Screenshot gallery */}
      {project.screenshots && project.screenshots.length > 1 && (
        <section className="px-4 md:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl space-y-4">
            {project.screenshots.slice(1).map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl"
              >
                <img
                  src={src}
                  alt={`${project.title} — ${i + 2}`}
                  className="w-full h-auto block"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="border-t border-sage/8 px-6 py-20 md:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl tracking-tight text-sage md:text-4xl">
              {t("project.interestedCta")}
            </h2>
            <a
              href="/#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-sage px-8 py-3.5 text-sm font-medium tracking-wide text-sage transition-all duration-300 hover:bg-sage hover:text-beige-light min-h-[44px]"
            >
              {t("project.letsTalk")}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Prev / Next navigation */}
      <section className="border-t border-sage/8 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2">
          {/* Previous */}
          <div className="border-r border-sage/8 py-10 pr-6 md:py-16 md:pr-12">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group block"
              >
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-sage-muted">
                  {t("project.prevProject")}
                </p>
                <p className="font-serif text-xl text-sage transition-colors duration-300 group-hover:text-sage-light md:text-2xl">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div className="opacity-30">
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-sage-muted">
                  {t("project.prevProject")}
                </p>
                <p className="text-sage-muted">—</p>
              </div>
            )}
          </div>

          {/* Next */}
          <div className="py-10 pl-6 text-right md:py-16 md:pl-12">
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group block"
              >
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-sage-muted">
                  {t("project.nextProject")}
                </p>
                <p className="font-serif text-xl text-sage transition-colors duration-300 group-hover:text-sage-light md:text-2xl">
                  {next.title}
                </p>
              </Link>
            ) : (
              <div className="opacity-30">
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-sage-muted">
                  {t("project.nextProject")}
                </p>
                <p className="text-sage-muted">—</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
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
