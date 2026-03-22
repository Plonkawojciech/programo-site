"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { getProjectBySlug, getAdjacentProjects, type Project } from "@/lib/projects";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageTransition from "@/components/page-transition";

function StatusBadge({ status, t }: { status: Project["status"]; t: (key: never) => string }) {
  const config = {
    live: {
      label: t("project.statusLive" as never),
      dotClass: "bg-emerald-500",
    },
    development: {
      label: t("project.statusDev" as never),
      dotClass: "bg-amber-500 animate-pulse",
    },
    planned: {
      label: t("project.statusPlanned" as never),
      dotClass: "bg-outline-variant",
    },
  };
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-primary">
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
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-on-surface-variant">{t("notFound.title")}</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary focus:outline-none"
      >
        {t("a11y.skipToContent")}
      </a>
      <Navbar />

      {/* Hero section with project accent bg */}
      <main id="main-content">
      <section
        className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
        style={{ backgroundColor: project.bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />

        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ backgroundColor: project.accentColor }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
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

          <motion.div
            className="mt-10 md:mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="mb-5">
              <StatusBadge status={project.status} t={t} />
            </div>
            <h1 className="font-headline text-5xl tracking-tight text-white md:text-7xl lg:text-8xl">
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

      {/* Feature image */}
      {project.screenshots && project.screenshots.length > 0 && (
        <section className="px-4 md:px-6 lg:px-8 -mt-10 md:-mt-16 relative z-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface-container-low"
            >
              <Image
                src={project.screenshots[0]}
                alt={`${project.title} — ${project.subtitle[lang]}`}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="grid gap-16 md:grid-cols-3">
          {/* Left column */}
          <motion.div
            className="md:col-span-2 space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant">
                {t("project.about")}
              </h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-on-surface/80 md:text-xl md:leading-relaxed">
                {project.longDescription[lang]}
              </p>
            </div>

            <div>
              <h2 className="mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant">
                {t("project.whatWeBuilt")}
              </h2>
              <ul className="space-y-3">
                {project.features[lang].map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                    className="flex items-start gap-3 text-on-surface/70"
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

          {/* Right column — Metadata */}
          <motion.aside
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div>
              <h3 className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant">
                {t("project.role")}
              </h3>
              <p className="text-sm text-on-surface">{project.role[lang]}</p>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant">
                {t("project.status")}
              </h3>
              <StatusBadge status={project.status} t={t} />
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant">
                {t("project.year")}
              </h3>
              <p className="text-sm text-on-surface">{project.year}</p>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant">
                {t("project.techStack")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 text-xs font-medium text-on-surface-variant"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-3 text-sm font-medium tracking-wide text-primary transition-all duration-300 hover:bg-primary hover:text-on-primary min-h-[44px]"
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
          <div className="mx-auto max-w-6xl flex flex-col gap-6">
            {project.screenshots.slice(1).map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface-container-low"
              >
                <Image
                  src={src}
                  alt={`${project.title} — ${lang === "pl" ? "zrzut ekranu" : "screenshot"} ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="border-t border-outline-variant/10 px-6 py-20 md:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-3xl tracking-tight text-on-surface md:text-4xl">
              {t("project.interestedCta")}
            </h2>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 px-8 py-3.5 text-sm font-medium tracking-wide text-primary transition-all duration-300 hover:bg-primary hover:text-on-primary min-h-[44px]"
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
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Prev / Next navigation */}
      <section className="border-t border-outline-variant/10 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2">
          <div className="border-r border-outline-variant/10 py-10 pr-6 md:py-16 md:pr-12">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group block"
              >
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-on-surface-variant">
                  {t("project.prevProject")}
                </p>
                <p className="font-headline text-xl text-on-surface transition-colors duration-300 group-hover:text-primary md:text-2xl">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div className="opacity-30">
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-on-surface-variant">
                  {t("project.prevProject")}
                </p>
                <p className="text-on-surface-variant">&mdash;</p>
              </div>
            )}
          </div>

          <div className="py-10 pl-6 text-right md:py-16 md:pl-12">
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group block"
              >
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-on-surface-variant">
                  {t("project.nextProject")}
                </p>
                <p className="font-headline text-xl text-on-surface transition-colors duration-300 group-hover:text-primary md:text-2xl">
                  {next.title}
                </p>
              </Link>
            ) : (
              <div className="opacity-30">
                <p className="mb-2 text-xs tracking-[0.2em] uppercase text-on-surface-variant">
                  {t("project.nextProject")}
                </p>
                <p className="text-on-surface-variant">&mdash;</p>
              </div>
            )}
          </div>
        </div>
      </section>

      </main>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default function ProjectDetailClient({ slug }: { slug: string }) {
  return (
    <I18nProvider>
      <ProjectContent slug={slug} />
    </I18nProvider>
  );
}
