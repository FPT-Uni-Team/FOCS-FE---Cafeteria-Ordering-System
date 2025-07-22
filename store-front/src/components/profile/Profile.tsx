import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileItem from "./ProfileItem";
import { useTranslations } from "next-intl";
import { CiHeart, CiLocationOn, CiLogout } from "react-icons/ci";
import { GrLanguage } from "react-icons/gr";

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations("profile");

  return (
    <div className="bg-white px-4 py-6 border rounded-lg shadow-lg">
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <Image
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover size-20"
            />
          </div>
          <div className="w-2/3">
            <h2 className="text-lg font-semibold text-black">Sabrina Aryan</h2>
            <p className="text-sm text-gray-600">SabrinaAry208@gmailcom</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/3"></div>
          <div className="w-2/3">
            <button
              onClick={() => router.push("/profile/edit")}
              className="text-sm text-white bg-green-800 px-4 py-1 rounded-md w-fit"
            >
              {t("edit")}
            </button>
          </div>
        </div>
      </div>

      <>
        <ProfileItem icon={<CiHeart />} label={t("favourites")} />
        <ProfileItem icon={<GrLanguage />} label={t("languages")} />
        <ProfileItem icon={<CiLocationOn />} label={t("location")} />
        <div className="border border-t border-gray-200 mb-6"></div>
        <ProfileItem icon={<CiLogout />} label={t("logout")} />
      </>
    </div>
  );
}
