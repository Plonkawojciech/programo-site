import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

// Per-post social-share image, built from the post's own cover instead of
// the site-wide gradient at src/app/opengraph-image.tsx — a post shared to
// Slack/X/LinkedIn should show what it's about, not a generic wordmark card.
// Needs the Node.js runtime (default for this file convention) because it
// reads the cover straight off disk rather than fetching it over HTTP —
// fetching `https://programo.pl/...` at build time would depend on the very
// deploy this file is part of.

export const alt = "Programo Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const cover = post?.frontmatter.cover ?? "/blog/covers/default.webp";
  const title = post?.frontmatter.title ?? "Blog Programo";

  const coverPath = path.join(process.cwd(), "public", cover);
  const coverData = fs.readFileSync(coverPath);
  const coverSrc = `data:image/webp;base64,${coverData.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        {/* next/og renders its own <img> internally — next/image doesn't work
            inside an ImageResponse tree. Decorative: the title text below
            carries the meaning, this is the same as any other OG image
            background. */}
        <img
          src={coverSrc}
          alt=""
          width={size.width}
          height={size.height}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg, rgba(5,31,32,0.92) 0%, rgba(5,31,32,0.35) 55%, rgba(5,31,32,0.05) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "72px",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#8EB69B" }}>
            Blog Programo
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFFFFF",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
