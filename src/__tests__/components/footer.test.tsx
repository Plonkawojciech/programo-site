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
  it("renders copyright with current year and company name", () => {
    renderWithI18n();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}.*Programo`))).toBeInTheDocument();
  });

  it("renders the company data line (Programo s.c., Poznań)", () => {
    renderWithI18n();
    expect(screen.getByText("Programo s.c.")).toBeInTheDocument();
    expect(screen.getByText("Poznań, Polska")).toBeInTheDocument();
  });

  it("renders both phone numbers and the email as functional links", () => {
    renderWithI18n();
    const bartosz = screen.getByRole("link", { name: "+48 509 123 434" });
    expect(bartosz).toHaveAttribute("href", "tel:+48509123434");
    const wojciech = screen.getByRole("link", { name: "+48 797 222 363" });
    expect(wojciech).toHaveAttribute("href", "tel:+48797222363");
    const email = screen.getByRole("link", { name: "biuro@programo.pl" });
    expect(email).toHaveAttribute("href", "mailto:biuro@programo.pl");
  });

  it("renders the 'reply within 24h' promise", () => {
    renderWithI18n();
    expect(screen.getAllByText("Odpowiadamy w 24 h").length).toBeGreaterThan(0);
  });

  it("renders the four-pillar offer column with a link to /oferta", () => {
    renderWithI18n();
    const offerLinks = screen.getAllByRole("link").filter((l) => l.getAttribute("href") === "/oferta");
    expect(offerLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders a top-6 projects column linking to project pages", () => {
    renderWithI18n();
    const jedmarLink = screen.getByRole("link", { name: "Jedmar" });
    expect(jedmarLink).toHaveAttribute("href", "/projects/jedmar");
  });

  it("renders the company column (about, pricing, contact, privacy policy)", () => {
    renderWithI18n();
    expect(screen.getByRole("link", { name: "Wycena" })).toHaveAttribute("href", "/cennik");
    const privacyLink = screen.getByRole("link", { name: "Polityka prywatności" });
    expect(privacyLink).toHaveAttribute("href", "/polityka-prywatnosci");
  });

  it("uses semantic footer element", () => {
    const { container } = renderWithI18n();
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("i18n: location changes to 'Poland' in EN", () => {
    renderWithToggle();
    // Default PL
    expect(screen.getByText("Poznań, Polska")).toBeInTheDocument();
    // Toggle to EN
    fireEvent.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText("Poznan, Poland")).toBeInTheDocument();
  });
});
