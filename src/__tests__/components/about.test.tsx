import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "@/components/about";
import { I18nProvider } from "@/lib/i18n";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <About />
    </I18nProvider>
  );
}

describe("About component", () => {
  it("renders section heading", () => {
    renderWithI18n();
    expect(screen.getByText(/Dwóch builderów/)).toBeInTheDocument();
    expect(screen.getByText(/jedno studio/)).toBeInTheDocument();
  });

  it("renders founder names", () => {
    renderWithI18n();
    expect(screen.getByText("Wojciech Płonka")).toBeInTheDocument();
    expect(screen.getByText("Bartosz Kolaj")).toBeInTheDocument();
  });

  it("renders stats with correct values", () => {
    renderWithI18n();
    expect(screen.getByText("4+")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("Poznań")).toBeInTheDocument();
  });

  it("renders section label", () => {
    renderWithI18n();
    expect(screen.getByText("Kim jesteśmy")).toBeInTheDocument();
  });

  it("has section id 'about'", () => {
    const { container } = renderWithI18n();
    const section = container.querySelector("#about");
    expect(section).toBeInTheDocument();
  });

  it("renders founder descriptions", () => {
    renderWithI18n();
    expect(screen.getByText(/Budujemy kompletne produkty/)).toBeInTheDocument();
  });
});
