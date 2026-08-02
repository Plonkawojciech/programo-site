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
    // Each tech appears 4 times (duplicated array in 2 marquee rows)
    for (const tech of techs) {
      const matches = screen.getAllByText(tech);
      expect(matches.length).toBe(4);
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

  it("renders technology descriptions from i18n", () => {
    renderWithI18n();
    // Each tech card includes its i18n description, e.g. t("stack.nextjs") = "Full-stack framework React"
    const descriptions = screen.getAllByText("Full-stack framework React");
    expect(descriptions.length).toBeGreaterThanOrEqual(1);
  });
});
