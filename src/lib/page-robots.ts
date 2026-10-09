/** Explicit page metadata must not override the preview's noindex policy. */
const indexPublicPages = process.env.PROGRAMO_DEPLOYMENT_ENV !== "preview";
export const publicPageRobots = { index: indexPublicPages, follow: indexPublicPages };
