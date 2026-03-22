import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Hero from "@/components/hero";
import { I18nProvider, useI18n } from "@/lib/i18n";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <Hero />
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
      <Hero />
    </I18nProvider>
  );
}

describe("Hero component", () => {
  it("renders heading text 'Programo'", () => {
    renderWithI18n();
    expect(screen.getByText("Programo")).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    renderWithI18n();
    expect(screen.getByText("Zobacz projekty")).toBeInTheDocument();
    expect(screen.getByText("O nas")).toBeInTheDocument();
    expect(screen.getByText("Kontakt")).toBeInTheDocument();
  });

  it("renders label text", () => {
    renderWithI18n();
    expect(screen.getByText("Studio Software")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderWithI18n();
    expect(screen.getByText(/Projektujemy i budujemy/)).toBeInTheDocument();
  });

  it("hero section uses clamp for font-size", () => {
    renderWithI18n();
    const h1 = screen.getByText("Programo");
    expect(h1.className).toContain("clamp");
  });

  it("scroll indicator element is present", () => {
    const { container } = renderWithI18n();
    // The scroll indicator is an absolutely positioned div at the bottom
    const indicator = container.querySelector(".absolute.bottom-10");
    expect(indicator).toBeInTheDocument();
  });

  it("language toggle changes hero text", () => {
    renderWithToggle();
    // Default PL
    expect(screen.getByText("Studio Software")).toBeInTheDocument();
    // Toggle to EN
    fireEvent.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText("Software Studio")).toBeInTheDocument();
  });

  it("mobile: buttons stack vertically (flex-col class)", () => {
    const { container } = renderWithI18n();
    // The CTA container should have flex-col for mobile
    const ctaContainer = container.querySelector(".flex.flex-col");
    expect(ctaContainer).toBeInTheDocument();
  });

  it("animation motion elements are present", () => {
    const { container } = renderWithI18n();
    // framer-motion renders elements with style attributes for transforms
    const motionElements = container.querySelectorAll("[style]");
    expect(motionElements.length).toBeGreaterThan(0);
  });
});
