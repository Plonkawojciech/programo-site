import { ImageResponse } from "next/og";

// Site-wide default Open Graph / social-share image (1200x630).
// File-convention route: Next.js auto-wires og:image (and Twitter falls back to it).
// Text kept ASCII-only so it renders without shipping a custom font.

export const alt = "Programo — Software House z Poznania";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "84px",
          background:
            "linear-gradient(135deg, #051F20 0%, #082F2B 55%, #0C463C 100%)",
          color: "#DAF1DE",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8EB69B",
          }}
        >
          <span>Software House</span>
          <span>Poznan / PL</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 156, fontWeight: 700, lineHeight: 1, letterSpacing: -5 }}>
            Programo
          </div>
          <div style={{ fontSize: 50, fontWeight: 600, marginTop: 26, color: "#FFFFFF" }}>
            Strony, aplikacje i systemy.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#8EB69B",
          }}
        >
          <span>Next.js / React / AI / SaaS</span>
          <span style={{ color: "#DAF1DE", fontWeight: 600 }}>programo.pl</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
