import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "@/components/footer";
import { I18nProvider, useI18n, translations } from "@/lib/i18n";

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

  // Asserted against the dictionary, not a copy literal: the legal form and the
  // location are owner-editable, and the point of this test is that the company
  // data line renders at all.
  it("renders the company data line", () => {
    renderWithI18n();
    expect(
      screen.getByText(translations["footer.companyName"].pl),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations["footer.location"].pl),
    ).toBeInTheDocument();
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

  // The promise is owner-editable and currently cleared. The green dot is
  // decoration for that label, so on its own it is a coloured blob with no
  // meaning — the invariant worth holding is that the two appear together.
  it("pairs the status dot with the reply promise", () => {
    const { container } = renderWithI18n();
    const promise = translations["footer.reply"].pl.trim();
    expect(Boolean(container.querySelector(".bg-emerald-500"))).toBe(
      Boolean(promise),
    );
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
