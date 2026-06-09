"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  type Lead,
  type LeadMeta,
  type LeadStatus,
  type LeadPatch,
  type EditableLeadField,
  LEAD_STATUSES,
  DEFAULT_LEAD_STATUS,
} from "@/lib/leads";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATUS_TEXT: Record<LeadStatus, string> = {
  "Nowy": "text-on-surface-variant border-outline-variant",
  "Zadzwoniono": "text-blue-500 border-blue-500/40",
  "Brak kontaktu": "text-amber-500 border-amber-500/40",
  "Wycena wysłana": "text-violet-400 border-violet-400/40",
  "Wygrany": "text-emerald-500 border-emerald-500/50",
  "Przegrany": "text-red-500 border-red-500/40",
};

const STATUS_DOT: Record<LeadStatus, string> = {
  "Nowy": "bg-on-surface-variant",
  "Zadzwoniono": "bg-blue-500",
  "Brak kontaktu": "bg-amber-500",
  "Wycena wysłana": "bg-violet-400",
  "Wygrany": "bg-emerald-500",
  "Przegrany": "bg-red-500",
};

const EDIT_FIELDS: {
  key: EditableLeadField;
  label: string;
  type: "input" | "textarea";
  inputType?: string;
}[] = [
  { key: "name", label: "Imię / nazwa", type: "input" },
  { key: "email", label: "E-mail", type: "input", inputType: "email" },
  { key: "phone", label: "Telefon", type: "input", inputType: "tel" },
  { key: "projectType", label: "Rodzaj projektu", type: "input" },
  { key: "budget", label: "Budżet", type: "input" },
  { key: "subject", label: "Temat", type: "input" },
  { key: "message", label: "Wiadomość", type: "textarea" },
];

const editInputClass =
  "w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2";

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

function StatusControl({ id, initial }: { id: string; initial: LeadStatus }) {
  const [status, setStatus] = useState<LeadStatus>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function change(next: LeadStatus) {
    if (next === status || saving) return;
    const prev = status;
    setStatus(next);
    setSaving(true);
    setError(false);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) {
        setStatus(prev);
        setError(true);
      }
    } catch {
      setStatus(prev);
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="relative inline-flex items-center">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-3.5 h-2 w-2 rounded-full ${STATUS_DOT[status]}`}
        />
        <select
          value={status}
          onChange={(e) => change(e.target.value as LeadStatus)}
          aria-label="Status leada"
          className={`cursor-pointer appearance-none rounded-full border bg-surface py-2 pl-8 pr-9 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${STATUS_TEXT[status]}`}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-surface text-on-surface">
              {s}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-3 text-on-surface-variant"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
      {saving && <span className="text-xs text-on-surface-variant">zapisywanie…</span>}
      {error && <span className="text-xs text-red-500">błąd zapisu</span>}
    </div>
  );
}

function NoteField({ id, initial }: { id: string; initial: string }) {
  const [note, setNote] = useState(initial);
  const savedRef = useRef(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    if (note === savedRef.current) return;
    setState("saving");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, note }),
      });
      if (res.ok) {
        savedRef.current = note;
        setState("saved");
        setTimeout(() => setState((s) => (s === "saved" ? "idle" : s)), 1800);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mt-5">
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor={`note-${id}`}
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant"
        >
          Notatka
        </label>
        <span className="text-xs">
          {state === "saving" && <span className="text-on-surface-variant">zapisywanie…</span>}
          {state === "saved" && <span className="text-emerald-500">zapisano ✓</span>}
          {state === "error" && <span className="text-red-500">błąd — spróbuj ponownie</span>}
        </span>
      </div>
      <textarea
        id={`note-${id}`}
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          if (state !== "idle") setState("idle");
        }}
        onBlur={save}
        rows={2}
        placeholder="Co ustaliliście? Kiedy oddzwonić? Budżet, terminy, kolejny krok…"
        className="w-full resize-y rounded-xl border border-outline-variant bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-colors focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      />
    </div>
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

function LeadEntry({
  lead,
  meta,
  onDelete,
  onSave,
}: {
  lead: Lead;
  meta?: LeadMeta;
  onDelete: (id: string) => Promise<boolean>;
  onSave: (id: string, patch: LeadPatch) => Promise<boolean>;
}) {
  const [showSource, setShowSource] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [form, setForm] = useState<LeadPatch>({});

  const sourcePairs = SOURCE_LABELS.map(
    ([key, label]) => [label, lead[key]] as const
  ).filter(([, v]) => Boolean(v));

  function startEdit() {
    setForm({
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      projectType: lead.projectType || "",
      budget: lead.budget || "",
      subject: lead.subject || "",
      message: lead.message || "",
    });
    setActionError("");
    setConfirmDel(false);
    setEditing(true);
  }

  async function saveEdit() {
    if (!lead.id || busy) return;
    setBusy(true);
    setActionError("");
    const ok = await onSave(lead.id, form);
    setBusy(false);
    if (ok) setEditing(false);
    else setActionError("Nie udało się zapisać. Spróbuj ponownie.");
  }

  async function doDelete() {
    if (!lead.id || busy) return;
    setBusy(true);
    setActionError("");
    const ok = await onDelete(lead.id);
    // On success the parent unmounts this card. On failure we stay and report.
    if (!ok) {
      setBusy(false);
      setConfirmDel(false);
      setActionError("Nie udało się usunąć. Spróbuj ponownie.");
    }
  }

  return (
    <article className="border-t border-outline-variant py-9 first:border-t-0 first:pt-0">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-headline text-2xl font-medium tracking-tight text-on-surface">
          {editing ? "Edycja leada" : lead.name || "Bez imienia"}
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

      {editing ? (
        <div className="flex flex-col gap-3">
          {EDIT_FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col gap-1">
              <label
                htmlFor={`edit-${lead.id}-${f.key}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant"
              >
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={`edit-${lead.id}-${f.key}`}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  rows={3}
                  className={`${editInputClass} resize-y leading-relaxed`}
                />
              ) : (
                <input
                  id={`edit-${lead.id}-${f.key}`}
                  type={f.inputType ?? "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className={editInputClass}
                />
              )}
            </div>
          ))}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={saveEdit}
              disabled={busy}
              className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
            >
              {busy ? "Zapisywanie…" : "Zapisz zmiany"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              className="cursor-pointer text-sm text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-50"
            >
              Anuluj
            </button>
            {actionError && <span className="text-xs text-red-500">{actionError}</span>}
          </div>
        </div>
      ) : (
        <>
          {lead.id && (
            <div className="mb-5">
              <StatusControl id={lead.id} initial={meta?.status ?? DEFAULT_LEAD_STATUS} />
            </div>
          )}

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

          {lead.id && <NoteField id={lead.id} initial={meta?.note ?? ""} />}

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

          {/* Actions */}
          {lead.id && (
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-outline-variant/40 pt-4 text-xs">
              {!confirmDel ? (
                <>
                  <button
                    type="button"
                    onClick={startEdit}
                    className="cursor-pointer font-medium uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary"
                  >
                    Edytuj
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDel(true);
                      setActionError("");
                    }}
                    className="cursor-pointer font-medium uppercase tracking-widest text-on-surface-variant transition-colors hover:text-red-500"
                  >
                    Usuń
                  </button>
                </>
              ) : (
                <span className="flex flex-wrap items-center gap-3">
                  <span className="text-on-surface-variant">Usunąć tego leada na stałe?</span>
                  <button
                    type="button"
                    onClick={doDelete}
                    disabled={busy}
                    className="cursor-pointer font-medium uppercase tracking-widest text-red-500 transition-opacity hover:opacity-80 disabled:opacity-50"
                  >
                    {busy ? "Usuwanie…" : "Tak, usuń"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDel(false)}
                    disabled={busy}
                    className="cursor-pointer text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-50"
                  >
                    Anuluj
                  </button>
                </span>
              )}
              {actionError && <span className="text-red-500">{actionError}</span>}
            </div>
          )}
        </>
      )}
    </article>
  );
}

export default function LeadsDashboard({
  leads,
  meta = {},
  configured = true,
}: {
  leads: Lead[];
  meta?: Record<string, LeadMeta>;
  configured?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Lead[]>(leads);
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

  async function handleDelete(id: string): Promise<boolean> {
    try {
      const res = await fetch("/api/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) return false;
      setItems((cur) => cur.filter((l) => l.id !== id));
      return true;
    } catch {
      return false;
    }
  }

  async function handleSave(id: string, patch: LeadPatch): Promise<boolean> {
    const prev = items;
    setItems((cur) => cur.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) {
        setItems(prev);
        return false;
      }
      return true;
    } catch {
      setItems(prev);
      return false;
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((l) =>
      [l.name, l.email, l.phone, l.message, l.projectType]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [items, query]);

  const countLabel =
    items.length === 1
      ? "zgłoszenie"
      : items.length >= 2 && items.length <= 4
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
                {items.length} {countLabel}
                {query.trim() && filtered.length !== items.length && (
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
          {configured && items.length > 0 && (
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
        ) : items.length === 0 ? (
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
              <LeadEntry
                key={lead.id || lead.ts}
                lead={lead}
                meta={lead.id ? meta[lead.id] : undefined}
                onDelete={handleDelete}
                onSave={handleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
