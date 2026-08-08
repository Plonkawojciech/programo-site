import Image from "next/image";
import Link from "next/link";
import type { ParsedPost } from "@/lib/blog";
import { PLANNED_CLUSTERS } from "@/lib/blog/planned-clusters";
import { countWords, readingTimeMinutes } from "@/lib/blog/word-count";

export default function PostCard({ post }: { post: ParsedPost }) {
  const { slug, title, answer, datePublished, cluster, cover, coverAlt } = post.frontmatter;
  const minutes = readingTimeMinutes(countWords(post.body) + countWords(answer));
  return (
    <div className="group overflow-hidden rounded-2xl bg-card shadow-card transition hover:shadow-card-hover">
      {/* Two separate links, not nested — an anchor inside an anchor is
          invalid HTML and (in a server component) an onClick to stop the
          inner click from bubbling isn't available anyway. */}
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={cover}
            alt={coverAlt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-widest opacity-60">
          <span>{datePublished}</span>
          <span aria-hidden="true">·</span>
          <span>{minutes} min czytania</span>
          <span aria-hidden="true">·</span>
          <Link href={`/blog/klaster/${cluster}`} className="hover:underline">
            {clusterLabel(cluster)}
          </Link>
        </div>
        <Link href={`/blog/${slug}`} className="block">
          <h2 className="mb-2 font-headline text-xl font-bold tracking-tight hover:underline">{title}</h2>
          <p className="line-clamp-3 text-sm leading-relaxed opacity-75">{answer}</p>
        </Link>
      </div>
    </div>
  );
}

// Kebab-case cluster slug -> readable label. Planned clusters (section 5 of
// the plan) get their exact editorial label; anything else falls back to a
// title-cased version of the slug so a brand-new cluster still reads fine
// before someone adds it to planned-clusters.ts.
export function clusterLabel(cluster: string): string {
  const planned = PLANNED_CLUSTERS.find((c) => c.slug === cluster);
  if (planned) return planned.label;
  return cluster
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
