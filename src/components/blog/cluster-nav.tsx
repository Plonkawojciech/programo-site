import Link from "next/link";
import { PLANNED_CLUSTERS, getAllClusters, getPostsByCluster } from "@/lib/blog";
import { clusterLabel } from "./post-card";

// Union of the five planned clusters (docs/plans/blog-aeo-2026-08.md section 5)
// and whatever real clusters already exist in content — so a cluster nobody
// planned but someone wrote a post for still shows up, and a planned cluster
// with zero posts yet still shows up (with a 0), instead of silently
// disappearing until its first post exists.
function allClusterSlugs(): string[] {
  const planned = PLANNED_CLUSTERS.map((c) => c.slug);
  const actual = getAllClusters();
  return Array.from(new Set([...planned, ...actual]));
}

export default function ClusterNav({ activeCluster }: { activeCluster?: string }) {
  const slugs = allClusterSlugs();
  return (
    <nav aria-label="Klastry tematyczne" className="mb-12 flex flex-wrap gap-3">
      {slugs.map((slug) => {
        const count = getPostsByCluster(slug).length;
        const isActive = slug === activeCluster;
        return (
          <Link
            key={slug}
            href={`/blog/klaster/${slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-primary text-on-primary"
                : "bg-card text-on-surface opacity-80 shadow-card hover:opacity-100"
            }`}
          >
            {clusterLabel(slug)}
            <span
              className={`tabular-nums text-xs ${isActive ? "opacity-80" : "opacity-60"}`}
              aria-label={`${count} ${count === 1 ? "wpis" : "wpisów"}`}
            >
              {count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
