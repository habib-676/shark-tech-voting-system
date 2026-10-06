import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Type error thaka shotteo production build successfully complete korbe
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/__clerk/:path*",
        destination: "https://shark-tech-coral.vercel.app/__clerk/:path*",
      },
    ];
  },
};

export default nextConfig;
