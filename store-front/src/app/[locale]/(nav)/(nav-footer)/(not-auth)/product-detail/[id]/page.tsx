import { getTranslations, setRequestLocale } from "next-intl/server";
import { IAuthenticationProps } from "@/types/common";
import ProductDetailWrapper from "@/components/product-detail/ProductDetailWrapper";

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "product-detail",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function ProductPage() {
  return <ProductDetailWrapper />;
}
