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
  it("renders the section title", () => {
    renderWithI18n();
    expect(screen.getByText("Wybrane realizacje")).toBeInTheDocument();
  });

  it("renders a card for every project", () => {
    const { container } = renderWithI18n();
    const articles = container.querySelectorAll("article");
    expect(articles.length).toBe(projects.length);
  });

  it("renders known project titles", () => {
    renderWithI18n();
    expect(screen.getByText("Jedmar")).toBeInTheDocument();
    expect(screen.getByText("Estalo")).toBeInTheDocument();
    expect(screen.getByText("Solvio")).toBeInTheDocument();
    expect(screen.getByText("ePortal Prawny")).toBeInTheDocument();
  });

  it("uses level-two card headings below the page heading", () => {
    renderWithI18n();
    expect(screen.getByRole("heading", { level: 1, name: "Wybrane realizacje" })).toBeInTheDocument();
    for (const project of projects) {
      expect(screen.getByRole("heading", { level: 2, name: project.title })).toBeInTheDocument();
    }
  });

  it("includes every card's visible status and title in its accessible link name", () => {
    renderWithI18n();
    const projectLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/projects/"));
    for (const link of projectLinks) {
      const status = link.querySelector(".rounded-full.border")?.textContent;
      expect(status).toBeTruthy();
      expect(link).toHaveAccessibleName(new RegExp(status!));
      expect(link).toHaveAccessibleName(new RegExp(link.querySelector("h2")!.textContent!));
    }
  });

  it("renders the four category filters", () => {
    renderWithI18n();
    expect(screen.getByRole("button", { name: "Wszystkie" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Produkty Programo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dla klientów" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tracking i reklamy" })).toBeInTheDocument();
  });

  it("each project card links to its detail page", () => {
    renderWithI18n();
    const links = screen.getAllByRole("link");
    const projectLinks = links.filter((l) =>
      l.getAttribute("href")?.startsWith("/projects/")
    );
    expect(projectLinks).toHaveLength(projects.length);
  });

  it("shows the coming-soon badge for the pre-launch project", () => {
    renderWithI18n();
    // ePortal Prawny is coming-soon → "Wkrótce"
    expect(screen.getAllByText("Wkrótce").length).toBeGreaterThanOrEqual(1);
  });

  it("shows a Live badge for live projects", () => {
    renderWithI18n();
    const liveCount = projects.filter((p) => p.status === "live").length;
    expect(screen.getAllByText("Live").length).toBe(liveCount);
  });

  it("renders tags on cards", () => {
    renderWithI18n();
    expect(screen.getAllByText("SaaS").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("iOS").length).toBeGreaterThanOrEqual(1);
  });

  it("uses a responsive grid layout", () => {
    const { container } = renderWithI18n();
    const grid = container.querySelector(".grid.grid-cols-1");
    expect(grid).toBeInTheDocument();
  });
});
