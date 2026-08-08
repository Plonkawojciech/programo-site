import Link from "next/link";
import type { ParsedPost } from "@/lib/blog";

export default function PostCard({ post }: { post: ParsedPost }) {
  const { slug, title, question, datePublished, cluster } = post.frontmatter;
  return (
    <div className="rounded-2xl bg-card p-6 shadow-card transition hover:shadow-card-hover">
      {/* Two separate links, not nested — an anchor inside an anchor is
          invalid HTML and (in a server component) an onClick to stop the
          inner click from bubbling isn't available anyway. */}
      <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-widest opacity-60">
        <span>{datePublished}</span>
        <span aria-hidden="true">·</span>
        <Link href={`/blog/klaster/${cluster}`} className="hover:underline">
          {clusterLabel(cluster)}
        </Link>
      </div>
      <Link href={`/blog/${slug}`} className="block">
        <h2 className="mb-2 font-headline text-xl font-bold tracking-tight hover:underline">{title}</h2>
        <p className="text-sm leading-relaxed opacity-75">{question}</p>
      </Link>
    </div>
  );
}

// Kebab-case cluster slug -> readable label. Small and local on purpose: the
// only clusters that exist today are in src/content/blog, and a new cluster
// slug should read fine even before someone adds a nicer label here.
export function clusterLabel(cluster: string): string {
  return cluster
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
