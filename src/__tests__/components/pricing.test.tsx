import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Pricing from "@/components/pricing";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nProvider, useI18n } from "@/lib/i18n";

vi.mock("@/lib/analytics/client", () => ({ track: vi.fn() }));

function renderPricing() {
  return render(<I18nProvider><Pricing /></I18nProvider>);
}

describe("pricing navigation", () => {
  it("moves selection and focus with arrows and wraps at both ends", () => {
    renderPricing();
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(tabs[2]).toHaveFocus();
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(tabs[2], { key: "ArrowRight" });
    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("supports Home and End and exposes the selected panel", () => {
    renderPricing();
    const tabs = screen.getAllByRole("tab");
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(tabs[2]).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", tabs[2].id);
    fireEvent.keyDown(tabs[2], { key: "Home" });
    expect(tabs[0]).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", tabs[0].id);
  });
});

// Commercial source: marketing/FIRMA/sprzedaz/cennik.md, checked 2026-10-09.
// Assert rendered rows, not implementation constants, so an omitted row,
// discounted Start value or swapped translation cannot silently ship.
const sourceRows = [
  ["Strona internetowa (wizytówka lub firmowa)", "2 000", "6 000", "5 dni - 2 tyg."],
  ["Sklep Woo / Shopify", "4 000", "8 000", "3 tyg."],
  ["Sklep na własnym silniku", "6 000", "10 000", "6 tyg."],
  ["System / aplikacja webowa", "4 000", "8 000", "od 4 tyg."],
  ["Aplikacja mobilna iOS + Android", "4 000", "8 000", "6 tyg."],
  ["Opieka nad stroną", "300", "600", "/ mies."],
  ["Opieka nad sklepem / systemem", "800", "1 500", "/ mies."],
  ["SEO, Google Ads, GA4 + GTM", "150", "300", "/ mies."],
  ["Audyt procesów", "1 500", "6 000", "1 tydz."],
  ["Automatyzacja procesu", "1 500", "6 000", "2-4 tyg."],
  ["Asystent na danych firmy", "2 000", "4 000", "3-6 tyg."],
  ["Szkolenie zespołu", "4 000", "8 000", "1 dzień"],
  ["Opieka po wdrożeniu", "500", "2 000", "/ mies."],
];

const englishTerms = [
  "5 days - 2 weeks", "3 weeks", "6 weeks", "from 4 weeks", "6 weeks",
  "/ mo", "/ mo", "/ mo", "1 week", "2-4 weeks", "3-6 weeks", "1 day", "/ mo",
];

function LanguageToggle() {
  const { toggle } = useI18n();
  return <button onClick={toggle}>Change language</button>;
}

describe("published pricing source and conditions", () => {
  it("renders all Standard and Extended prices and terms in server HTML", () => {
    const html = renderToStaticMarkup(<I18nProvider><Pricing /></I18nProvider>);
    const document = new DOMParser().parseFromString(html, "text/html");
    const rows = [...document.querySelectorAll('[role="tabpanel"] li')];
    expect(rows).toHaveLength(sourceRows.length);
    for (const [name, standard, extended, term] of sourceRows) {
      const row = rows.find((row) => row.textContent?.includes(name));
      expect(row, `Missing price row: ${name}`).toBeDefined();
      expect(row?.textContent).toContain(`od ${standard} do ${extended} zł`);
      expect(row?.textContent).toContain(term);
    }
    expect(document.body.textContent).toContain("limit godzin każdego abonamentu");
    expect(document.body.textContent).toContain("23% VAT");
    expect(document.body.textContent).toContain("Budżet reklam i opłaty zewnętrznych usług rozliczasz osobno");
    expect(document.body.textContent).toContain("10 000 zł");
    expect(document.body.textContent).toContain("10% wydatku zamiast stawki z tabeli");
  });

  it("retains all price rows and equivalent conditions after switching to English", () => {
    const { container } = render(<I18nProvider><LanguageToggle /><Pricing /></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    const rows = [...container.querySelectorAll('[role="tabpanel"] li')];
    expect(rows).toHaveLength(sourceRows.length);
    sourceRows.forEach(([, standard, extended], index) => {
      expect(rows[index].textContent).toContain(`from ${standard.replaceAll(" ", ",")} to ${extended.replaceAll(" ", ",")} PLN`);
      expect(rows[index].textContent).toContain(englishTerms[index]);
    });
    expect(within(container).getByText(/The scope and included hours of every retainer/)).toHaveTextContent("Prices exclude 23% VAT");
    expect(container.textContent).toContain("Ad spend and external service fees are paid separately");
    expect(container.textContent).toContain("10,000 PLN monthly budget: 10% of spend instead of the table rate");
    localStorage.removeItem("programo-lang");
  });
});
