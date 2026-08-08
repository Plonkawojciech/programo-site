import type { PostSource } from "@/lib/blog";

// Rendered sources, matching what buildFaqPage/the answer contract expect:
// every number in the post traces to one of these, with a link and a date.
export default function SourcesList({ sources }: { sources: PostSource[] }) {
  return (
    <section className="mb-14">
      <h2 className="mb-4 font-headline text-lg font-bold tracking-tight">Źródła</h2>
      <ul className="space-y-2 text-sm opacity-75">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100">
              {s.label}
            </a>
            <span className="ml-2 tabular-nums opacity-70">({s.date})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
