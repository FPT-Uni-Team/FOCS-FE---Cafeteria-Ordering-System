import ForgotPasswordWrapper from "@/components/forgot-password/ForgotPasswordWrapper";
import { IAuthenticationProps } from "@/types/common";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "forgot-password",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordWrapper />;
}
