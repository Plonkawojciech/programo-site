/**
 * "Last significant content change" per static route — the single source for
 * both the sitemap's `lastModified` (src/app/sitemap.ts) and each page's
 * WebPage.dateModified, so the two signals can never diverge. Project pages
 * use `Project.updatedAt` in src/lib/projects.ts instead of this map.
 *
 * Previously every sitemap entry used `new Date()`, i.e. the build timestamp:
 * every URL got today's date on every deploy, whether or not its content had
 * actually changed. Google treats a sitemap's lastmod trust as binary — get
 * caught lying once and it ignores lastmod site-wide — so a stable, honest
 * date beats a fresh-looking wrong one.
 *
 * Method: `git log -1 --format=%cI -- <file>`, taking the newer of the
 * route's page.tsx and its single primary content component when page.tsx is
 * a thin wrapper (metadata + one import, no inline copy). Re-derive with the
 * same command the next time a route's real content changes — do not
 * hand-edit these to "today".
 */
export const STATIC_ROUTE_UPDATED_AT: Record<string, string> = {
  "/": "2026-08-03T12:49:17+02:00",
  "/oferta": "2026-08-03T20:20:31+02:00",
  "/cennik": "2026-08-03T16:23:25+02:00",
  "/projekty": "2026-08-03T16:23:25+02:00",
  "/o-nas": "2026-08-03T20:33:18+02:00",
  "/stack": "2026-08-03T16:23:25+02:00",
  "/kontakt": "2026-08-03T16:23:25+02:00",
  "/polityka-prywatnosci": "2026-08-03T20:48:06+02:00",
  "/software-house-poznan": "2026-08-03T16:23:25+02:00",
  "/sklepy-internetowe": "2026-08-03T16:23:25+02:00",
  "/strony-internetowe": "2026-08-03T16:23:25+02:00",
  "/strony-tracking-reklamy": "2026-08-03T20:20:31+02:00",
  "/ile-kosztuje-aplikacji": "2026-08-03T16:23:25+02:00",
};
