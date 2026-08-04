import { NextResponse, after, type NextRequest } from "next/server";
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
    // after() rather than a bare floating promise: the crawler still never waits
    // on our bookkeeping, but the platform is told to keep the invocation alive
    // until the write finishes. A detached promise gets frozen with the instance
    // the moment the response is returned, which silently dropped an
    // unpredictable share of hits — in a log whose entire purpose is counting.
    after(async () => {
      try {
        await recordAiCrawlerHit(bot.name, path, new Date().toISOString());
      } catch {
        /* best-effort — never surface to the crawler */
      }
    });
  }

  return NextResponse.next();
}

export const config = {
  // Pages, plus the machine-readable files that exist specifically FOR these
  // crawlers. Excluding *.txt/*.xml (the first version of this matcher) meant
  // fetches of /llms.txt, /robots.txt and /sitemap.xml were never counted —
  // exactly the requests that answer "is any answer engine reading us".
  // Images, fonts and build assets stay out: they multiply invocations without
  // saying anything about what was read.
  matcher: [
    "/((?!_next/static|_next/image|api/|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
