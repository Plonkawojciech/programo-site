import { z } from "zod/v4";

/** Behaviour telemetry only flags review; assistive input and autofill must never be discarded. */

export const botSignalsSchema = z
  .object({
    wd: z.boolean(),
    kd: z.number().int().min(0),
    pm: z.number().int().min(0),
    pd: z.number().int().min(0),
    ts: z.number().int().min(0),
    sc: z.number().int().min(0),
    paste: z.number().int().min(0),
    ms: z.number().min(0),
    tz: z.string().max(64),
    lang: z.string().max(35),
    sw: z.number().min(0),
    sh: z.number().min(0),
  })
  .partial();

export type BotSignalsPayload = z.infer<typeof botSignalsSchema>;

export type BotVerdict = { level: "clean" | "suspicious" | "drop"; reasons: string[] };

const FAST_MS = 8_000;

export function scoreBotSignals(sig: BotSignalsPayload | undefined): BotVerdict {
  if (!sig || Object.keys(sig).length === 0) {
    // Our own forms always send signals, so this is someone posting from
    // outside the page (or a tab opened before the deploy).
    return { level: "suspicious", reasons: ["brak sygnałów z przeglądarki"] };
  }
  if (sig.wd === true) return { level: "suspicious", reasons: ["przeglądarka sterowana automatycznie (webdriver)"] };

  const pointer = (sig.pm ?? 0) + (sig.pd ?? 0) + (sig.ts ?? 0);
  const keys = sig.kd ?? 0;
  if (keys === 0 && pointer === 0) {
    return { level: "suspicious", reasons: ["zero klawiszy i zero kliknięć/dotyku"] };
  }

  const reasons: string[] = [];
  if (keys === 0 && (sig.paste ?? 0) === 0) reasons.push("nic nie wpisano z klawiatury");
  if ((sig.pd ?? 0) + (sig.ts ?? 0) === 0) reasons.push("brak kliknięcia i dotyku");
  if (typeof sig.ms === "number" && sig.ms < FAST_MS) reasons.push(`wysłane ${Math.round(sig.ms / 1000)} s po wejściu`);
  if (sig.tz && !/^Europe\//.test(sig.tz)) reasons.push(`strefa czasowa ${sig.tz}`);

  return { level: reasons.length ? "suspicious" : "clean", reasons };
}

/** One line for logs / Telegram. */
export function describeSignals(sig: BotSignalsPayload | undefined): string {
  if (!sig) return "brak";
  const s = (n: number | undefined) => String(n ?? "-");
  return `klawisze ${s(sig.kd)}, ruch myszy ${s(sig.pm)}, klik ${s(sig.pd)}, dotyk ${s(sig.ts)}, wklejenia ${s(sig.paste)}, na stronie ${sig.ms != null ? Math.round(sig.ms / 1000) + " s" : "-"}, ${sig.tz || "-"}, ${sig.lang || "-"}, ekran ${s(sig.sw)}x${s(sig.sh)}`;
}
