import type { SchemaNode, SchemaRef } from "./types";

/**
 * Wraps a list of nodes into one `@graph` and serializes it for a
 * `<script type="application/ld+json">` tag. Every page on the site renders
 * exactly one of these — nodes reference each other by `@id` (see
 * constants.ts) instead of repeating, e.g. a page's Service points back at
 * `ORGANIZATION_ID` rather than embedding the Organization again.
 */
export function renderGraph(nodes: SchemaNode[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}

/**
 * Turns a node built elsewhere in the same graph into a bare `{ "@id": ... }`
 * reference, e.g. `mainEntity: ref(service)`. Throws at build time if the
 * node has no `@id` — every builder in this module sets one, so hitting this
 * means a node was constructed by hand instead of through a builder.
 */
export function ref(node: SchemaNode): SchemaRef {
  if (!node["@id"]) {
    throw new Error(`schema: cannot reference a node without "@id" (@type: ${node["@type"]})`);
  }
  return { "@id": node["@id"] };
}
