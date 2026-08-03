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

  // Short subtitle for the title tag — trim to the first clause so the tag stays
  // scannable. Splits on a colon or a spaced dash (hyphen, en, em) so hyphenated
  // words like "mobile-first" survive. Full description's first sentence is used
  // for the meta description.
  const shortSubtitle = project.subtitle.pl.split(/:|\s[-\u2013\u2014]\s/)[0].trim();
  const title = `${project.title} - ${shortSubtitle} | Programo`;
  const description = project.description.pl.split(/(?<=\.)\s/)[0].slice(0, 160);
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
