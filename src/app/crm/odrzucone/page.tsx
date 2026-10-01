import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { CRM_COOKIE, verifyToken } from "@/lib/crm-auth";
import { getRejected } from "@/lib/leads";
import LoginForm from "../LoginForm";

export const metadata: Metadata = {
  title: "Odrzucone zgłoszenia - Programo CRM",
  robots: { index: false, follow: false },
};

// Always render fresh (reads cookie + live store) — same contract as /crm.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STAGE_LABEL: Record<string, string> = {
  honeypot: "Ukryte pole",
  behaviour: "Zachowanie",
  content: "Treść",
  duplicate: "Powtórka",
};

/**
 * Audit view of what the anti-spam layers in /api/contact refused: which form,
 * which rule, what was typed. Read-only. It exists so a rule that starts
 * catching real people is noticed here and not three weeks later.
 */
export default async function RejectedPage() {
  const token = (await cookies()).get(CRM_COOKIE)?.value;
  if (!verifyToken(token)) return <LoginForm />;

  const rows = await getRejected(300);
  const byStage = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.stage]: (acc[r.stage] ?? 0) + 1 }), {});
  const byForm = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.formId || "?"]: (acc[r.formId || "?"] ?? 0) + 1 }), {});

  return (
    <div className="min-h-screen bg-surface px-4 pb-16 pt-28 text-on-surface md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/crm" className="text-sm text-primary underline underline-offset-4">
          ← Leady
        </Link>
        <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight">Odrzucone zgłoszenia</h1>
        <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
          Ostatnie {rows.length} zgłoszeń, które filtr odrzucił bez powiadomienia. Nadawca dostał zwykłe potwierdzenie.
          Jeśli widzisz tu prawdziwą osobę, reguła jest za ostra.
        </p>

        <dl className="mt-6 flex flex-wrap gap-3 text-sm">
          {Object.entries(byStage).map(([stage, n]) => (
            <div key={stage} className="rounded-full bg-card px-4 py-2 shadow-card">
              <dt className="inline text-on-surface-variant">{STAGE_LABEL[stage] ?? stage}: </dt>
              <dd className="inline font-semibold tabular-nums">{n}</dd>
            </div>
          ))}
          {Object.entries(byForm).map(([form, n]) => (
            <div key={form} className="rounded-full border border-outline-variant/60 px-4 py-2">
              <dt className="inline text-on-surface-variant">formularz {form}: </dt>
              <dd className="inline font-semibold tabular-nums">{n}</dd>
            </div>
          ))}
        </dl>

        {rows.length === 0 ? (
          <p className="mt-10 text-on-surface-variant">Nic jeszcze nie odrzucono.</p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl bg-card shadow-card">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-on-surface-variant">
                <tr>
                  {["Kiedy", "Warstwa", "Powód", "Formularz", "Dane", "Sygnały", "Sieć"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.ts}-${i}`} className="border-t border-outline-variant/30 align-top">
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                      {new Date(r.ts).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw", dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-3">{STAGE_LABEL[r.stage] ?? r.stage}</td>
                    <td className="px-4 py-3">{r.reasons.join("; ")}</td>
                    <td className="px-4 py-3">
                      {r.formId || "?"}
                      <span className="block max-w-[220px] truncate text-xs text-on-surface-variant">{r.pageUrl}</span>
                    </td>
                    <td className="px-4 py-3">
                      {[r.name, r.phone, r.email].filter(Boolean).join(" · ") || "brak"}
                      {r.message && <span className="mt-1 block max-w-[320px] text-xs text-on-surface-variant">{r.message}</span>}
                    </td>
                    <td className="max-w-[260px] px-4 py-3 text-xs text-on-surface-variant">{r.signals}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {r.ipPrefix}
                      <span className="block max-w-[200px] truncate">{r.userAgent}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
