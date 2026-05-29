"use client";

import { useState } from "react";

type Finding = { ok: boolean; text: string };
type Category = {
  key: string;
  label: string;
  icon: string;
  score: number;
  findings: Finding[];
};
type AuditResult = {
  url: string;
  overall: number;
  engine: string;
  categories: Category[];
};

const BOOKINGS_URL =
  process.env.NEXT_PUBLIC_BOOKINGS_URL || "mailto:biuro@programo.pl";

function scoreColor(score: number): string {
  if (score >= 80) return "#5FA37C"; // green
  if (score >= 50) return "#D6A33A"; // amber
  return "#D2604A"; // red
}

function ScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div
      className="relative flex h-32 w-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${score * 3.6}deg, rgba(var(--theme-text-2-rgb),0.18) 0deg)`,
      }}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--theme-bg-1)]">
        <span className="font-headline text-4xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-widest opacity-60">/ 100</span>
      </div>
    </div>
  );
}

function Bar({ score }: { score: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(var(--theme-text-2-rgb),0.18)]">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: scoreColor(score) }}
      />
    </div>
  );
}

export default function AuditClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);

  // lead form
  const [showLead, setShowLead] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadDone, setLeadDone] = useState(false);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setLeadDone(false);
    setShowLead(false);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Coś poszło nie tak. Spróbuj ponownie.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setLeadError("Zaznacz zgodę na kontakt.");
      return;
    }
    setLeadLoading(true);
    setLeadError("");
    try {
      const res = await fetch("/api/audit/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: leadEmail,
          url: result?.url || url,
          name: leadName,
          phone: leadPhone,
          overall: result?.overall,
          consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLeadError(data.error || "Nie udało się wysłać. Spróbuj ponownie.");
      } else {
        setLeadDone(true);
      }
    } catch {
      setLeadError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setLeadLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* URL input */}
      <form onSubmit={runAudit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="np. twojafirma.pl"
          aria-label="Adres strony do audytu"
          className="flex-1 rounded-full border border-current/20 bg-[rgba(var(--theme-text-1-rgb),0.04)] px-6 py-4 text-base outline-none transition focus:border-current/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--theme-accent)] px-8 py-4 text-base font-semibold text-[var(--theme-bg-1)] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Analizuję…" : "Sprawdź stronę"}
        </button>
      </form>

      {loading && (
        <p className="mt-4 text-sm opacity-70">
          Analizuję stronę — to potrwa do ~30 sekund. Sprawdzam wydajność, mobilność,
          SEO, bezpieczeństwo i obecność.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-[#D2604A]/40 bg-[#D2604A]/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <div className="mt-10">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-current/15 p-8 sm:flex-row sm:items-center sm:gap-10">
            <ScoreRing score={result.overall} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] opacity-60">
                Wynik ogólny
              </p>
              <h3 className="mt-1 font-headline text-2xl font-bold sm:text-3xl">
                {result.overall >= 80
                  ? "Solidnie — ale jest co poprawić"
                  : result.overall >= 50
                  ? "Przeciętnie — tracisz klientów"
                  : "Słabo — to kosztuje Cię klientów"}
              </h3>
              <p className="mt-2 text-sm opacity-70 break-all">{result.url}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {result.categories.map((c) => (
              <div
                key={c.key}
                className="rounded-2xl border border-current/15 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold">
                    {c.icon} {c.label}
                  </span>
                  <span
                    className="font-headline text-lg font-bold"
                    style={{ color: scoreColor(c.score) }}
                  >
                    {c.score}
                  </span>
                </div>
                <Bar score={c.score} />
                <ul className="mt-4 space-y-1.5">
                  {c.findings.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm opacity-80">
                      <span aria-hidden>{f.ok ? "✅" : "⚠️"}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Lead gate / CTA */}
          {!leadDone ? (
            <div className="mt-8 rounded-3xl border border-current/20 bg-[rgba(var(--theme-accent-rgb),0.07)] p-8">
              <h3 className="font-headline text-2xl font-bold">
                Chcesz pełny raport + plan naprawy?
              </h3>
              <p className="mt-2 max-w-2xl opacity-80">
                Przygotujemy szczegółowy raport z konkretnymi krokami, ile to kosztuje
                i co da największy efekt. Za darmo — zostaw kontakt, odezwiemy się.
              </p>

              {!showLead ? (
                <button
                  onClick={() => setShowLead(true)}
                  className="mt-5 rounded-full bg-[var(--theme-accent)] px-7 py-3 text-sm font-semibold text-[var(--theme-bg-1)] transition hover:opacity-90"
                >
                  Odbierz pełny raport
                </button>
              ) : (
                <form onSubmit={submitLead} className="mt-6 grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Imię"
                    className="rounded-xl border border-current/20 bg-[rgba(var(--theme-text-1-rgb),0.04)] px-4 py-3 text-sm outline-none focus:border-current/50"
                  />
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="Telefon (opcjonalnie)"
                    className="rounded-xl border border-current/20 bg-[rgba(var(--theme-text-1-rgb),0.04)] px-4 py-3 text-sm outline-none focus:border-current/50"
                  />
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="Email *"
                    className="rounded-xl border border-current/20 bg-[rgba(var(--theme-text-1-rgb),0.04)] px-4 py-3 text-sm outline-none focus:border-current/50 sm:col-span-2"
                  />
                  <label className="flex items-start gap-2 text-xs opacity-75 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      Wyrażam zgodę na kontakt handlowy ze strony Programo s.c. w
                      sprawie audytu (email/telefon) zgodnie z polityką prywatności.
                    </span>
                  </label>
                  {leadError && (
                    <p className="text-sm text-[#D2604A] sm:col-span-2">{leadError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="rounded-full bg-[var(--theme-accent)] px-7 py-3 text-sm font-semibold text-[var(--theme-bg-1)] transition hover:opacity-90 disabled:opacity-60 sm:col-span-2"
                  >
                    {leadLoading ? "Wysyłam…" : "Wyślij — chcę pełny raport"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-[#5FA37C]/40 bg-[#5FA37C]/10 p-8 text-center">
              <h3 className="font-headline text-2xl font-bold">Dzięki! Mamy Twój kontakt 🎉</h3>
              <p className="mt-2 opacity-80">
                Przygotujemy pełny raport i odezwiemy się wkrótce. Chcesz szybciej?
              </p>
              <a
                href={BOOKINGS_URL}
                className="mt-5 inline-block rounded-full bg-[var(--theme-accent)] px-7 py-3 text-sm font-semibold text-[var(--theme-bg-1)] transition hover:opacity-90"
              >
                Umów rozmowę
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
