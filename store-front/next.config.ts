import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

const withNextIntl = createNextIntlPlugin("./src/libs/i18n/request.ts");
export default withNextIntl(nextConfig);
