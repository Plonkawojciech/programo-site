/** Whitespace-delimited word count — good enough for Polish prose, no locale library needed. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Word count of the whole post: answer block + FAQ + MDX body, for BlogPosting.wordCount. */
export function postWordCount(parts: { answer: string; body: string; faq: { q: string; a: string }[] }): number {
  const faqWords = parts.faq.reduce((sum, f) => sum + countWords(f.q) + countWords(f.a), 0);
  return countWords(parts.answer) + countWords(parts.body) + faqWords;
}
