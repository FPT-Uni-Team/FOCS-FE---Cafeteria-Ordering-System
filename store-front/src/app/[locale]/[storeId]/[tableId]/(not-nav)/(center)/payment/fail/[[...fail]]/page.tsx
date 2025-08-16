import PaymentFail from "@/components/failed/PaymentFail";
import { IAuthenticationProps } from "@/types/common";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface PaymentFailPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderCode?: string; statusString?: string }>;
}

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "payment",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title_fail"),
    description: t("meta_description_fail"),
  };
}

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const { orderCode = "", statusString = "" } = await searchParams;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL_SEVER || "http://localhost:3000";

  if (orderCode && statusString) {
    await fetch(`${baseUrl}/api/payment/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderCode, statusString }),
    });
  }

  return <PaymentFail />;
}
