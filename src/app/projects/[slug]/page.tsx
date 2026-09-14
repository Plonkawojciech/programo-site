import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, type Project } from "@/lib/projects";
import ProjectDetailClient from "./ProjectDetailClient";
import {
  buildBreadcrumbs,
  buildSoftwareApplication,
  buildWebPage,
  ref,
  renderGraph,
} from "@/lib/schema";

function buildProjectGraph(project: Project, slug: string): string {
  const path = `/projects/${slug}`;
  const app = buildSoftwareApplication({
    path,
    name: project.title,
    description: project.description.pl,
    applicationCategory: project.tags.join(", "),
    liveUrl: project.liveUrl,
  });
  return renderGraph([
    buildWebPage({
      path,
      name: project.title,
      description: project.description.pl,
      dateModified: project.updatedAt,
      mainEntity: ref(app),
    }),
    buildBreadcrumbs([
      { name: "Programo", path: "/" },
      { name: "Projekty", path: "/projekty" },
      { name: project.title, path },
    ]),
    app,
  ]);
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Programo - Projekt nie znaleziony",
      description: "Projekt nie został znaleziony.",
    };
  }

  // Short subtitle for the title tag - trim to the first clause so the tag stays
  // scannable. Splits on a colon or a spaced dash (hyphen, en, em) so hyphenated
  // words like "mobile-first" survive.
  const shortSubtitle = project.subtitle.pl.split(/:|\s[-\u2013\u2014]\s/)[0].trim();
  // Google truncates the title tag around 60 characters, and five project pages
  // were shipping 65-95: the brand suffix — the part that makes the result
  // recognisable in a list — was the half being cut. Trim the SUBTITLE to fit
  // instead, on a word boundary, and drop it entirely when even one word will
  // not fit. The project name and "| Programo" are never sacrificed.
  const TITLE_BUDGET = 60;
  const titleBase = `${project.title} | Programo`;
  const room = TITLE_BUDGET - titleBase.length - " - ".length;
  let fittedSubtitle = shortSubtitle;
  if (fittedSubtitle.length > room) {
    fittedSubtitle = room > 0 ? fittedSubtitle.slice(0, room).replace(/\s+\S*$/, "").trim() : "";
  }
  const title = fittedSubtitle
    ? `${project.title} - ${fittedSubtitle} | Programo`
    : titleBase;
  // Meta description: whole sentences up to the 160-char limit, never a cut-off
  // fragment. The inner lookbehind keeps initials from ending a sentence -
  // without it "W. Safe Finance" splits after the "W." and the description for
  // that project is a 39-char stub. Only complete sentences are appended, so a
  // short description is short rather than trailing off mid-clause.
  const sentences = project.description.pl.split(/(?<=(?<!\b[A-ZĄĆĘŁŃÓŚŹŻ])\.)\s/);
  let description =
    sentences[0].length > 160
      ? `${sentences[0].slice(0, 157).replace(/\s+\S*$/, "")}...`
      : sentences[0];
  for (let i = 1; i < sentences.length; i++) {
    const next = `${description} ${sentences[i]}`;
    if (next.length > 160) break;
    description = next;
  }
  const ogImage = project.screenshots?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://programo.pl/projects/${slug}`,
      siteName: "Programo",
      locale: "pl_PL",
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: `https://programo.pl/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  // A real 404, not a 200 with an empty body: an unknown slug used to render the
  // shell (client returned null) and Google indexed it as a soft 404.
  if (!project) notFound();
  const pageGraph = buildProjectGraph(project, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pageGraph }}
      />
      <ProjectDetailClient slug={slug} />
    </>
  );
}
