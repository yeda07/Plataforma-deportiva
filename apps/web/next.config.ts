import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: [
    "@competencias-platform/ui",
    "@competencias-platform/contracts",
    "@competencias-platform/validation",
    "@competencias-platform/config"
  ]
};

export default nextConfig;
