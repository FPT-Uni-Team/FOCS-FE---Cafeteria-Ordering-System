import { getTranslations, setRequestLocale } from "next-intl/server";
import { IAuthenticationProps } from "@/types/common";
import OrderHistoryWrapper from "@/components/order/OrderHistoryWrapper";

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "order-detail",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function OrderHistoryPage() {
  return <OrderHistoryWrapper />;
}
