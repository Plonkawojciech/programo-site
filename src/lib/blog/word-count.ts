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

// 200 words/minute is the usual estimate for adult reading speed and what
// most publications settle on for a "reading time" label - not measured
// against Polish specifically, but close enough that rounding to whole
// minutes absorbs the error either way.
const WORDS_PER_MINUTE = 200;

/** Rounded up so a 30-second post still reads as "1 min", never "0 min". */
export function readingTimeMinutes(words: number): number {
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
