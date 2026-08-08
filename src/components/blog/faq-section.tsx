import type { PostFaqEntry } from "@/lib/blog";

// Same questions/answers as /ile-kosztuje-aplikacji's FAQPage, wrapped in a
// bg-card block so the section reads as one distinct unit against the plain
// article body instead of blending into it — the thing the task brief
// called out as "tonące w treści".
export default function FaqSection({ faq }: { faq: PostFaqEntry[] }) {
  return (
    <section className="mb-14 rounded-3xl bg-card p-8 shadow-card md:p-10">
      <h2 className="mb-6 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
        Najczęstsze pytania
      </h2>
      <div className="divide-y divide-current/10">
        {faq.map((f) => (
          <div key={f.q} className="py-5 first:pt-0 last:pb-0">
            <h3 className="mb-2 font-headline text-lg font-bold tracking-tight">{f.q}</h3>
            <p className="max-w-2xl leading-relaxed opacity-75">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
