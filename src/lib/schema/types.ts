// A schema.org node as it appears inside a JSON-LD `@graph`. Loose on purpose
// (schema.org itself has no fixed shape per type) — `@type` is required and
// `@id` is typed as an optional string so callers can read it back (see
// `ref()` in graph.ts) without casting through `unknown`.
export type SchemaNode = Record<string, unknown> & { "@type": string; "@id"?: string };

/** A bare reference to another node in the same `@graph`, e.g. `{ "@id": ORGANIZATION_ID }`. */
export interface SchemaRef {
  "@id": string;
}
