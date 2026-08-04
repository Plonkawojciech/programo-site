// Single source of truth for the site's schema.org graph. Every page builds
// its own list of nodes with these functions and renders it with
// renderGraph() — entities reference each other by @id (constants.ts)
// instead of being repeated per page. See docs/plans if this grows further;
// for now each file is one entity type, kept small on purpose.
export * from "./types";
export * from "./constants";
export * from "./graph";
export * from "./organization";
export * from "./people";
export * from "./website";
export * from "./breadcrumbs";
export * from "./webpage";
export * from "./service";
export * from "./faq";
export * from "./article";
export * from "./software-application";
export * from "./route-dates";
