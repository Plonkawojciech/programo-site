// The 40-60 word extractive answer from frontmatter, rendered as its own
// visually distinct block right under the H1. This is the block an AI answer
// engine is most likely to lift verbatim — see blog-contract.test.ts for the
// length/self-containment rules it must satisfy.
export default function AnswerBlock({ answer }: { answer: string }) {
  return (
    <p className="mb-10 rounded-2xl bg-card p-6 text-lg leading-relaxed font-medium shadow-card md:text-xl">
      {answer}
    </p>
  );
}
