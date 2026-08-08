import type { PostSource } from "@/lib/blog";

// Rendered sources, matching what buildFaqPage/the answer contract expect:
// every number in the post traces to one of these, with a link and a date.
// A bordered list rather than bg-card (unlike FaqSection) — sources are
// reference material, not a second thing to read, so they get a lighter,
// more clearly "appendix" treatment.
export default function SourcesList({ sources }: { sources: PostSource[] }) {
  return (
    <section className="mb-14 rounded-2xl border border-current/15 p-6">
      <h2 className="mb-4 font-headline text-sm font-semibold uppercase tracking-widest opacity-70">Źródła</h2>
      <ul className="space-y-3 text-sm">
        {sources.map((s) => (
          <li key={s.url} className="flex flex-wrap items-baseline gap-x-2">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-current/30 underline-offset-2 opacity-85 hover:opacity-100"
            >
              {s.label}
            </a>
            <span className="tabular-nums opacity-50">({s.date})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
