import { SITE_URL } from "./constants";
import type { SchemaNode } from "./types";

export interface CreativeWorkListItem {
  name: string;
  description: string;
  sameAs: string;
}

/** A stable ItemList node used as the CollectionPage's main entity. */
export function buildCreativeWorkItemList(
  path: string,
  name: string,
  items: CreativeWorkListItem[],
): SchemaNode {
  const pageUrl = `${SITE_URL}${path}`;
  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#demo-list`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: item.name,
        description: item.description,
        sameAs: item.sameAs,
      },
    })),
  };
}
