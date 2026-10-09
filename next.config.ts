import type { NextConfig } from "next";

// Security headers applied to all routes. No Content-Security-Policy on purpose —
// a strict CSP would need a careful allowlist/nonce for the inline gtag/Clarity
// scripts and could silently break analytics; X-Frame-Options already covers the
// clickjacking check. CSP can be layered in later with a proper allowlist.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(process.env.BUILD_STANDALONE === "1" ? { output: "standalone" as const } : {}),
  // Pins the build root to the project being built. This repo is routinely
  // checked out as git worktrees nested under the main repo
  // (.claude/worktrees/<name>/), each with its own package-lock.json. Turbopack
  // sees both lockfiles, infers a monorepo, and silently picks the OUTER
  // directory as root — which then resolves `@/*` and top-level convention
  // files (src/proxy.ts) against a sibling checkout that another session may be
  // editing at that very moment. Pinning it removes the guesswork; on a real
  // deploy there is one lockfile and this is a no-op.
  turbopack: { root: __dirname },
  images: {
    // Static preview snapshots (v3.programo.pl) are plain files on a static
    // host with no image optimizer behind /_next/image.
    unoptimized: process.env.STATIC_PREVIEW === "1",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trainpilot.vercel.app",
      },
      {
        protocol: "https",
        hostname: "training-tinder.vercel.app",
      },
    ],
  },
  // /dema was merged into /projekty on 2026-09-28 — demos now sit below the
  // work grid on the same page. Permanent, so old links and the indexed URL
  // hand their weight over.
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.programo.pl" }], destination: "https://programo.pl/:path*", permanent: true },
      { source: "/dema", destination: "/projekty#dema", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      ...securityHeaders,
      ...(process.env.PROGRAMO_DEPLOYMENT_ENV === "preview"
        ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
        : []),
    ] }];
  },
};

export default nextConfig;
