import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  images: {
    remotePatterns: [
      new URL('https://images.pexels.com/photos/**'),
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**'
      },
    ]
  },
};

export default nextConfig;
