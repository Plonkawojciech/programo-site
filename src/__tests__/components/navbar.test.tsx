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
  it("renders the seven main nav links", () => {
    renderWithI18n();
    expect(screen.getAllByText("Oferta").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Projekty").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sklepy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Strony i reklamy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Wycena").length).toBeGreaterThan(0);
    expect(screen.getAllByText("O nas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kontakt").length).toBeGreaterThan(0);
  });

  it("nav link to the marketing landing points at /strony-tracking-reklamy", () => {
    renderWithI18n();
    const links = screen.getAllByRole("link").filter(
      (l) => l.getAttribute("href") === "/strony-tracking-reklamy"
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
