import { getTranslations, setRequestLocale } from "next-intl/server";
import { IAuthenticationProps } from "@/types/common";
import Home from "@/components/homepage/Home";

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "homepage",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function HomePage() {
  return <Home />;
}
