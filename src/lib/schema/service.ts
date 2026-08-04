import { ORGANIZATION_ID, SITE_URL, DEFAULT_AREA_SERVED } from "./constants";
import type { SchemaNode } from "./types";

export interface ServiceInput {
  /** Site-relative path of the page this Service belongs to, e.g. "/strony-internetowe". */
  path: string;
  serviceType: string;
  name: string;
  description: string;
  areaServed?: SchemaNode[];
}

/**
 * No SERP rich result exists for Service — kept anyway because it helps
 * Google's entity model understand what Programo actually offers.
 */
export function buildService(input: ServiceInput): SchemaNode {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    serviceType: input.serviceType,
    name: input.name,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: input.areaServed ?? DEFAULT_AREA_SERVED,
    description: input.description,
    url,
  };
}
