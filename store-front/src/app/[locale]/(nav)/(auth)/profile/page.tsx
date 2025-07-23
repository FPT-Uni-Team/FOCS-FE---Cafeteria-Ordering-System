import { getTranslations, setRequestLocale } from "next-intl/server";
import Profile from "@/components/profile/Profile";
import { IAuthenticationProps } from "@/types/common";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth/authOptions";
import userService from "@/services/userService";

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
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const res = await userService.detail(token);
  const user = {
    fullName: `${res.data.first_name} ${res.data.last_name}`,
    email: res.data.email,
    avatar: res.data.avatar || "/img/profile/default-avatar.jpg",
  };

  return <Profile user={user} />;
}
