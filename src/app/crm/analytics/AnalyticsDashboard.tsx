import Link from "next/link";
import type {
  AnalyticsDashboardData,
  AiCrawlerBot,
  ClickIssue,
  ConsentSummary,
  FieldFunnelRow,
  FormFunnel,
  JsErrorRow,
  QualitySignals,
  SessionSummary,
  WebVitalRow,
} from "@/lib/analytics/query";
import { attributionField, sessionPath } from "@/lib/analytics/query";

// Server-rendered reader for the first-party event store (see lib/analytics/query.ts
// for the aggregation). No client JS: expand/collapse uses native <details>, there
// is no search/filter and nothing here needs to survive a re-render, so there is
// nothing to hydrate. Same auth + visual language as ../LeadsDashboard.tsx.

// --------------------------------------------------------------------- format

function formatDateTime(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "-";
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(ms));
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds} s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} min ${s}s` : `${m} min`;
}

function formatPct(v: number | null): string {
  return v === null ? "-" : `${Math.round(v * 100)}%`;
}

/** Polish plural: 1 sesja / 2-4 sesje / 5+ (and 12-14) sesji. */
function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
}

function paramValueToText(v: unknown): string {
  if (v === null || v === undefined || v === "") return "-";
  if (typeof v === "boolean") return v ? "tak" : "nie";
  return String(v);
}

// ---------------------------------------------------------------------- bits

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-headline text-2xl font-medium tracking-tight text-on-surface">{title}</h2>
      {hint && <p className="mt-2 text-sm text-on-surface-variant">{hint}</p>}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-outline-variant px-4 py-6 text-sm text-on-surface-variant">{text}</p>;
}

function CountChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-full border border-outline-variant px-2.5 py-0.5 text-xs text-on-surface-variant">
      {children}
    </span>
  );
}

// -------------------------------------------------------------------- 1. sessions

function SessionRow({ session }: { session: SessionSummary }) {
  const path = sessionPath(session);
  const source = attributionField(session.attribution, "source") ?? "direct";
  const referrerClass = attributionField(session.attribution, "referrer_class");
  const isAi = referrerClass === "ai";

  return (
    <details className="group py-4">
      <summary
        className="flex cursor-pointer list-none flex-col gap-2.5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 [&::-webkit-details-marker]:hidden"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0 text-on-surface-variant transition-transform duration-200 group-open:rotate-90"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <time dateTime={new Date(session.start).toISOString()} className="shrink-0 text-sm font-medium text-on-surface">
            {formatDateTime(session.start)}
          </time>
          <span className="text-xs text-on-surface-variant">{session.country ?? "?"}</span>
          <span className="text-xs text-on-surface-variant">
            {session.device ?? "?"} - {session.browser ?? "?"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
            {source}
            {isAi && (
              <span className="rounded-full border border-primary/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                AI
              </span>
            )}
          </span>
          {session.hasLead && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-500">
              Lead
            </span>
          )}
          {session.qualityFlags.map((flag) => (
            <span
              key={flag}
              className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-500"
            >
              {flag}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 gap-3 text-xs text-on-surface-variant">
          <span>{session.pageViews} odsłon</span>
          <span>{formatDuration(session.engagedSeconds)} zaang.</span>
          <span>{Math.round(session.maxScrollPct)}% scroll</span>
        </div>
      </summary>

      <p className="mt-3 break-words pl-[22px] text-xs leading-relaxed text-on-surface-variant">
        {path.length > 0 ? path.join(" → ") : "(brak zdarzeń w oknie danych poza kontekstem sesji)"}
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead>
            <tr className="border-b border-outline-variant text-on-surface-variant">
              <th className="px-3 py-2 font-medium">Czas</th>
              <th className="px-3 py-2 font-medium">Zdarzenie</th>
              <th className="px-3 py-2 font-medium">Ścieżka</th>
              <th className="px-3 py-2 font-medium">Parametry</th>
            </tr>
          </thead>
          <tbody>
            {session.events.map((e, i) => (
              <tr key={`${e.event_id}-${i}`} className="border-b border-outline-variant/40 last:border-b-0">
                <td className="whitespace-nowrap px-3 py-2 align-top text-on-surface-variant">{formatDateTime(e.ts)}</td>
                <td className="whitespace-nowrap px-3 py-2 align-top font-medium text-on-surface">{e.event}</td>
                <td className="px-3 py-2 align-top text-on-surface-variant">{e.path}</td>
                <td className="px-3 py-2 align-top text-on-surface-variant">
                  {Object.entries(e.params ?? {})
                    .map(([k, v]) => `${k}=${paramValueToText(v)}`)
                    .join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function SessionsSection({ sessions, batchCount }: { sessions: SessionSummary[]; batchCount: number }) {
  const word = plural(sessions.length, "sesja", "sesje", "sesji");
  return (
    <section>
      <SectionHeading
        title="Sesje"
        hint={`${sessions.length} ${word} w oknie ostatnich ${batchCount} paczek zdarzeń, najnowsze u góry. Kliknij wiersz, aby zobaczyć pełną listę zdarzeń.`}
      />
      {sessions.length === 0 ? (
        <EmptyState text="Brak zarejestrowanych sesji." />
      ) : (
        <div className="divide-y divide-outline-variant border-t border-outline-variant">
          {sessions.map((s) => (
            <SessionRow key={s.sessionId} session={s} />
          ))}
        </div>
      )}
    </section>
  );
}

// --------------------------------------------------------------- 2. form funnel

function FunnelStep({ label, value, rate }: { label: string; value: number; rate?: number | null }) {
  return (
    <div className="rounded-2xl border border-outline-variant p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">{label}</p>
      <p className="mt-2 font-headline text-3xl font-medium text-on-surface">{value}</p>
      {rate !== undefined && (
        <p className="mt-1 text-xs text-on-surface-variant">{formatPct(rate)} z poprzedniego kroku</p>
      )}
    </div>
  );
}

function FieldFunnelTable({ fields }: { fields: FieldFunnelRow[] }) {
  if (fields.length === 0) {
    return (
      <EmptyState text="Brak zdarzeń per-pole (form_field_complete / form_field_skip / form_error jeszcze nie wystąpiły w oknie danych)." />
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            <th className="px-4 py-3 font-medium">Pole</th>
            <th className="px-4 py-3 font-medium">Wypełnienia</th>
            <th className="px-4 py-3 font-medium">Mediana czasu</th>
            <th className="px-4 py-3 font-medium">Pominięcia</th>
            <th className="px-4 py-3 font-medium">Błędy</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.field} className="border-b border-outline-variant/40 align-top last:border-b-0">
              <td className="px-4 py-3 font-medium text-on-surface">{f.field}</td>
              <td className="px-4 py-3 text-on-surface-variant">{f.completions}</td>
              <td className="px-4 py-3 text-on-surface-variant">
                {f.medianSeconds !== null ? `${Math.round(f.medianSeconds)} s` : "-"}
              </td>
              <td className="px-4 py-3 text-on-surface-variant">{f.skips}</td>
              <td className="px-4 py-3 text-on-surface-variant">
                {f.errors}
                {f.errorMessages.length > 0 && (
                  <span className="ml-2 text-xs text-on-surface-variant/70">
                    ({f.errorMessages.map((m) => `${m.message} ×${m.count}`).join(", ")})
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormFunnelSection({ funnel }: { funnel: FormFunnel }) {
  return (
    <section>
      <SectionHeading title="Lejek formularza" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FunnelStep label="Formularz widoczny" value={funnel.viewSessions} />
        <FunnelStep label="Rozpoczęty" value={funnel.startSessions} rate={funnel.viewToStartRate} />
        <FunnelStep label="Wysłany" value={funnel.submitSessions} rate={funnel.startToSubmitRate} />
      </div>
      <p className="mt-4 text-sm text-on-surface-variant">
        Porzucenie liczone na sesjach (1 - wysłane / rozpoczęte):{" "}
        <strong className="font-medium text-on-surface">{formatPct(funnel.abandonmentRate)}</strong>
        {funnel.failedSessions > 0 && (
          <span> · {funnel.failedSessions} {plural(funnel.failedSessions, "sesja", "sesje", "sesji")} z odrzuceniem po stronie serwera</span>
        )}
      </p>
      <div className="mt-6">
        <FieldFunnelTable fields={funnel.fields} />
      </div>
    </section>
  );
}

// ------------------------------------------------------------- 3. quality signals

function IssueList({ title, items }: { title: string; items: ClickIssue[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-on-surface">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-on-surface-variant">Brak.</p>
      ) : (
        <ul className="mt-3 divide-y divide-outline-variant/40 border-t border-outline-variant/40">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="min-w-0 truncate text-on-surface-variant">
                <span className="text-on-surface">{it.element}</span>
                {it.section !== "(brak sekcji)" && <span className="text-on-surface-variant/70"> w {it.section}</span>}
              </span>
              <CountChip>{it.count}×</CountChip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function JsErrorList({ items }: { items: JsErrorRow[] }) {
  if (items.length === 0) return <EmptyState text="Brak zarejestrowanych błędów JS." />;
  return (
    <ul className="divide-y divide-outline-variant/40 border-t border-outline-variant/40">
      {items.map((e) => (
        <li key={e.message} className="flex items-center justify-between gap-4 py-2 text-sm">
          <span className="min-w-0 break-all text-on-surface-variant">{e.message}</span>
          <CountChip>{e.count}×</CountChip>
        </li>
      ))}
    </ul>
  );
}

function VitalBar({ row }: { row: WebVitalRow }) {
  const pct = (n: number) => (row.total > 0 ? (n / row.total) * 100 : 0);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs text-on-surface-variant">
        <span className="font-medium text-on-surface">{row.metric}</span>
        <span>{row.total} {plural(row.total, "pomiar", "pomiary", "pomiarów")}</span>
      </div>
      <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-full bg-surface-container-low">
        <div className="bg-emerald-500" style={{ width: `${pct(row.good)}%` }} />
        <div className="bg-amber-500" style={{ width: `${pct(row.needsImprovement)}%` }} />
        <div className="bg-red-500" style={{ width: `${pct(row.poor)}%` }} />
      </div>
      <div className="mt-1 flex gap-4 text-[11px] text-on-surface-variant">
        <span>dobre {row.good}</span>
        <span>do poprawy {row.needsImprovement}</span>
        <span>słabe {row.poor}</span>
      </div>
    </div>
  );
}

function QualitySection({ quality }: { quality: QualitySignals }) {
  return (
    <section>
      <SectionHeading title="Sygnały jakości" hint="Konkretne miejsca do naprawy, nie ogólny wynik." />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <IssueList title="Rage clicks" items={quality.rageClicks} />
        <IssueList title="Dead clicks" items={quality.deadClicks} />
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium text-on-surface">Błędy JS</h3>
        <div className="mt-3">
          <JsErrorList items={quality.jsErrors} />
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium text-on-surface">Web Vitals - rozkład ocen</h3>
        {quality.webVitals.length === 0 ? (
          <div className="mt-3">
            <EmptyState text="Brak danych Web Vitals." />
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-5">
            {quality.webVitals.map((v) => (
              <VitalBar key={v.metric} row={v} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- 4. AI crawlers

function AiCrawlersSection({ bots, referredSessions }: { bots: AiCrawlerBot[]; referredSessions: number }) {
  return (
    <section>
      <SectionHeading
        title="Crawlery AI"
        hint={`${referredSessions} ${plural(referredSessions, "sesja ludzka", "sesje ludzkie", "sesji ludzkich")} z odnośnika sklasyfikowanego jako AI w oknie danych sesji (ChatGPT, Perplexity, Claude...). Boty poniżej - z ostatnich 30 dni.`}
      />
      {bots.length === 0 ? (
        <EmptyState text="Brak zarejestrowanych wizyt botów AI w ostatnich 30 dniach." />
      ) : (
        <div className="flex flex-col gap-6">
          {bots.map((b) => (
            <div key={b.bot}>
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-on-surface">{b.bot}</span>
                <span className="text-xs text-on-surface-variant">{b.total} / 30 dni</span>
              </div>
              <ul className="mt-2 flex flex-wrap gap-2">
                {b.paths.slice(0, 10).map((p) => (
                  <li key={p.path} className="rounded-full border border-outline-variant px-3 py-1 text-xs text-on-surface-variant">
                    {p.path} <span className="text-on-surface">×{p.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// -------------------------------------------------------------------- 5. consent

function ConsentStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-outline-variant p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">{label}</p>
      <p className="mt-1.5 font-headline text-2xl font-medium text-on-surface">{value}</p>
    </div>
  );
}

function ConsentSection({ consent }: { consent: ConsentSummary }) {
  return (
    <section>
      <SectionHeading
        title="Zgody"
        hint="Mianownik pod wszystkimi liczbami powyżej: jeśli część odwiedzających odrzuca analitykę, każda z nich jest zaniżona o tyle."
      />
      {consent.totalEvents === 0 ? (
        <EmptyState text="Brak zarejestrowanych zdarzeń consent_update - traktuj powyższe liczby jako dolną granicę ruchu." />
      ) : !consent.hasCategoryData ? (
        <p className="text-sm text-on-surface-variant">
          {consent.totalEvents} {plural(consent.totalEvents, "zdarzenie", "zdarzenia", "zdarzeń")} consent_update, bez rozbicia na kategorie.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ConsentStat label="Analityka - zgoda" value={consent.analyticsGranted} />
          <ConsentStat label="Analityka - odmowa" value={consent.analyticsDenied} />
          <ConsentStat label="Marketing - zgoda" value={consent.marketingGranted} />
          <ConsentStat label="Marketing - odmowa" value={consent.marketingDenied} />
        </div>
      )}
    </section>
  );
}

// ------------------------------------------------------------------------ root

export default function AnalyticsDashboard({ data }: { data: AnalyticsDashboardData }) {
  if (!data.configured) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:px-10">
          <p className="font-headline text-xl font-medium text-on-surface">Magazyn zdarzeń nieskonfigurowany</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-surface-variant">
            Podłącz bazę Upstash Redis w Vercel (Storage → Upstash Redis → Connect to
            Project), aby zdarzenia analityczne zapisywały się i pojawiały tutaj.
          </p>
          <Link href="/crm" className="mt-8 inline-block text-sm text-primary underline underline-offset-4">
            ← wróć do leadów
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
        <header className="mb-14 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">Programo · CRM</p>
            <h1 className="mt-4 font-headline text-5xl font-medium tracking-tight text-on-surface">Analityka</h1>
            <p className="mt-3 text-sm text-on-surface-variant">Podgląd zdarzeń first-party. Czytnik sesji, nie wykresy.</p>
          </div>
          <Link
            href="/crm"
            className="shrink-0 rounded-full border border-outline px-5 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            ← Leady
          </Link>
        </header>

        <div className="flex flex-col gap-16">
          <SessionsSection sessions={data.sessions} batchCount={data.batchCount} />
          <FormFunnelSection funnel={data.funnel} />
          <QualitySection quality={data.quality} />
          <AiCrawlersSection bots={data.aiCrawlers} referredSessions={data.aiReferredSessions} />
          <ConsentSection consent={data.consent} />
        </div>
      </div>
    </div>
  );
}
