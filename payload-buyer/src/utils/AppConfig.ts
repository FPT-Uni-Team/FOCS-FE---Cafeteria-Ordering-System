import type { LocalePrefixMode } from "next-intl/routing";

const localePrefix: LocalePrefixMode = "as-needed";

export const AppConfig = {
  name: "Nextjs Starter",
  locales: ["en", "vn"],
  defaultLocale: "vn",
  localePrefix,
};
