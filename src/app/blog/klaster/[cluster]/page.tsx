import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllClusters, getPostsByCluster } from "@/lib/blog";
import PostCard, { clusterLabel } from "@/components/blog/post-card";
import { buildBreadcrumbs, buildWebPage, renderGraph } from "@/lib/schema";

export function generateStaticParams() {
  return getAllClusters().map((cluster) => ({ cluster }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster } = await params;
  const label = clusterLabel(cluster);
  const url = `https://programo.pl/blog/klaster/${cluster}`;
  return {
    title: `${label} - Blog - Programo`,
    description: `Wpisy z klastra "${label}" na blogu Programo.`,
    alternates: { canonical: url },
  };
}

export default async function BlogClusterPage({ params }: { params: Promise<{ cluster: string }> }) {
  const { cluster } = await params;
  const posts = getPostsByCluster(cluster);
  if (posts.length === 0) notFound();

  const label = clusterLabel(cluster);
  const path = `/blog/klaster/${cluster}`;

  const pageGraph = renderGraph([
    buildWebPage({ path, name: `${label} - Blog - Programo` }),
    buildBreadcrumbs([
      { name: "Programo", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: label, path },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="min-h-screen bg-surface text-on-surface">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <header className="mb-12">
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              {label}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed opacity-85 md:text-xl">
              Wszystkie wpisy z tego klastra tematycznego.
            </p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.frontmatter.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
