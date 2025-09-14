import type { LocalePrefixMode } from "next-intl/routing";

const localePrefix: LocalePrefixMode = "always";

export const AppConfig = {
  name: "Nextjs Starter",
  locales: ["en", "vi"],
  defaultLocale: "vi",
  localePrefix,
};
