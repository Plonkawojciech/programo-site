import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsPage, getPageCount } from "@/lib/blog";
import PostCard from "@/components/blog/post-card";
import PaginationNav from "@/components/blog/pagination-nav";
import { buildBreadcrumbs, buildWebPage, renderGraph } from "@/lib/schema";

export function generateStaticParams() {
  const pageCount = getPageCount();
  // Page 1 is /blog itself — this route only covers page 2 and up.
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export const dynamicParams = false;

function parsePage(param: string): number | null {
  const n = Number(param);
  return Number.isInteger(n) && n >= 2 ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const path = `/blog/strona/${page}`;
  return {
    title: `Blog - strona ${page} - Programo`,
    description: "Poradniki i porównania o budowie oprogramowania.",
    alternates: { canonical: `https://programo.pl${path}` },
    robots: { index: false, follow: true }, // thin paginated pages: not worth indexing individually
  };
}

export default async function BlogPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageParam } = await params;
  const page = parsePage(pageParam);
  const pageCount = getPageCount();
  if (!page || page > pageCount) notFound();

  const posts = getPostsPage(page);
  const path = `/blog/strona/${page}`;

  const pageGraph = renderGraph([
    buildWebPage({ path, name: `Blog - strona ${page} - Programo` }),
    buildBreadcrumbs([
      { name: "Programo", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: `Strona ${page}`, path },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="min-h-screen bg-surface text-on-surface">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <h1 className="mb-12 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
            Blog
          </h1>
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.frontmatter.slug} post={post} />
            ))}
          </div>
          <PaginationNav currentPage={page} pageCount={pageCount} />
        </div>
      </div>
    </>
  );
}
