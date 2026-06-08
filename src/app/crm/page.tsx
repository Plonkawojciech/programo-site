import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CRM_COOKIE, verifyToken } from "@/lib/crm-auth";
import { getLeads, isLeadStoreConfigured, type Lead } from "@/lib/leads";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
  title: "CRM — Programo",
  robots: { index: false, follow: false },
};

// Always render fresh (reads cookie + live leads).
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || "—";
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function LeadCard({ lead }: { lead: Lead }) {
  const sourcePairs: [string, string][] = (
    [
      ["Kampania", lead.utm_campaign],
      ["Słowo kluczowe", lead.utm_term],
      ["Źródło", lead.utm_source],
      ["Medium", lead.utm_medium],
      ["Treść reklamy", lead.utm_content],
      ["gclid", lead.gclid],
      ["gbraid", lead.gbraid],
      ["wbraid", lead.wbraid],
      ["Strona wejścia", lead.landing_page],
      ["Referrer", lead.referrer],
    ] as [string, string][]
  ).filter(([, v]) => Boolean(v));

  return (
    <article className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-headline text-lg font-semibold tracking-tight">
          {lead.name || "Bez imienia"}
        </h2>
        <time className="text-xs uppercase tracking-widest text-on-surface-variant">
          {formatDate(lead.ts)}
        </time>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="text-primary underline underline-offset-4 transition hover:text-on-surface"
          >
            {lead.email}
          </a>
        )}
        {lead.phone && (
          <a
            href={`tel:${lead.phone.replace(/\s/g, "")}`}
            className="text-primary underline underline-offset-4 transition hover:text-on-surface"
          >
            {lead.phone}
          </a>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        {lead.subject && (
          <span className="rounded-full border border-outline-variant px-3 py-1 text-on-surface-variant">
            {lead.subject}
          </span>
        )}
        {lead.projectType && (
          <span className="rounded-full border border-outline-variant px-3 py-1 text-on-surface-variant">
            {lead.projectType}
          </span>
        )}
        {lead.budget && (
          <span className="rounded-full border border-outline-variant px-3 py-1 text-on-surface-variant">
            Budżet: {lead.budget}
          </span>
        )}
      </div>

      {lead.message && (
        <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-on-surface-variant">
          {lead.message}
        </p>
      )}

      {sourcePairs.length > 0 && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-surface p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Źródło leada
          </p>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
            {sourcePairs.map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="shrink-0 text-on-surface-variant">{k}:</dt>
                <dd className="break-all text-on-surface">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}

export default async function CrmPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CRM_COOKIE)?.value;

  if (!verifyToken(token)) {
    return <LoginForm />;
  }

  const configured = isLeadStoreConfigured();
  const leads = configured ? await getLeads() : [];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-20 md:px-10 md:pt-32">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.4em] text-primary">
              Programo · CRM
            </p>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Leady
              <span className="ml-3 align-middle text-base font-normal text-on-surface-variant">
                {leads.length}
              </span>
            </h1>
          </div>
          <LogoutButton />
        </header>

        {!configured ? (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 text-sm leading-relaxed text-on-surface-variant">
            <p className="mb-2 font-semibold text-on-surface">
              Magazyn leadów nieskonfigurowany.
            </p>
            <p>
              Ustaw w Vercel zmienne środowiskowe pary Upstash Redis
              (<code>UPSTASH_REDIS_REST_URL</code> +{" "}
              <code>UPSTASH_REDIS_REST_TOKEN</code>) lub Vercel KV
              (<code>KV_REST_API_URL</code> + <code>KV_REST_API_TOKEN</code>).
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 text-sm text-on-surface-variant">
            Brak leadów. Nowe zgłoszenia z formularza kontaktowego pojawią się
            tutaj automatycznie.
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <LeadCard key={lead.id || lead.ts} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
