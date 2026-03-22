import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturedWork from "@/components/featured-work";
import { I18nProvider } from "@/lib/i18n";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <FeaturedWork />
    </I18nProvider>
  );
}

describe("FeaturedWork component", () => {
  it("renders section title", () => {
    renderWithI18n();
    expect(screen.getByText("Nasze realizacje")).toBeInTheDocument();
  });

  it("renders all 4 project cards", () => {
    renderWithI18n();
    expect(screen.getByText("Estalo")).toBeInTheDocument();
    expect(screen.getByText("Baulx")).toBeInTheDocument();
    expect(screen.getByText("Athlix")).toBeInTheDocument();
    expect(screen.getByText("LearnAI")).toBeInTheDocument();
  });

  it("shows status badges for non-live projects", () => {
    renderWithI18n();
    expect(screen.getByText("Wkrótce")).toBeInTheDocument(); // LearnAI
    expect(screen.getByText("W realizacji")).toBeInTheDocument(); // Athlix
  });

  it("project cards have correct links", () => {
    renderWithI18n();
    const links = screen.getAllByRole("link");
    const projectLinks = links.filter((l) =>
      l.getAttribute("href")?.startsWith("/projects/")
    );
    expect(projectLinks).toHaveLength(4);
  });

  it("each card shows tags", () => {
    renderWithI18n();
    expect(screen.getAllByText("SaaS").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("CNC")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
    expect(screen.getByText("EdTech")).toBeInTheDocument();
  });

  it("shows 'Zobacz projekt' text for each card", () => {
    renderWithI18n();
    const viewLinks = screen.getAllByText("Zobacz projekt");
    expect(viewLinks.length).toBe(4);
  });

  it("status badges have correct indicator dots", () => {
    const { container } = renderWithI18n();
    // Development (Athlix) should have amber dot with animate-pulse
    const amberDots = container.querySelectorAll(".bg-amber-400\\/70");
    expect(amberDots.length).toBeGreaterThanOrEqual(1);
    // Planned (LearnAI) should have white/gray dot
    const grayDots = container.querySelectorAll(".bg-white\\/40");
    expect(grayDots.length).toBeGreaterThanOrEqual(1);
  });

  it("cards render as article elements", () => {
    const { container } = renderWithI18n();
    const articles = container.querySelectorAll("article");
    expect(articles.length).toBe(4);
  });

  it("live projects show green badge (emerald dot)", () => {
    const { container } = renderWithI18n();
    // Live projects (Estalo, Baulx) should have emerald-400 dots
    const greenDots = container.querySelectorAll(".bg-emerald-400");
    expect(greenDots.length).toBe(2); // Estalo and Baulx
  });

  it("cards are in a grid layout for equal height", () => {
    const { container } = renderWithI18n();
    // The container should use CSS grid
    const gridContainer = container.querySelector(".grid.grid-cols-1.md\\:grid-cols-2");
    expect(gridContainer).toBeInTheDocument();
  });
});
