import type { SchemaNode } from "./types";

export const SITE_URL = "https://programo.pl";

// Stable @ids for the entities every page's graph can reference instead of
// repeating. Defined once here so a typo can't silently fork an entity in two.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const WOJCIECH_ID = `${SITE_URL}/#person-wojciech-plonka`;
export const BARTOSZ_ID = `${SITE_URL}/#person-bartosz-kolaj`;

// Programo works nationwide but is based in and named after Poznań — reused
// by buildOrganization() and buildService() so "areaServed" reads the same
// everywhere instead of drifting page to page.
export const DEFAULT_AREA_SERVED: SchemaNode[] = [
  { "@type": "City", name: "Poznań" },
  { "@type": "AdministrativeArea", name: "Wielkopolska" },
  { "@type": "Country", name: "Polska" },
];
