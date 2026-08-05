import { SITE_URL } from "./constants";
import type { SchemaNode } from "./types";

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path, e.g. "/oferta". Use "/" for the homepage crumb. */
  path: string;
}

/** Minimum 2 entries in practice: "Programo" (home) plus the current page. */
export function buildBreadcrumbs(items: BreadcrumbItem[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}
