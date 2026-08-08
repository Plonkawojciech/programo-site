import type { PostFaqEntry } from "@/lib/blog";

// Same layout as the FAQ block on /ile-kosztuje-aplikacji — kept identical on
// purpose so a reader (or a crawler) sees one FAQ convention across the site.
export default function FaqSection({ faq }: { faq: PostFaqEntry[] }) {
  return (
    <section className="mb-14">
      <h2 className="mb-6 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
        Najczęstsze pytania
      </h2>
      <div className="space-y-6">
        {faq.map((f) => (
          <div key={f.q}>
            <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">{f.q}</h3>
            <p className="max-w-2xl leading-relaxed opacity-75">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
