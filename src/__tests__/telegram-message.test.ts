import { describe, it, expect } from "vitest";
import {
  buildLeadMessage,
  escapeMarkdownV2,
  bareReservedChars,
  type LeadNotification,
} from "@/lib/telegram-message";

// The regression these tests exist for:
//
// Commit 7110f17 (2026-08-03 16:23) swapped em dashes for hyphens across the
// site's copy — a change the owner asked for and which is right everywhere it
// landed except one line, the header of this message. An em dash means nothing
// to MarkdownV2; a hyphen is one of its 18 reserved characters. Telegram then
// rejected EVERY lead notification with 400 "can't parse entities".
//
// Nothing caught it. The lead still reached Redis and the CRM, so the route
// answered 200, the form showed its success state, and the only symptom was a
// phone that stopped buzzing. The last notification arrived 2026-08-03 00:57;
// the next one would have been five days later.
//
// So the assertion below is deliberately not "the header looks right". It is
// "no literal anywhere in this message can reach Telegram unescaped", which is
// the property that was actually violated.

const base: LeadNotification = {
  displayName: "Jan Kowalski",
  phone: "601234567",
  subject: "Wycena projektu",
  sources: [],
  consentAt: "2026-08-08T10:00:00.000Z",
};

describe("escapeMarkdownV2", () => {
  it("escapes every reserved character", () => {
    for (const c of "_*[]()~`>#+-=|{}.!") {
      expect(escapeMarkdownV2(c)).toBe(`\\${c}`);
    }
  });

  it("escapes the backslash itself", () => {
    expect(escapeMarkdownV2("\\")).toBe("\\\\");
  });

  it("leaves an em dash alone — it is not reserved", () => {
    expect(escapeMarkdownV2("a — b")).toBe("a — b");
  });
});

describe("buildLeadMessage", () => {
  it("leaves no reserved character bare in a minimal message", () => {
    expect(bareReservedChars(buildLeadMessage(base))).toEqual([]);
  });

  it("leaves no reserved character bare with every field populated", () => {
    const full: LeadNotification = {
      ...base,
      email: "jan@example.com",
      projectType: "Strona / landing",
      budget: "10-20 tys.",
      message: "Dzień dobry! Proszę o wycenę (pilne). Koszt ~15 000 zł?",
      sources: [
        ["Źródło", "google"],
        ["Kampania", "brand-poznan"],
        ["Strona wejścia", "https://programo.pl/oferta?a=1&b=2"],
      ],
    };
    expect(bareReservedChars(buildLeadMessage(full))).toEqual([]);
  });

  it("survives a payload built entirely from reserved characters", () => {
    const hostile = "_*[]()~`>#+-=|{}.!\\";
    const msg = buildLeadMessage({
      ...base,
      displayName: hostile,
      email: hostile,
      phone: hostile,
      projectType: hostile,
      budget: hostile,
      message: hostile,
      sources: [[hostile, hostile]],
    });
    expect(bareReservedChars(msg)).toEqual([]);
  });

  // The exact byte that broke it. Kept as its own case so a failure names the
  // cause instead of pointing at a generic escaping assertion.
  it("escapes the hyphen in the header", () => {
    expect(buildLeadMessage(base)).toContain("Nowa wiadomość \\- Programo");
  });

  it("still carries the lead's actual content", () => {
    const msg = buildLeadMessage({ ...base, email: "jan@example.com" });
    expect(msg).toContain("Jan Kowalski");
    expect(msg).toContain("601234567");
    expect(msg).toContain("jan@example\\.com");
    expect(msg).toContain("Wycena projektu");
  });

  it("omits the lines it has no value for", () => {
    const msg = buildLeadMessage(base);
    expect(msg).not.toContain("Email");
    expect(msg).not.toContain("Budżet");
    expect(msg).not.toContain("Źródło leada");
  });
});

describe("bareReservedChars", () => {
  // Guard on the guard: a detector that never fires would have let 7110f17
  // through just as quietly as having no test at all.
  it("catches the historical bug", () => {
    expect(bareReservedChars("*Nowa wiadomość - Programo*")).toEqual(["-"]);
  });

  it("accepts correctly escaped text", () => {
    expect(bareReservedChars("*Nowa wiadomość \\- Programo*")).toEqual([]);
  });
});
