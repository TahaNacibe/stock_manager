import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: { unoptimized: true },
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    assetPrefix: './',
  } : {}),
};

export default nextConfig;