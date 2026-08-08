// The five content clusters from docs/plans/blog-aeo-2026-08.md section 5,
// in the priority order the plan lists them. Kept separate from
// clusters.ts's getAllClusters() (which only ever returns clusters that
// already have a post) so /blog can show the full planned map — including
// clusters with zero posts today — instead of only what happens to exist.
export const PLANNED_CLUSTERS: { slug: string; label: string }[] = [
  { slug: "koszty-projektu", label: "Koszty projektu" },
  { slug: "porownania-technologii", label: "Porównania technologii" },
  { slug: "software-house-vs-alternatywy", label: "Software house vs alternatywy" },
  { slug: "wlasne-dane", label: "Własne dane" },
  { slug: "studia-przypadku", label: "Studia przypadku" },
];
