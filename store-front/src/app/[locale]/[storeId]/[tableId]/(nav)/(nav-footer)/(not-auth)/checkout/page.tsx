import { getTranslations, setRequestLocale } from "next-intl/server";
import { IAuthenticationProps } from "@/types/common";
import CheckoutWrapper from "@/components/checkout/CheckoutWrapper";

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "checkout",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function CheckoutPage() {
  return <CheckoutWrapper />;
}
