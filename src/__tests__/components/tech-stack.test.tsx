import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TechStack from "@/components/tech-stack";
import { I18nProvider } from "@/lib/i18n";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <TechStack />
    </I18nProvider>
  );
}

describe("TechStack component", () => {
  it("renders section heading", () => {
    renderWithI18n();
    expect(screen.getByText("Technologie")).toBeInTheDocument();
  });

  it("renders all 15 technologies", () => {
    renderWithI18n();
    const techs = [
      "Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase",
      "Neon", "Drizzle", "Vercel", "Capacitor", "Azure AI",
      "Anthropic", "Stripe", "Resend", "Three.js", "Konva.js",
    ];
    for (const tech of techs) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it("has section id 'stack'", () => {
    const { container } = renderWithI18n();
    const section = container.querySelector("#stack");
    expect(section).toBeInTheDocument();
  });

  it("renders section label", () => {
    renderWithI18n();
    expect(screen.getByText("Nasze narzędzia")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderWithI18n();
    expect(screen.getByText(/Wybieramy narzędzia/)).toBeInTheDocument();
  });
});
