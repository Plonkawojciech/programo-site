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
  // Seven items since 2026-08-09, when "Współpraca" came back at the owner's
  // request — see the comment above navLinks in navbar.tsx for why the count
  // is bounded by measurement. "Sklepy" and "Strony i reklamy" stay out of the
  // top-level pill; they're pillar cards on /oferta and links in the footer.
  it("renders the seven main nav links", () => {
    renderWithI18n();
    for (const label of ["Oferta", "Projekty", "Wycena", "Blog", "O nas", "Współpraca", "Kontakt"]) {
      expect(screen.getAllByText(label).length, `brak pozycji "${label}"`).toBeGreaterThan(0);
    }
  });

  // The referral programme pays people to send work our way, so it has to be
  // reachable from the top nav and not only from the footer. Asserting the
  // href, not just the label, because the label alone would still pass if the
  // link pointed nowhere useful.
  it("Współpraca points at /wspolpraca", () => {
    renderWithI18n();
    const links = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href") === "/wspolpraca"
    );
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("nav link to the offer page points at /oferta", () => {
    renderWithI18n();
    const links = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href") === "/oferta"
    );
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("shows a clickable phone number on desktop", () => {
    renderWithI18n();
    const telLinks = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href") === "tel:+48509123434"
    );
    expect(telLinks.length).toBeGreaterThanOrEqual(1);
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

  it("mobile menu shows a phone link at the top when opened", () => {
    renderWithI18n();
    const hamburger = screen.getByLabelText("Toggle menu");
    fireEvent.click(hamburger);
    const telLinks = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href") === "tel:+48509123434"
    );
    expect(telLinks.length).toBeGreaterThanOrEqual(1);
  });
});
