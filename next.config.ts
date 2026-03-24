import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trainpilot.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'training-tinder.vercel.app',
      }
    ],
  },
};

export default nextConfig;
