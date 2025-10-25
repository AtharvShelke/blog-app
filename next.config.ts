import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'uploadthing.com' },
      { protocol: 'https', hostname: '8y7o400deq.ufs.sh' },
      {
        protocol: 'https',
        hostname: '**.ufs.sh', 
      },
    ],
  },
};

export default nextConfig;
