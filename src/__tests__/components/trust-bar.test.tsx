import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TrustBar from "@/components/trust-bar";
import { I18nProvider, translations } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/projects";

const clients = [
  { name: "Jedmar", slug: "jedmar" },
  { name: "WKS Poznań", slug: "wks-poznan" },
  { name: "Skup Nieruchomości", slug: "skup-nieruchomosci" },
  { name: "Domki Poznaniak", slug: "domki-poznaniak" },
  { name: "W. Safe Finance", slug: "wsafefinanse" },
];

function renderTrustBar() {
  return render(
    <I18nProvider>
      <TrustBar />
    </I18nProvider>,
  );
}

describe("TrustBar", () => {
  it("links every client mark to its case study with scope in the label", () => {
    renderTrustBar();

    for (const client of clients) {
      const project = getProjectBySlug(client.slug);
      const scope = project?.scope ?? project?.role ?? project?.subtitle;
      expect(scope).toBeDefined();

      const link = screen.getByRole("link", {
        name: `${client.name}: ${scope?.pl}`,
      });
      expect(link).toHaveAttribute("href", `/projects/${client.slug}`);
      expect(link).toHaveClass("min-h-11", "min-w-11");
    }
  });

  it("renders the concise scope line", () => {
    renderTrustBar();
    expect(
      screen.getByText(translations["home.trust.scopeLine"].pl),
    ).toBeInTheDocument();
  });
});
