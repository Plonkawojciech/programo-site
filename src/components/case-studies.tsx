import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, type Project } from "@/lib/projects";
import Reveal from "@/components/ui/reveal";

// A grounded case-studies section for the Polish Ads landings. All facts come
// from `projects.ts` (the single source of truth) — title, subtitle, metric,
// tech, screenshot, accent. The only per-page copy is `angle`: a short, honest
// one-liner describing what the project demonstrates. No invented numbers.
export interface CaseStudyItem {
  slug: string;
  /** Honest one-line summary of what we did / what it proves. PL. */
  angle: string;
}

interface Resolved {
  project: Project;
  angle: string;
}

export default function CaseStudies({
  eyebrow = "Realizacje",
  heading,
  intro,
  items,
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  items: CaseStudyItem[];
}) {
  const resolved: Resolved[] = items
    .map((it) => {
      const project = getProjectBySlug(it.slug);
      return project ? { project, angle: it.angle } : null;
    })
    .filter((x): x is Resolved => x !== null);

  if (resolved.length === 0) return null;

  const cols = resolved.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <section className="relative bg-surface py-24 md:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-12 max-w-3xl md:mb-16">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-5 font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl">
            {heading}
          </h2>
          {intro && (
            <p className="mt-5 text-lg font-light leading-relaxed text-on-surface/70">
              {intro}
            </p>
          )}
        </Reveal>

        <div className={`grid gap-6 ${cols}`}>
          {resolved.map(({ project, angle }, i) => {
            const shot = project.screenshots?.[0];
            const isLive = project.status === "live" && Boolean(project.liveUrl);
            return (
              <Reveal key={project.slug} delay={i * 0.1}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-low transition-colors hover:border-outline">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                    {shot ? (
                      <Image
                        src={shot}
                        alt={`${project.title} — realizacja Programo`}
                        fill
                        sizes="(min-width: 768px) 32vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: project.bgColor }}
                      />
                    )}
                    <span
                      className="absolute left-0 top-0 h-1 w-full"
                      style={{ backgroundColor: project.accentColor }}
                    />
                    {project.status !== "live" && (
                      <span className="absolute right-3 top-3 rounded-full border border-outline-variant/60 bg-surface/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant backdrop-blur-sm">
                        {project.status === "development" ? "W budowie" : "Wkrótce"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">
                      <span>{project.tags[0] ?? "Realizacja"}</span>
                      <span>· {project.year}</span>
                    </div>
                    <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-on-surface-variant">
                      {project.subtitle.pl}
                    </p>
                    <p className="mt-3 text-sm font-light leading-relaxed text-on-surface/70">
                      {angle}
                    </p>
                    {project.metric && (
                      <p className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <span aria-hidden="true">▸</span>
                        {project.metric.pl}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-sm font-medium text-primary underline underline-offset-4 transition hover:text-on-surface"
                      >
                        Zobacz realizację →
                      </Link>
                      {isLive && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-on-surface-variant underline underline-offset-4 transition hover:text-on-surface"
                        >
                          Na żywo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
