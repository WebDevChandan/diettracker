import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://images.pexels.com/photos/**')
    ]
  },
};

export default nextConfig;
