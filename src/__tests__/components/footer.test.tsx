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
  it("renders the Programo logo", () => {
    renderWithI18n();
    const logo = screen.getByAltText("Programo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/programo-logo-white.svg");
  });

  it("social links have target=_blank and rel=noopener", () => {
    renderWithI18n();
    const githubLink = screen.getByText("GitHub");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const linkedinLink = screen.getByText("LinkedIn");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("location 'Poznan, Polska' is visible", () => {
    renderWithI18n();
    expect(screen.getByText("Pozna\u0144, Polska")).toBeInTheDocument();
  });

  it("links are functional (have href)", () => {
    renderWithI18n();
    const githubLink = screen.getByText("GitHub");
    expect(githubLink.getAttribute("href")).toContain("github.com");

    const linkedinLink = screen.getByText("LinkedIn");
    expect(linkedinLink.getAttribute("href")).toContain("linkedin.com");
  });

  it("renders footer nav links with correct hrefs", () => {
    renderWithI18n();
    const nav = screen.getByLabelText("Mapa strony");
    expect(nav).toBeInTheDocument();

    const ofertaLink = screen.getByText("Oferta");
    expect(ofertaLink).toHaveAttribute("href", "/oferta");

    const cennikLink = screen.getByText("Cennik");
    expect(cennikLink).toHaveAttribute("href", "/cennik");
  });

  it("uses semantic footer element", () => {
    const { container } = renderWithI18n();
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("renders privacy policy link and cookie settings button", () => {
    renderWithI18n();
    const privacyLink = screen.getByText("Polityka prywatno\u015bci");
    expect(privacyLink).toHaveAttribute("href", "/polityka-prywatnosci");

    const cookieButton = screen.getByText("Ustawienia cookies");
    expect(cookieButton.tagName).toBe("BUTTON");
  });

  it("i18n: location changes to 'Poland' in EN", () => {
    renderWithToggle();
    // Default PL
    expect(screen.getByText("Pozna\u0144, Polska")).toBeInTheDocument();
    // Toggle to EN
    fireEvent.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText("Pozna\u0144, Poland")).toBeInTheDocument();
  });
});
