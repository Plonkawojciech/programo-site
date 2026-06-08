"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Lead } from "@/lib/leads";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatAbsolute(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || "—";
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return "przed chwilą";
  if (min < 60) return min === 1 ? "minutę temu" : `${min} min temu`;
  if (hr < 24) return hr === 1 ? "godzinę temu" : `${hr} godz. temu`;
  if (day === 1) return "wczoraj";
  if (day < 7) return `${day} dni temu`;
  const week = Math.round(day / 7);
  if (day < 30) return week === 1 ? "tydzień temu" : `${week} tyg. temu`;
  const month = Math.round(day / 30);
  if (day < 365) return month === 1 ? "miesiąc temu" : `${month} mies. temu`;
  const year = Math.round(day / 365);
  return year === 1 ? "rok temu" : `${year} lat temu`;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Kopiuj ${label}`}
      title={copied ? "Skopiowano" : "Kopiuj"}
      className="cursor-pointer text-on-surface-variant transition-colors hover:text-primary"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

const SOURCE_LABELS: [keyof Lead, string][] = [
  ["utm_campaign", "Kampania"],
  ["utm_term", "Słowo kluczowe"],
  ["utm_source", "Źródło"],
  ["utm_medium", "Medium"],
  ["utm_content", "Treść reklamy"],
  ["gclid", "gclid"],
  ["gbraid", "gbraid"],
  ["wbraid", "wbraid"],
  ["landing_page", "Strona wejścia"],
  ["referrer", "Referrer"],
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-outline-variant px-3 py-1 text-xs text-on-surface-variant">
      {children}
    </span>
  );
}

function LeadEntry({ lead }: { lead: Lead }) {
  const [showSource, setShowSource] = useState(false);
  const sourcePairs = SOURCE_LABELS.map(
    ([key, label]) => [label, lead[key]] as const
  ).filter(([, v]) => Boolean(v));

  return (
    <article className="border-t border-outline-variant py-9 first:border-t-0 first:pt-0">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-headline text-2xl font-medium tracking-tight text-on-surface">
          {lead.name || "Bez imienia"}
        </h2>
        <time
          dateTime={lead.ts}
          title={formatAbsolute(lead.ts)}
          className="shrink-0 text-xs text-on-surface-variant"
        >
          {formatAbsolute(lead.ts)}
          <span className="ml-2 text-on-surface-variant/60">
            · {formatRelative(lead.ts)}
          </span>
        </time>
      </header>

      {(lead.email || lead.phone) && (
        <div className="mb-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          {lead.email && (
            <span className="inline-flex items-center gap-2">
              <a
                href={`mailto:${lead.email}`}
                className="text-on-surface underline decoration-outline-variant underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                {lead.email}
              </a>
              <CopyButton value={lead.email} label="e-mail" />
            </span>
          )}
          {lead.phone && (
            <span className="inline-flex items-center gap-2">
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="text-on-surface underline decoration-outline-variant underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                {lead.phone}
              </a>
              <CopyButton value={lead.phone} label="telefon" />
            </span>
          )}
        </div>
      )}

      {(lead.subject || lead.projectType || lead.budget) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {lead.subject && <Chip>{lead.subject}</Chip>}
          {lead.projectType && <Chip>{lead.projectType}</Chip>}
          {lead.budget && <Chip>Budżet: {lead.budget}</Chip>}
        </div>
      )}

      {lead.message && (
        <p className="max-w-2xl whitespace-pre-wrap text-[15px] leading-relaxed text-on-surface-variant">
          {lead.message}
        </p>
      )}

      {sourcePairs.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowSource((v) => !v)}
            aria-expanded={showSource}
            className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant transition-colors hover:text-primary"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`transition-transform duration-300 ${showSource ? "rotate-90" : ""}`}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            Źródło leada
            <span className="font-normal normal-case tracking-normal text-on-surface-variant/60">
              {sourcePairs.length}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {showSource && (
              <motion.dl
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1.5 overflow-hidden text-xs sm:grid-cols-2"
              >
                {sourcePairs.map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <dt className="shrink-0 text-on-surface-variant">{label}:</dt>
                    <dd className="break-all text-on-surface">{value}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </AnimatePresence>
        </div>
      )}
    </article>
  );
}

export default function LeadsDashboard({
  leads,
  configured = true,
}: {
  leads: Lead[];
  configured?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/crm-logout", { method: "POST" });
    } catch {
      /* refresh regardless */
    }
    router.refresh();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.phone, l.message, l.projectType]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [leads, query]);

  const countLabel =
    leads.length === 1
      ? "zgłoszenie"
      : leads.length >= 2 && leads.length <= 4
        ? "zgłoszenia"
        : "zgłoszeń";

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
        {/* Masthead */}
        <header className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">
                Programo · CRM
              </p>
              <h1 className="mt-4 font-headline text-5xl font-medium tracking-tight text-on-surface">
                Leady
              </h1>
              <p className="mt-3 text-sm text-on-surface-variant">
                {leads.length} {countLabel}
                {query.trim() && filtered.length !== leads.length && (
                  <span className="text-on-surface-variant/60">
                    {" "}
                    · {filtered.length} pasujących
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="shrink-0 cursor-pointer rounded-full border border-outline px-5 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-50"
            >
              {loggingOut ? "Wylogowywanie…" : "Wyloguj"}
            </button>
          </div>

          {/* Search */}
          {configured && leads.length > 0 && (
            <div className="relative mt-10 border-b border-outline-variant focus-within:border-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Szukaj po imieniu, e-mailu, telefonie, wiadomości…"
                aria-label="Szukaj leadów"
                className="w-full bg-transparent py-3 pl-7 text-base text-on-surface placeholder:text-on-surface-variant/40 outline-none"
              />
            </div>
          )}
        </header>

        {/* List */}
        {!configured ? (
          <div className="border-t border-outline-variant py-16 text-center">
            <p className="font-headline text-xl font-medium text-on-surface">
              Magazyn leadów nieskonfigurowany
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-surface-variant">
              Podłącz bazę Upstash Redis w Vercel (Storage → Upstash Redis →
              Connect to Project), aby zgłoszenia z formularza zapisywały się i
              pojawiały tutaj.
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div className="border-t border-outline-variant py-16 text-center">
            <p className="font-headline text-xl font-medium text-on-surface">
              Brak leadów
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-surface-variant">
              Nowe zgłoszenia z formularza kontaktowego pojawią się tutaj
              automatycznie.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-t border-outline-variant py-16 text-center">
            <p className="text-sm text-on-surface-variant">
              Brak wyników dla „{query.trim()}”.
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((lead) => (
              <LeadEntry key={lead.id || lead.ts} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
