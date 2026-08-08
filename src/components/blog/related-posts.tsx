import Image from "next/image";
import Link from "next/link";
import type { ParsedPost } from "@/lib/blog";

// 2-3 posts from the same cluster, linked from the bottom of a post — the
// internal-linking requirement from the plan (section 6, point 6): a blog
// with no links between its own pages would recreate the orphan-page problem
// that dropped /stack to zero internal links.
export default function RelatedPosts({ posts }: { posts: ParsedPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mb-14">
      <h2 className="mb-6 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
        Zobacz też
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.frontmatter.slug}
            href={`/blog/${p.frontmatter.slug}`}
            className="group flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card transition hover:shadow-card-hover"
          >
            <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={p.frontmatter.cover}
                alt={p.frontmatter.coverAlt}
                fill
                sizes="96px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
            <h3 className="font-headline text-base font-bold tracking-tight">{p.frontmatter.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
