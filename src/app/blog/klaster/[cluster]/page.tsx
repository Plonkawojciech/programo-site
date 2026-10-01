import type { Metadata } from "next";
import { PLANNED_CLUSTERS, getAllClusters, getPostsByCluster } from "@/lib/blog";
import PostCard, { clusterLabel } from "@/components/blog/post-card";
import ClusterNav from "@/components/blog/cluster-nav";
import ClusterEmptyState from "@/components/blog/cluster-empty-state";
import { buildBreadcrumbs, buildWebPage, renderGraph } from "@/lib/schema";
import { OG_IMAGE } from "@/lib/og-image";

// Static params cover planned clusters (docs/plans/blog-aeo-2026-08.md
// section 5) even before they have a post, so /blog/klaster/wlasne-dane
// renders the "coming soon" state instead of 404ing — a cluster nav that
// links to a 404 is worse than one that links to an honest empty state.
export function generateStaticParams() {
  const planned = PLANNED_CLUSTERS.map((c) => c.slug);
  const actual = getAllClusters();
  const slugs = Array.from(new Set([...planned, ...actual]));
  return slugs.map((cluster) => ({ cluster }));
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
  const count = getPostsByCluster(cluster).length;
  const description = `${label}: ${count} ${count === 1 ? "wpis" : "wpisów"} na blogu Programo o budowie stron, sklepów i aplikacji. Poradniki, porównania i dane z własnych wdrożeń.`;
  return {
    title: `${label} - Blog - Programo`,
    description,
    alternates: { canonical: url },
    // A planned cluster with no posts is an honest empty state for visitors,
    // but thin content for an index.
    ...(count === 0 ? { robots: { index: false, follow: true } } : {}),
    openGraph: { images: [OG_IMAGE], title: `${label} - Blog - Programo`, description, url, siteName: "Programo", locale: "pl_PL", type: "website" },
  };
}

export default async function BlogClusterPage({ params }: { params: Promise<{ cluster: string }> }) {
  const { cluster } = await params;
  const posts = getPostsByCluster(cluster);

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
        <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-12 md:py-24 lg:px-24">
          <header className="mb-12">
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              {label}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed opacity-85 md:text-xl">
              {posts.length === 0
                ? "Ten klaster jest w planie redakcyjnym."
                : "Wszystkie wpisy z tego klastra tematycznego."}
            </p>
          </header>

          <ClusterNav activeCluster={cluster} />

          {posts.length === 0 ? (
            <ClusterEmptyState label={label} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.frontmatter.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
