import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultParams, IAuthenticationProps } from "@/types/common";
import Home from "@/components/homepage/Home";
import categoryService from "@/services/categoryService";

interface HomePageProps {
  params: Promise<{
    storeId: string;
    tableId: string;
  }>;
}

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

export default async function HomePage({ params }: HomePageProps) {
  const { storeId, tableId } = await params;
  const resCate = await categoryService.getListCategories(
    defaultParams(1000, 1),
    {
      storeId,
      tableId,
    }
  );

  return <Home categories={resCate.data.items} />;
}
