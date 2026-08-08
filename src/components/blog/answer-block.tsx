// The 40-60 word extractive answer from frontmatter, rendered as its own
// visually distinct block right under the H1. This is the block an AI answer
// engine is most likely to lift verbatim — see blog-contract.test.ts for the
// length/self-containment rules it must satisfy. It has to visually read as
// the single most important thing on the page: a labelled eyebrow plus a
// left accent bar in the brand primary, on top of the bg-card treatment
// every other block on the post also uses.
export default function AnswerBlock({ answer }: { answer: string }) {
  return (
    <div className="mb-10 rounded-2xl border-l-4 border-primary bg-card p-6 shadow-card md:p-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">W skrócie</p>
      <p className="text-lg leading-relaxed font-medium md:text-xl">{answer}</p>
    </div>
  );
}
