import type { Metadata } from "next";
import { getPostsPage, getPageCount } from "@/lib/blog";
import PostCard from "@/components/blog/post-card";
import FeaturedPost from "@/components/blog/featured-post";
import ClusterNav from "@/components/blog/cluster-nav";
import PaginationNav from "@/components/blog/pagination-nav";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/blog";
const TITLE = "Blog - Programo";
const DESCRIPTION =
  "Poradniki i porównania o budowie oprogramowania: koszty projektów, wybór technologii, dane własne z projektów Programo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://programo.pl/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://programo.pl/blog",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: TITLE,
    description: DESCRIPTION,
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Blog", path: PATH },
  ]),
]);

export default function BlogIndexPage() {
  const posts = getPostsPage(1);
  const pageCount = getPageCount();
  const [featured, ...rest] = posts;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="min-h-screen bg-surface text-on-surface">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <header className="mb-12">
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              Blog
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed opacity-85 md:text-xl">
              Poradniki i porównania z realnej pracy nad projektami: ile co
              kosztuje, jakie technologie wybrać i co pokazują nasze własne
              dane.
            </p>
          </header>

          <ClusterNav />

          {posts.length === 0 ? (
            <p className="opacity-70">Pierwsze wpisy już wkrótce.</p>
          ) : (
            <>
              <FeaturedPost post={featured} />
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {rest.map((post) => (
                    <PostCard key={post.frontmatter.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}

          <PaginationNav currentPage={1} pageCount={pageCount} />
        </div>
      </div>
    </>
  );
}
