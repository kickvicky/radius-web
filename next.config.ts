import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/di17ten5d/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // TODO: move to env var (NEXT_PUBLIC_API_BASE_URL) for staging/prod
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
