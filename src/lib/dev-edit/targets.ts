/**
 * The allowlist of things the visual editor is permitted to delete.
 *
 * Shared by the client overlay and the server route on purpose. The client uses
 * it to work out what the user just clicked; the server uses it as the *only*
 * source of file paths and component/array names, so a request can never name
 * its own target. The browser sends an id (and, for repeated rows, a slug) —
 * never a path.
 *
 * Pure data: no imports, safe on both sides of the boundary.
 */

/** A whole homepage section, removed from `page.tsx` as `<Tag />`. */
export interface SectionTarget {
  id: string;
  /** Shown in the confirm dialog. */
  label: string;
  /** Component tag as written in `page.tsx`. */
  tag: string;
  /**
   * A translation key whose copy is guaranteed to render inside this section.
   * The overlay matches a clicked `<section>` by looking for this key's text,
   * which beats matching on DOM order (order shifts as sections get deleted)
   * and beats `data-*` attributes (those would ship to production).
   */
  anchorKey: string;
}

/** One row of a repeated list, removed from a top-level array literal. */
export interface ListTarget {
  id: string;
  label: string;
  file: string;
  array: string;
  /**
   * Builds the substring that identifies the entry inside the array literal.
   * Kept as a function so the client never has to know the source shape.
   */
  marker: (param: string) => string;
  /** Guard for the parameter the browser supplies. */
  paramPattern: RegExp;
}

export const PAGE_FILE = "src/app/page.tsx";

/**
 * ContactBookend is deliberately absent: it owns the `#kontakt` anchor that the
 * navbar, the sticky CTA and every landing-page button point at, so deleting it
 * would leave dead links across the site. Hero is absent for the same class of
 * reason — a homepage with no hero is not a layout decision, it's a mistake.
 */
export const SECTION_TARGETS: SectionTarget[] = [
  { id: "trust-bar", label: "Pasek zaufania (logotypy)", tag: "TrustBar", anchorKey: "home.trust.eyebrow" },
  { id: "client-work", label: "Wybrane wdrożenia", tag: "ClientWork", anchorKey: "home.work.title.v2" },
  { id: "own-products", label: "Produkty własne", tag: "OwnProducts", anchorKey: "home.products.title.v2" },
  { id: "services", label: "Co robimy", tag: "ServicesOverview", anchorKey: "home.svc.title" },
  { id: "process", label: "Jak pracujemy", tag: "Process", anchorKey: "home.process.title.v2" },
  { id: "faq", label: "FAQ", tag: "Faq", anchorKey: "home.faq.title" },
];

export const LIST_TARGETS: ListTarget[] = [
  {
    id: "case",
    label: "Realizacja",
    file: "src/components/home/client-work.tsx",
    array: "cases",
    marker: (slug) => `slug: ${JSON.stringify(slug)}`,
    paramPattern: /^[a-z0-9-]+$/,
  },
  {
    id: "product",
    label: "Produkt",
    file: "src/components/home/own-products.tsx",
    array: "ORDER",
    marker: (slug) => `slug: ${JSON.stringify(slug)}`,
    paramPattern: /^[a-z0-9-]+$/,
  },
  {
    id: "client",
    label: "Logotyp klienta",
    file: "src/components/trust-bar.tsx",
    array: "CLIENTS",
    marker: (name) => JSON.stringify(name),
    // Client wordmarks are display strings, so this is looser than a slug —
    // letters (incl. Polish), digits, spaces, dots and hyphens.
    paramPattern: /^[\p{L}\p{N} .-]{1,40}$/u,
  },
];

export function findSectionTarget(id: string): SectionTarget | undefined {
  return SECTION_TARGETS.find((s) => s.id === id);
}

export function findListTarget(id: string): ListTarget | undefined {
  return LIST_TARGETS.find((l) => l.id === id);
}
