import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["source.unsplash.com"],
  },
  eslint: {
    // ESLintの設定
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
