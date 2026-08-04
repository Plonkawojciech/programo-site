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
  // Pins the build root to this directory. Without it, Turbopack walks up
  // looking for lockfiles and — when this project is checked out as a git
  // worktree nested under the main repo (.claude/worktrees/<name>/), which
  // also has its own package-lock.json — picks the OUTER repo directory as
  // root instead. That silently resolves `@/*` imports against the main
  // checkout's src/ instead of this worktree's, breaking build isolation
  // between concurrent worktree sessions. See the "multiple lockfiles"
  // Turbopack warning this suppresses.
  turbopack: { root: __dirname },
  poweredByHeader: false,
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
