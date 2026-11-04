import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  ...(process.env.NODE_ENV === "development" ? {
    async rewrites() {
      return {
        beforeFiles: [{ source: "/inquiry.php", destination: `${process.env.WISGSHL_PHP_ORIGIN ?? "http://127.0.0.1:8767"}/inquiry.php` }],
        afterFiles: [], fallback: [],
      };
    },
  } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
