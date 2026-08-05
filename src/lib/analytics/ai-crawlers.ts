// Identification of AI crawlers, so we can answer "does any answer engine
// actually read this site" with data instead of hope.
//
// This has to happen server-side. AI crawlers do not execute JavaScript, so
// every client-side analytics tool on the site — GA4, Clarity, our own
// /api/collect — is structurally blind to them. The only place they are visible
// is the request itself.
//
// Each entry records what the bot is FOR, because the distinction decides
// whether blocking it would cost us citations (see src/app/robots.ts).

export type BotPurpose =
  /** Builds a search index that answers user questions — blocking costs citations. */
  | "answer"
  /** Fetches one page because a user asked about it right now. */
  | "user-fetch"
  /** Collects corpus for model training — blocking does not affect citations. */
  | "training"
  /** Classic search engine crawler. */
  | "search";

export type BotInfo = { name: string; vendor: string; purpose: BotPurpose };

/**
 * Ordered longest/most-specific first: "ChatGPT-User" must match before a
 * looser "GPTBot" style pattern, and "Claude-SearchBot" before "ClaudeBot".
 */
const BOTS: { pattern: RegExp; info: BotInfo }[] = [
  // --- OpenAI
  { pattern: /OAI-SearchBot/i, info: { name: "OAI-SearchBot", vendor: "OpenAI", purpose: "answer" } },
  { pattern: /ChatGPT-User/i, info: { name: "ChatGPT-User", vendor: "OpenAI", purpose: "user-fetch" } },
  { pattern: /OAI-AdsBot/i, info: { name: "OAI-AdsBot", vendor: "OpenAI", purpose: "search" } },
  { pattern: /GPTBot/i, info: { name: "GPTBot", vendor: "OpenAI", purpose: "training" } },
  // --- Anthropic
  { pattern: /Claude-SearchBot/i, info: { name: "Claude-SearchBot", vendor: "Anthropic", purpose: "answer" } },
  { pattern: /Claude-User/i, info: { name: "Claude-User", vendor: "Anthropic", purpose: "user-fetch" } },
  { pattern: /ClaudeBot/i, info: { name: "ClaudeBot", vendor: "Anthropic", purpose: "training" } },
  { pattern: /anthropic-ai/i, info: { name: "anthropic-ai", vendor: "Anthropic", purpose: "training" } },
  // --- Perplexity
  { pattern: /Perplexity-User/i, info: { name: "Perplexity-User", vendor: "Perplexity", purpose: "user-fetch" } },
  { pattern: /PerplexityBot/i, info: { name: "PerplexityBot", vendor: "Perplexity", purpose: "answer" } },
  // --- Google (Googlebot also feeds AI Overviews and AI Mode)
  { pattern: /Google-Extended/i, info: { name: "Google-Extended", vendor: "Google", purpose: "training" } },
  { pattern: /Google-CloudVertexBot/i, info: { name: "Google-CloudVertexBot", vendor: "Google", purpose: "training" } },
  { pattern: /GoogleOther/i, info: { name: "GoogleOther", vendor: "Google", purpose: "search" } },
  { pattern: /Googlebot/i, info: { name: "Googlebot", vendor: "Google", purpose: "search" } },
  // --- Microsoft / Apple
  { pattern: /Applebot-Extended/i, info: { name: "Applebot-Extended", vendor: "Apple", purpose: "training" } },
  { pattern: /Applebot/i, info: { name: "Applebot", vendor: "Apple", purpose: "answer" } },
  { pattern: /BingPreview|bingbot/i, info: { name: "Bingbot", vendor: "Microsoft", purpose: "search" } },
  // --- Meta
  { pattern: /Meta-ExternalFetcher/i, info: { name: "Meta-ExternalFetcher", vendor: "Meta", purpose: "user-fetch" } },
  { pattern: /Meta-ExternalAgent/i, info: { name: "Meta-ExternalAgent", vendor: "Meta", purpose: "training" } },
  { pattern: /facebookexternalhit/i, info: { name: "facebookexternalhit", vendor: "Meta", purpose: "search" } },
  // --- others
  { pattern: /DuckAssistBot/i, info: { name: "DuckAssistBot", vendor: "DuckDuckGo", purpose: "answer" } },
  { pattern: /MistralAI-User/i, info: { name: "MistralAI-User", vendor: "Mistral", purpose: "user-fetch" } },
  { pattern: /Amazonbot/i, info: { name: "Amazonbot", vendor: "Amazon", purpose: "search" } },
  { pattern: /cohere-ai|cohere-training-data-crawler/i, info: { name: "cohere-ai", vendor: "Cohere", purpose: "training" } },
  { pattern: /YouBot/i, info: { name: "YouBot", vendor: "You.com", purpose: "answer" } },
  { pattern: /AI2Bot/i, info: { name: "AI2Bot", vendor: "Allen AI", purpose: "training" } },
  { pattern: /Bytespider/i, info: { name: "Bytespider", vendor: "ByteDance", purpose: "training" } },
  { pattern: /CCBot/i, info: { name: "CCBot", vendor: "Common Crawl", purpose: "training" } },
  { pattern: /Diffbot/i, info: { name: "Diffbot", vendor: "Diffbot", purpose: "training" } },
  { pattern: /Timpibot/i, info: { name: "Timpibot", vendor: "Timpi", purpose: "training" } },
];

/** Returns bot details when the user agent is a known crawler, else null. */
export function identifyBot(userAgent: string | null | undefined): BotInfo | null {
  if (!userAgent) return null;
  for (const { pattern, info } of BOTS) {
    if (pattern.test(userAgent)) return info;
  }
  return null;
}

/** True for crawlers belonging to an AI vendor (excludes plain search engines). */
export function isAiBot(info: BotInfo | null): boolean {
  if (!info) return false;
  return info.purpose === "answer" || info.purpose === "user-fetch" || info.purpose === "training";
}
