import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/YoBarber",
        destination: "https://yobarber.app",
        permanent: true,
      },
      {
        source: "/YoBarber/:path*",
        destination: "https://yobarber.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
