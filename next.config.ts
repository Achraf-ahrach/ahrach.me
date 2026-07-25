import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/YoBarber/admin",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/YoBarber/admin/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
