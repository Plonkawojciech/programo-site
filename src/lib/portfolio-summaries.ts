import { projects, type Project } from "@/lib/projects";

export type PortfolioSummary = Pick<Project, "slug" | "title" | "status"> & { shot?: string };
export type PortfolioLink = Pick<Project, "slug" | "title">;

// Called by server layouts/pages. Only the fields shown in a client component
// cross the boundary; project narratives and all screenshots stay on the server.
export function getPortfolioSummaries(slugs: readonly string[]): PortfolioSummary[] {
  return slugs.flatMap((slug) => {
    const project = projects.find((entry) => entry.slug === slug);
    return project ? [{ slug: project.slug, title: project.title, status: project.status, shot: project.screenshots?.[0] }] : [];
  });
}

export const footerProjectLinks: PortfolioLink[] = getPortfolioSummaries([
  "jedmar", "estalo", "wks-poznan", "skup-nieruchomosci", "eportal-prawny", "rejestr-pro",
]).map(({ slug, title }) => ({ slug, title }));
