import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Type error thaka shotteo production build successfully complete korbe
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
