import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/navbar";
import { I18nProvider } from "@/lib/i18n";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function renderWithI18n() {
  return render(
    <I18nProvider>
      <Navbar />
    </I18nProvider>
  );
}

describe("Navbar component", () => {
  it("renders nav links", () => {
    renderWithI18n();
    expect(screen.getAllByText("Projekty").length).toBeGreaterThan(0);
    expect(screen.getAllByText("O nas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Technologie").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kontakt").length).toBeGreaterThan(0);
  });

  it("language toggle button is visible", () => {
    renderWithI18n();
    // Desktop shows "EN" when lang is "pl"
    const buttons = screen.getAllByText("EN");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("PL/EN toggle changes button text", () => {
    renderWithI18n();
    const toggleBtn = screen.getAllByText("EN")[0];
    fireEvent.click(toggleBtn);
    // After toggle, it should show "PL"
    expect(screen.getAllByText("PL").length).toBeGreaterThan(0);
  });

  it("mobile hamburger button exists", () => {
    renderWithI18n();
    const hamburger = screen.getByLabelText("Toggle menu");
    expect(hamburger).toBeInTheDocument();
  });

  it("has navigation role", () => {
    renderWithI18n();
    const navs = screen.getAllByRole("navigation");
    expect(navs.length).toBeGreaterThanOrEqual(1);
  });

  it("has aria-label on navigation", () => {
    renderWithI18n();
    const navs = screen.getAllByRole("navigation");
    for (const nav of navs) {
      expect(nav).toHaveAttribute("aria-label");
    }
  });

  it("logo links to homepage", () => {
    renderWithI18n();
    const homeLinks = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href") === "/"
    );
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("mobile menu opens on hamburger click", () => {
    renderWithI18n();
    const hamburger = screen.getByLabelText("Toggle menu");
    fireEvent.click(hamburger);
    // After clicking, mobile menu overlay with CTA link should appear
    const ctaLinks = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href")?.includes("mailto:")
    );
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("scroll: background changes on scroll", async () => {
    renderWithI18n();
    // Simulate scroll by setting scrollY and dispatching event
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    fireEvent.scroll(window);
    // After scroll, the mobile nav should have backdrop-blur class
    // Wait for state update
    await vi.waitFor(() => {
      const navs = screen.getAllByRole("navigation");
      const mobileNav = navs.find((n) => n.className.includes("md:hidden"));
      expect(mobileNav?.className).toContain("backdrop-blur");
    });
  });
});
