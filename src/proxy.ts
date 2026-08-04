import { NextResponse, type NextRequest } from "next/server";
import { identifyBot } from "@/lib/analytics/ai-crawlers";
import { recordAiCrawlerHit } from "@/lib/analytics/store";

// Server-side crawler log.
//
// This exists for one question nothing else on the site can answer: do the AI
// answer engines actually fetch our pages, which ones, and what do they read?
// AI crawlers do not run JavaScript, so GA4, Clarity and our own /api/collect
// never see a single one of them.
//
// (In Next.js 16 the file formerly known as `middleware.ts` is `proxy.ts` and
// runs on the Node.js runtime.)
//
// Everything here is on the hot path for real visitors too, so the non-bot case
// is a single regex test and an immediate `next()`. The Redis write is
// fire-and-forget and never awaited by the response.

export function proxy(request: NextRequest) {
  const bot = identifyBot(request.headers.get("user-agent"));

  if (bot) {
    const path = request.nextUrl.pathname;
    console.log(`[ai-crawler] ${bot.vendor}/${bot.name} (${bot.purpose}) → ${path}`);
    // Not awaited on purpose: a crawler must never wait on our bookkeeping, and
    // a Redis hiccup must never turn into a 500 for Googlebot.
    void recordAiCrawlerHit(bot.name, path, new Date().toISOString()).catch(() => {
      /* best-effort */
    });
  }

  return NextResponse.next();
}

export const config = {
  // Pages only. Static assets, images and API routes are excluded — they would
  // multiply invocations without telling us anything about what gets read.
  matcher: [
    "/((?!_next/static|_next/image|api/|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|woff2?)$).*)",
  ],
};
