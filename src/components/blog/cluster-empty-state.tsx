import Link from "next/link";

// Shown on /blog/klaster/[cluster] for a planned cluster (see
// planned-clusters.ts) that has no posts yet. A bare "brak wpisów" reads
// like a broken page; naming the cluster is publicly planned turns the same
// gap into a promise instead of a dead end.
export default function ClusterEmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-3xl bg-card p-10 text-center shadow-card md:p-16">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Wkrótce</p>
      <h2 className="mb-4 font-headline text-xl font-bold tracking-tight md:text-2xl">
        Pierwszy wpis z klastra &bdquo;{label}&rdquo; jest w przygotowaniu
      </h2>
      <p className="mx-auto mb-8 max-w-md leading-relaxed opacity-75">
        Ten temat jest w kolejce redakcyjnej. Zajrzyj do pozostałych wpisów
        albo napisz do nas bezpośrednio, jeśli chcesz odpowiedzi już teraz.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/blog"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-container"
        >
          Wszystkie wpisy
        </Link>
        <Link
          href="/kontakt"
          className="rounded-full border border-current/30 px-6 py-3 text-sm font-medium opacity-85 transition hover:opacity-100"
        >
          Zapytaj wprost
        </Link>
      </div>
    </div>
  );
}
