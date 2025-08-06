import { getTranslations, setRequestLocale } from "next-intl/server";
import { IAuthenticationProps } from "@/types/common";
import ProfileDetailWrapper from "@/components/profile/ProfileDetailWrapper";

export async function generateMetadata(props: IAuthenticationProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "profile",
  });
  setRequestLocale(locale);
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function ProfilePage() {
  return <ProfileDetailWrapper />;
}
