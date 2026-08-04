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
  // This repo is built from git worktrees (each with its own package-lock.json)
  // alongside the main checkout. Turbopack sees both lockfiles, infers a
  // monorepo, and silently picks the WRONG one as its root — which then
  // resolves top-level convention files (e.g. src/proxy.ts) against a sibling
  // checkout instead of this one. Pinning root to cwd (the project actually
  // being built) removes the guesswork.
  turbopack: {
    root: process.cwd(),
  },
  images: {
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
