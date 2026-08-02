import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturedWork from "@/components/featured-work";
import { I18nProvider } from "@/lib/i18n";
import { projects } from "@/lib/projects";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <FeaturedWork />
    </I18nProvider>
  );
}

describe("FeaturedWork component", () => {
  it("renders section heading", () => {
    renderWithI18n();
    // Hardcoded in component as "Archiwum projektów" (PL)
    expect(screen.getByText("Archiwum projektów")).toBeInTheDocument();
  });

  it("renders all project cards", () => {
    renderWithI18n();
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it("renders section label", () => {
    renderWithI18n();
    // Hardcoded as "Realizacje" (PL)
    expect(screen.getByText("Realizacje")).toBeInTheDocument();
  });

  it("project cards have correct links", () => {
    renderWithI18n();
    const links = screen.getAllByRole("link");
    const projectLinks = links.filter((l) =>
      l.getAttribute("href")?.startsWith("/projects/")
    );
    expect(projectLinks).toHaveLength(projects.length);
  });

  it("each card shows tags (hidden until hover)", () => {
    renderWithI18n();
    // Tags are in the DOM but with opacity-0 until hover
    expect(screen.getAllByText("SaaS").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Web").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("AI").length).toBeGreaterThanOrEqual(1);
  });

  it("cards render as article elements", () => {
    const { container } = renderWithI18n();
    const articles = container.querySelectorAll("article");
    expect(articles.length).toBe(projects.length);
  });

  it("each project card links to its detail page", () => {
    renderWithI18n();
    for (const project of projects) {
      const link = screen.getByRole("link", {
        name: new RegExp(project.title),
      });
      expect(link).toHaveAttribute("href", `/projects/${project.slug}`);
    }
  });

  it("cards are in a responsive grid layout", () => {
    const { container } = renderWithI18n();
    const gridContainer = container.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
    );
    expect(gridContainer).toBeInTheDocument();
  });

  it("has section id 'work'", () => {
    const { container } = renderWithI18n();
    const section = container.querySelector("#work");
    expect(section).toBeInTheDocument();
  });

  it("renders filter buttons for categories", () => {
    renderWithI18n();
    // "Wszystkie" (All) button is always rendered
    expect(screen.getByText("Wszystkie")).toBeInTheDocument();
    // Category labels are rendered as filter buttons
    expect(screen.getAllByText("Nasze systemy").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Strony").length).toBeGreaterThanOrEqual(1);
  });
});
