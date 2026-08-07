import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "@/components/footer";
import { I18nProvider, useI18n, translations } from "@/lib/i18n";
import { COMPANY, COMPANY_ADDRESS_LINE, COMPANY_IDS_LINE } from "@/lib/company";

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

  // Asserted against the dictionary, not a copy literal: the legal form is
  // owner-editable, and the point of this test is that the company data line
  // renders at all.
  it("renders the company data line", () => {
    renderWithI18n();
    expect(
      screen.getByText(translations["footer.companyName"].pl),
    ).toBeInTheDocument();
    expect(screen.getByText(COMPANY_ADDRESS_LINE)).toBeInTheDocument();
  });

  // Dane rejestrowe są obowiązkiem informacyjnym, a nie ozdobą stopki - jeśli
  // ktoś je kiedyś wytnie przy porządkach, ten test ma zapalić czerwone światło.
  it("renders the KRS, NIP and REGON identifiers", () => {
    renderWithI18n();
    expect(screen.getByText(COMPANY_IDS_LINE)).toBeInTheDocument();
    expect(COMPANY_IDS_LINE).toContain(COMPANY.krs);
    expect(COMPANY_IDS_LINE).toContain(COMPANY.nip);
    expect(COMPANY_IDS_LINE).toContain(COMPANY.regon);
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

  // Adres siedziby i numery rejestrowe celowo NIE przechodzą przez i18n:
  // to dane z KRS, a nie tekst do tłumaczenia. Wcześniej stopka pokazywała
  // tu "Poznań, Polska" / "Poznan, Poland" i ten test pilnował przełączania.
  // Teraz pilnuje odwrotności - że przełączenie języka ich nie rusza.
  it("i18n: the registered address and identifiers do not translate", () => {
    renderWithToggle();
    expect(screen.getByText(COMPANY_ADDRESS_LINE)).toBeInTheDocument();
    expect(screen.getByText(COMPANY_IDS_LINE)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("toggle-lang"));

    expect(screen.getByText(COMPANY_ADDRESS_LINE)).toBeInTheDocument();
    expect(screen.getByText(COMPANY_IDS_LINE)).toBeInTheDocument();
  });
});
