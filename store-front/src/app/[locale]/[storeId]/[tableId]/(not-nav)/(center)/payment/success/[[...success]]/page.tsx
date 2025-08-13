import PaymentSuccess from "@/components/success/PaymentSuccess";
import { IAuthenticationProps } from "@/types/common";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface PaymentSuccessPageProps {
  params: { locale: string };
  searchParams: { orderCode?: string; statusString?: string };
}

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "payment",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function PaymentSuccessPage({
  searchParams: { orderCode = "", statusString = "" },
}: PaymentSuccessPageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (orderCode && statusString) {
    await fetch(`${baseUrl}/api/payment/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderCode, statusString }),
    });
  }

  return <PaymentSuccess orderCode={orderCode} />;
}
