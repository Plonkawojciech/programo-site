import type { TocEntry } from "@/lib/blog/toc";

function TocList({ entries }: { entries: TocEntry[] }) {
  return (
    <ol className="space-y-2 text-sm">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`} className="opacity-70 transition hover:opacity-100 hover:underline">
            {entry.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Mobile/tablet: a native `<details>` disclosure — collapsible with no client JS. */
export function TocMobile({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <details className="mb-10 rounded-2xl bg-card p-5 shadow-card lg:hidden">
      <summary className="cursor-pointer font-headline text-sm font-semibold uppercase tracking-widest">
        Spis treści
      </summary>
      <div className="mt-4">
        <TocList entries={entries} />
      </div>
    </details>
  );
}

/** Desktop: a real grid column, `position: sticky` inside it — not floated,
 * so the sticky behaviour is reliable across browsers. */
export function TocDesktop({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <aside aria-label="Spis treści" className="hidden lg:block">
      <div className="sticky top-28 rounded-2xl bg-card p-5 shadow-card">
        <p className="mb-4 font-headline text-sm font-semibold uppercase tracking-widest opacity-70">
          Spis treści
        </p>
        <TocList entries={entries} />
      </div>
    </aside>
  );
}
