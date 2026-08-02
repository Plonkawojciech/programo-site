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
    // Current nav links via i18n: Uslugi (dropdown), Realizacje, Jak pracujemy, Wycena, O nas
    expect(screen.getAllByText("Realizacje").length).toBeGreaterThan(0);
    expect(screen.getAllByText("O nas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Wycena").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Jak pracujemy").length).toBeGreaterThan(0);
  });

  it("services dropdown button exists", () => {
    renderWithI18n();
    const servicesBtn = screen.getAllByText("Us\u0142ugi");
    expect(servicesBtn.length).toBeGreaterThan(0);
    // The desktop dropdown button has aria-haspopup
    const dropdown = screen.getByRole("button", { name: /Us\u0142ugi/i });
    expect(dropdown).toHaveAttribute("aria-haspopup", "true");
    expect(dropdown).toHaveAttribute("aria-expanded", "false");
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

  it("mobile menu opens on hamburger click and shows CTA link", () => {
    renderWithI18n();
    const hamburger = screen.getByLabelText("Toggle menu");
    fireEvent.click(hamburger);
    // After clicking, mobile menu overlay with CTA link to /kontakt should appear
    const ctaLinks = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href")?.includes("/kontakt")
    );
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("scroll: data-scrolled attribute changes on scroll", async () => {
    renderWithI18n();
    // Before scroll, data-scrolled should be "false"
    const navs = screen.getAllByRole("navigation");
    const mobileNav = navs.find((n) => n.className.includes("md:hidden"));
    const pillBefore = mobileNav?.querySelector("[data-scrolled]");
    expect(pillBefore?.getAttribute("data-scrolled")).toBe("false");

    // Simulate scroll by setting scrollY and dispatching event
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    fireEvent.scroll(window);
    // The scroll handler uses requestAnimationFrame, so wait for it
    await vi.waitFor(() => {
      const pill = mobileNav?.querySelector("[data-scrolled]");
      expect(pill?.getAttribute("data-scrolled")).toBe("true");
    });
  });
});
