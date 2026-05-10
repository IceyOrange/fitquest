import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: "/Dabble",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
