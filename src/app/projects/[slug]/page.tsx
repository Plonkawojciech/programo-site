import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import ProjectDetailClient from "./ProjectDetailClient";

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
  const title = `${project.title} - ${shortSubtitle} | Programo`;
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

  const jsonLd = project
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.description.pl,
        applicationCategory: project.tags.join(", "),
        operatingSystem: "Web",
        ...(project.liveUrl && { url: project.liveUrl }),
        creator: {
          "@type": "Organization",
          name: "Programo",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProjectDetailClient slug={slug} />
    </>
  );
}
