import { describe, it, expect } from "vitest";
import { scoreBotSignals } from "@/lib/bot-score";
import { buildLeadMessage, bareReservedChars } from "@/lib/telegram-message";

const human = { wd: false, kd: 18, pm: 90, pd: 2, ts: 0, sc: 3, paste: 0, ms: 35_000, tz: "Europe/Warsaw", lang: "pl-PL", sw: 1440, sh: 900 };
const phone = { ...human, kd: 14, pm: 0, pd: 0, ts: 6, ms: 25_000, sw: 390, sh: 844 };

describe("bot score", () => {
  it("lets a desktop visitor and a phone visitor through clean", () => {
    expect(scoreBotSignals(human)).toEqual({ level: "clean", reasons: [] });
    expect(scoreBotSignals(phone).level).toBe("clean");
  });

  it("drops a browser that declares automation", () => {
    expect(scoreBotSignals({ ...human, wd: true }).level).toBe("drop");
  });

  it("drops a submission with no keys and no pointer/touch at all", () => {
    expect(scoreBotSignals({ ...human, kd: 0, pm: 0, pd: 0, ts: 0 }).level).toBe("drop");
  });

  it("flags, never drops, what a person could plausibly do", () => {
    // Full autofill + one click: no typing, but a real click.
    const autofill = scoreBotSignals({ ...human, kd: 0, pm: 30, pd: 1 });
    expect(autofill.level).toBe("suspicious");
    expect(autofill.reasons).toContain("nic nie wpisano z klawiatury");
    expect(scoreBotSignals({ ...human, ms: 4_000 }).level).toBe("suspicious");
    expect(scoreBotSignals({ ...human, tz: "America/New_York" }).reasons).toContain("strefa czasowa America/New_York");
  });

  it("flags a payload without signals (posted from outside our page)", () => {
    expect(scoreBotSignals(undefined).level).toBe("suspicious");
  });

  it("puts a valid PODEJRZANE header on the Telegram message", () => {
    const text = buildLeadMessage({
      displayName: "Ania",
      phone: "887843261",
      subject: "Wycena projektu",
      sources: [],
      consentAt: "2026-09-30T05:23:48.857Z",
      suspicion: { reasons: ["nic nie wpisano z klawiatury"], signals: "klawisze 0, ruch myszy 12 (x)" },
    });
    expect(text.startsWith("*PODEJRZANE")).toBe(true);
    expect(bareReservedChars(text)).toEqual([]);
  });
});
