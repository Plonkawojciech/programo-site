import { ORGANIZATION_ID, SITE_URL } from "./constants";
import type { SchemaNode } from "./types";

export interface SoftwareApplicationInput {
  /** Site-relative Programo page for this project, e.g. "/projects/estalo". */
  path: string;
  name: string;
  description: string;
  applicationCategory: string;
  /** The product's own URL (e.g. https://estalo.pl) — distinct from the Programo page URL. */
  liveUrl?: string;
}

export function buildSoftwareApplication(input: SoftwareApplicationInput): SchemaNode {
  const pageUrl = `${SITE_URL}${input.path}`;
  return {
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#software`,
    name: input.name,
    description: input.description,
    applicationCategory: input.applicationCategory,
    operatingSystem: "Web",
    ...(input.liveUrl && { url: input.liveUrl }),
    creator: { "@id": ORGANIZATION_ID },
  };
}
