import type { NextConfig } from "next";

const allowedDevOrigins = ["localhost", "127.0.0.1", "192.168.11.84", "admin.localhost"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins,
};

export default nextConfig;
