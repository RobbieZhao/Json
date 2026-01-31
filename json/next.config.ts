import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // In this repo the Next.js app lives in `json/`, but Next/webpack may
    // resolve CSS @imports from the workspace/repo root. Ensure local
    // node_modules are always considered first (e.g. @import "tailwindcss";).
    config.resolve = config.resolve ?? {};
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      ...(config.resolve.modules ?? []),
    ];

    return config;
  },
};

export default nextConfig;
