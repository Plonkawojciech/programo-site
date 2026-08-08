import Image from "next/image";
import Link from "next/link";
import type { ParsedPost } from "@/lib/blog";
import { countWords, readingTimeMinutes } from "@/lib/blog/word-count";
import { clusterLabel } from "./post-card";

// The newest post, shown large above the grid on /blog. `priority` on its
// cover is the only priority image on the index page — everything below the
// fold stays lazy.
export default function FeaturedPost({ post }: { post: ParsedPost }) {
  const { slug, title, answer, datePublished, cluster, cover, coverAlt } = post.frontmatter;
  const minutes = readingTimeMinutes(countWords(post.body) + countWords(answer));

  return (
    <Link
      href={`/blog/${slug}`}
      className="group mb-14 grid gap-6 overflow-hidden rounded-3xl bg-card shadow-card transition hover:shadow-card-hover md:grid-cols-2 md:gap-0"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-auto">
        <Image
          src={cover}
          alt={coverAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12">
        <span className="mb-4 w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Najnowszy wpis
        </span>
        <h2 className="mb-4 font-headline text-2xl font-bold leading-[1.1] tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mb-6 line-clamp-3 max-w-xl leading-relaxed opacity-80 md:text-lg">{answer}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-widest opacity-60">
          <span>{datePublished}</span>
          <span aria-hidden="true">·</span>
          <span>{minutes} min czytania</span>
          <span aria-hidden="true">·</span>
          <span>{clusterLabel(cluster)}</span>
        </div>
      </div>
    </Link>
  );
}
