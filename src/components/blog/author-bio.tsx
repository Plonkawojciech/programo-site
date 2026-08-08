// Byline data comes straight from AUTHOR_SLUGS (src/lib/schema/people.ts) —
// the same registry that backs the BlogPosting.author schema node, so this
// box and the JSON-LD can never name a different person for the same post.
export default function AuthorBio({ name, jobTitle }: { name: string; jobTitle: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <section className="mb-14 flex items-center gap-4 rounded-2xl bg-card p-6 shadow-card">
      <div
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 font-headline text-lg font-bold text-primary"
      >
        {initials}
      </div>
      <div>
        <p className="font-headline text-base font-bold tracking-tight">{name}</p>
        <p className="text-sm opacity-70">{jobTitle}, Programo</p>
      </div>
    </section>
  );
}
