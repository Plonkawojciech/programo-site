import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "@/components/footer";
import { I18nProvider, useI18n } from "@/lib/i18n";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <Footer />
    </I18nProvider>
  );
}

function ToggleButton() {
  const { toggle } = useI18n();
  return <button data-testid="toggle-lang" onClick={toggle}>Toggle</button>;
}

function renderWithToggle() {
  return render(
    <I18nProvider>
      <ToggleButton />
      <Footer />
    </I18nProvider>
  );
}

describe("Footer component", () => {
  it("renders copyright with current year", () => {
    renderWithI18n();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`2024.*${year}.*Programo`))).toBeInTheDocument();
  });

  it("social links have target=_blank and rel=noopener", () => {
    renderWithI18n();
    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("location 'Poznań' is visible", () => {
    renderWithI18n();
    expect(screen.getByText(/Pozna/)).toBeInTheDocument();
  });

  it("links are functional (have href)", () => {
    renderWithI18n();
    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink.getAttribute("href")).toContain("github.com");

    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink.getAttribute("href")).toContain("linkedin.com");
  });

  it("copyright text includes 'Programo'", () => {
    renderWithI18n();
    expect(screen.getByText(/Programo/)).toBeInTheDocument();
  });

  it("uses semantic footer element", () => {
    const { container } = renderWithI18n();
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("i18n: location changes to 'Poland' in EN", () => {
    renderWithToggle();
    // Default PL
    expect(screen.getByText(/Polska/)).toBeInTheDocument();
    // Toggle to EN
    fireEvent.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText(/Poland/)).toBeInTheDocument();
  });
});
