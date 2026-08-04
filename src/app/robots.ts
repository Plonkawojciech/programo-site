import type { MetadataRoute } from "next";

// Crawler policy.
//
// Stance: programo.pl WANTS to be read and cited by AI assistants — that is a
// discovery channel, not a threat. So every answering engine is allowed
// everywhere except the internal panel.
//
// The one distinction worth knowing, because it is the opposite of what most
// "block the AI bots" advice assumes: for OpenAI, Anthropic and Apple the
// TRAINING crawler and the ANSWERING crawler are different user agents.
//   GPTBot            trains models  ≠  OAI-SearchBot     powers ChatGPT search
//   ClaudeBot         trains models  ≠  Claude-SearchBot  powers Claude search
//   Applebot-Extended opts out of training ≠ Applebot      powers Siri/Spotlight
// Blocking GPTBot therefore does NOT remove the site from ChatGPT's answers,
// and blocking Google-Extended does NOT remove it from AI Overviews (those run
// off the regular Search index and are governed by Googlebot + nosnippet).
// If we ever want out of model training while staying citable, the change is to
// disallow GPTBot / ClaudeBot / Google-Extended / Applebot-Extended / CCBot and
// leave everything below untouched.

/** Answering engines and search indexes we explicitly welcome. */
const ANSWER_ENGINES = [
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // ChatGPT fetching a page a user asked about
  "Claude-SearchBot", // Claude search index
  "Claude-User", // Claude fetching on a user's behalf
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity fetching on a user's behalf
  "Googlebot", // Google Search + AI Overviews + AI Mode
  "Bingbot", // Bing + Copilot
  "Applebot", // Siri, Spotlight, Safari
  "DuckAssistBot",
  "Amazonbot",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
];

/** Paths no crawler should index. */
const PRIVATE_PATHS = ["/crm", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // The catch-all group. `/crm` is a token-gated internal lead panel and has
      // no business in any index — it was previously reachable by every crawler
      // because this file only ever said `allow: "/"`.
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // Redundant against the group above, deliberately: it states the policy
      // explicitly, and it survives any future narrowing of the catch-all rule.
      ...ANSWER_ENGINES.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: "https://programo.pl/sitemap.xml",
    host: "https://programo.pl",
  };
}
