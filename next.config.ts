import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dnwf21zlv/image/**'
      },
    ]
  },
};

export default nextConfig;
