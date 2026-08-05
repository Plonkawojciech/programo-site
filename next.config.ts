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
