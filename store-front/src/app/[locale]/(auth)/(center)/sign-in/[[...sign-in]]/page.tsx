import { IAuthenticationProps } from "@/types/common";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "sign-in",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function SignInPage() {
  return <div className="text-3xl font-bold underline">Hello world!</div>;
}
