import { describe, it, expect } from "vitest";
import { buildLeadMailBody } from "@/lib/mail/graph";

const base = {
  displayName: "Anna Kowalska",
  subject: "Wycena projektu",
  sources: [] as [string, string][],
  consentAt: "2026-09-05T10:00:00.000Z",
};

describe("buildLeadMailBody", () => {
  it("puts who and how to reach them in the subject line", () => {
    const { subject } = buildLeadMailBody({
      ...base,
      phone: "509123434",
      email: "anna@example.com",
    });
    // The subject is what shows on a locked phone, so both contact routes have
    // to survive into it.
    expect(subject).toContain("Anna Kowalska");
    expect(subject).toContain("509123434");
    expect(subject).toContain("anna@example.com");
  });

  it("does not leave a dangling separator for a lead with no contact details", () => {
    // Cannot happen through the schema (e-mail or phone is required), but the
    // builder must not produce "Nowy lead: X — " if it ever does.
    const { subject } = buildLeadMailBody(base);
    expect(subject).toBe("Nowy lead: Anna Kowalska");
  });

  it("escapes HTML so a submitted value cannot inject markup", () => {
    const { html } = buildLeadMailBody({
      ...base,
      message: '<img src=x onerror="alert(1)">',
      displayName: '<script>bad</script>',
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("omits rows that have no value instead of rendering empty cells", () => {
    const { html } = buildLeadMailBody(base);
    expect(html).not.toContain("Telefon");
    expect(html).not.toContain("Budżet");
    expect(html).toContain("Temat");
  });

  it("renders attribution pairs passed by the route", () => {
    const { html } = buildLeadMailBody({
      ...base,
      sources: [
        ["Kampania", "brand-poznan"],
        ["gclid", "abc123"],
      ],
    });
    expect(html).toContain("brand-poznan");
    expect(html).toContain("abc123");
  });
});
