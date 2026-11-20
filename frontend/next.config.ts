import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Turbopack rooted at the Next app (avoids parent-folder lockfile noise)
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
