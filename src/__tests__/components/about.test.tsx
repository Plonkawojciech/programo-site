import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "@/components/about";
import { I18nProvider, translations } from "@/lib/i18n";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <About />
    </I18nProvider>
  );
}

describe("About component", () => {
  // Asserted against the dictionary, not a copy literal. The wording is edited
  // often; what this test is actually for is that the heading renders at all.
  it("renders the page heading", () => {
    renderWithI18n();
    expect(screen.getByText(translations["about.title"].pl)).toBeInTheDocument();
  });

  it("renders founder names", () => {
    renderWithI18n();
    expect(screen.getByText("Wojciech Płonka")).toBeInTheDocument();
    expect(screen.getByText("Bartosz Kolaj")).toBeInTheDocument();
  });

  it("renders founder phone numbers as tel: links", () => {
    renderWithI18n();
    const wojciechTel = screen.getByRole("link", { name: "797 222 363" });
    expect(wojciechTel).toHaveAttribute("href", "tel:+48797222363");
    const bartoszTel = screen.getByRole("link", { name: "509 123 434" });
    expect(bartoszTel).toHaveAttribute("href", "tel:+48509123434");
  });

  it("has section id 'about'", () => {
    const { container } = renderWithI18n();
    const section = container.querySelector("#about");
    expect(section).toBeInTheDocument();
  });

  it("does not contain stock AI-slop phrases", () => {
    const { container } = renderWithI18n();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/międzynarodow[aey] ekspansj/i);
    expect(text).not.toMatch(/builder[óo]w/i);
    expect(text).not.toMatch(/cyfrow[aąe] przyszłoś/i);
  });

  it("renders the company data line", () => {
    renderWithI18n();
    expect(
      screen.getByText(translations["about.company.line"].pl),
    ).toBeInTheDocument();
  });
});
