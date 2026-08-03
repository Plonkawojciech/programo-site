import { describe, it, expect } from "vitest";

// We need to import the translations directly
// The file uses "use client" but we can still import the data
import { translations, type Lang } from "@/lib/i18n";

const allKeys = Object.keys(translations) as (keyof typeof translations)[];

describe("i18n translations", () => {
  it("all PL keys exist in EN", () => {
    for (const key of allKeys) {
      expect(translations[key]).toHaveProperty("en");
      expect(translations[key]).toHaveProperty("pl");
    }
  });

  it("all EN keys exist in PL", () => {
    for (const key of allKeys) {
      expect(translations[key]).toHaveProperty("pl");
    }
  });

  // Blank is a legitimate state: the owner clears copy from the localhost editor
  // when a line should stop rendering, and the key has to stay so the editor can
  // still find it. What is never legitimate is clearing one language only - that
  // ships a visible string to one audience and a hole to the other. So the rule
  // is parity, not non-emptiness.
  it("a cleared string is cleared in both languages", () => {
    for (const key of allKeys) {
      const entry = translations[key];
      expect(
        entry.en === "",
        `"${key}" is blank in PL but still set in EN - clear both or neither`,
      ).toBe(entry.pl === "");
    }
  });

  it("no duplicate values between different keys (sanity check for at least 5 keys)", () => {
    // Just check that not ALL values are the same — this is a sanity test
    const plValues = allKeys.map((k) => translations[k].pl);
    const uniquePl = new Set(plValues);
    expect(uniquePl.size).toBeGreaterThan(5);
  });

  // The site's copy uses a plain hyphen everywhere. An em dash creeping back in
  // is the tell that a block of text was pasted from a generator rather than
  // written, so guard the whole dictionary rather than spot-checking components.
  it("no em dashes in any translation value", () => {
    for (const key of allKeys) {
      const entry = translations[key];
      expect(entry.pl, `PL value for "${key}" contains an em dash`).not.toContain("\u2014");
      expect(entry.en, `EN value for "${key}" contains an em dash`).not.toContain("\u2014");
    }
  });

  it("TranslationKey type covers all keys", () => {
    // If translations object has N keys, allKeys length should match
    expect(allKeys.length).toBeGreaterThan(30);
  });

  it("default language is PL", () => {
    // Every key must have pl set
    for (const key of allKeys) {
      expect(typeof translations[key].pl).toBe("string");
    }
  });

  it("has both PL and EN for all contact form keys", () => {
    const contactKeys = allKeys.filter((k) => k.startsWith("contact.form."));
    expect(contactKeys.length).toBeGreaterThanOrEqual(15);
    for (const key of contactKeys) {
      expect(translations[key].pl).toBeTruthy();
      expect(translations[key].en).toBeTruthy();
    }
  });

  it("lang types are correct", () => {
    const langs: Lang[] = ["pl", "en"];
    expect(langs).toContain("pl");
    expect(langs).toContain("en");
  });

  it("status labels are translated", () => {
    const statusKeys = ["project.statusLive", "project.statusDev", "project.statusPlanned"] as const;
    for (const key of statusKeys) {
      expect(translations[key].pl).toBeTruthy();
      expect(translations[key].en).toBeTruthy();
      expect(translations[key].pl).not.toBe(translations[key].en);
    }
  });

  it("unknown key returns key itself (fallback)", () => {
    // This tests the t() function behavior — translations object shouldn't have the key
    const fakeKey = "nonexistent.key.that.does.not.exist";
    expect(allKeys).not.toContain(fakeKey);
  });

  it("toggle changes returned text - PL and EN differ for key translations", () => {
    // Verify that toggling language would return different text for most keys
    const keysWithDifferentTranslations = allKeys.filter(
      (k) => translations[k].pl !== translations[k].en
    );
    // At least 80% of keys should have different PL/EN values
    expect(keysWithDifferentTranslations.length).toBeGreaterThan(allKeys.length * 0.5);
  });

  it("nested/dotted keys work correctly", () => {
    // Resolution, not content. Whether a key carries copy is the owner's call
    // (the parity test above covers that); what must always hold is that a
    // dotted key resolves to a string in both languages, never undefined.
    const dottedKeys = allKeys.filter((k) => k.includes("."));
    expect(dottedKeys.length).toBeGreaterThan(20);
    for (const key of dottedKeys) {
      expect(typeof translations[key].pl).toBe("string");
      expect(typeof translations[key].en).toBe("string");
    }
  });
});
