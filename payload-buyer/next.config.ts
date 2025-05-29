import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const baseConfig: NextConfig = {
  eslint: {
    dirs: ["."],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["@electric-sql/pglite"],
};
let configWithPlugins = createNextIntlPlugin("./src/libs/i18n.ts")(baseConfig);

const nextConfig = configWithPlugins;
export default nextConfig;
