import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xafmqt8zvr75ylkm.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
