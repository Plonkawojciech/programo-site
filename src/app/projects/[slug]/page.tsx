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
      title: "Programo — Projekt nie znaleziony",
      description: "Projekt nie został znaleziony.",
    };
  }

  const title = `${project.title} — Programo`;
  const description = project.description.pl.slice(0, 155);

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
