import SignInWrapper from "@/components/sign-in/SignInWrapper";
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

export default function SignInPage() {
  return <SignInWrapper />;
}
