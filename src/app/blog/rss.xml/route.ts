import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-urls";

export const dynamic = "force-static";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRssDate(isoDate: string): string {
  // Frontmatter dates are YYYY-MM-DD; RSS wants RFC 822. Midday UTC avoids
  // the date shifting a day in either direction across timezones.
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

export function GET(): Response {
  const posts = getAllPosts();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.frontmatter.slug}`;
      return `    <item>
      <title>${escapeXml(p.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRssDate(p.frontmatter.datePublished)}</pubDate>
      <description>${escapeXml(p.frontmatter.answer)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Programo - Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Poradniki i porównania o budowie oprogramowania - Programo</description>
    <language>pl-PL</language>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
