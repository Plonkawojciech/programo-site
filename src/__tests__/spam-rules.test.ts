import { describe, expect, it } from "vitest";
import { contactFingerprint, mergeVerdicts, nationalDigits, scoreContent } from "@/lib/spam-rules";

describe("spam content rules", () => {
  it("passes an ordinary Polish enquiry", () => {
    expect(scoreContent({ name: "Anna", phone: "+48 512 345 678", message: "Potrzebuję strony dla gabinetu." })).toEqual({
      level: "clean",
      reasons: [],
    });
    expect(scoreContent({ phone: "61 855 12 34" }).level).toBe("clean");
    expect(scoreContent({ email: "biuro@firma.pl", name: "Jan Kowalski" }).level).toBe("clean");
  });

  it("drops placeholder and pattern numbers", () => {
    for (const phone of ["+48 600 000 000", "600 100 200", "123456789", "999 999 999", "987654321", "123 123 123", "500 000 000"]) {
      expect(scoreContent({ phone }).level, phone).toBe("drop");
    }
  });

  it("flags numbers outside the Polish plan instead of dropping them", () => {
    expect(scoreContent({ phone: "+1 415 555 2671" }).level).toBe("suspicious");
    expect(scoreContent({ phone: "+49 151 23456789" }).level).toBe("suspicious");
    expect(scoreContent({ phone: "012 345 678" }).level).not.toBe("clean");
  });

  it("treats one link as a flag and several as spam", () => {
    expect(scoreContent({ phone: "512345678", message: "Moja strona to www.firma.pl" }).level).toBe("suspicious");
    expect(scoreContent({ phone: "512345678", message: "http://a.ru/x i https://b.xyz/y" }).level).toBe("drop");
    expect(scoreContent({ phone: "512345678", message: '<a href="x">kliknij</a>' }).level).toBe("drop");
  });

  it("flags non-Latin text, digits in the name and throwaway inboxes", () => {
    expect(scoreContent({ phone: "512345678", message: "Здравствуйте" }).level).toBe("suspicious");
    expect(scoreContent({ phone: "512345678", name: "Jan12345" }).level).toBe("suspicious");
    expect(scoreContent({ email: "x@mailinator.com", name: "Jan" }).level).toBe("suspicious");
  });

  it("keeps Polish diacritics and long honest messages clean", () => {
    expect(scoreContent({ phone: "512345678", name: "Żaneta Świątek", message: "Chcę sklep z wędlinami, około 200 produktów, płatności BLIK." }).level).toBe("clean");
  });

  it("normalises the country prefix", () => {
    expect(nationalDigits("+48 512-345-678")).toBe("512345678");
    expect(nationalDigits("0048512345678")).toBe("512345678");
    expect(nationalDigits("")).toBe("");
  });

  it("merges to the harsher verdict and keeps both reasons", () => {
    expect(mergeVerdicts({ level: "suspicious", reasons: ["a"] }, { level: "drop", reasons: ["b"] })).toEqual({ level: "drop", reasons: ["a", "b"] });
    expect(mergeVerdicts({ level: "clean", reasons: [] }, { level: "clean", reasons: [] }).level).toBe("clean");
  });

  it("fingerprints by phone first, then e-mail", () => {
    expect(contactFingerprint({ phone: "+48 512 345 678", email: "A@B.pl" })).toBe("p:512345678");
    expect(contactFingerprint({ email: " A@B.pl " })).toBe("e:a@b.pl");
    expect(contactFingerprint({})).toBe("");
  });
});
