import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
       {
        protocol: 'https',
        hostname: 'greensortai.up.railway.app',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;
