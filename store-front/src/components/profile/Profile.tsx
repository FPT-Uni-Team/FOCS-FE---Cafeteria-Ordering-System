"use client";

import Image from "next/image";
import { CiLocationOn, CiLogout } from "react-icons/ci";
import { GrLanguage } from "react-icons/gr";
import ProfileItem from "./ProfileItem";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { makeHref } from "@/utils/common/common";

interface Props {
  user: {
    fullName: string;
    email: string;
    avatar: string;
  };
}

const onClickIcon = () => {
  signOut({
    redirect: true,
    callbackUrl: makeHref("sign-in"),
  });
};

export default function Profile({ user }: Props) {
  const t = useTranslations("profile");
  return (
    <div className="bg-white px-4 py-6 border rounded-lg shadow-lg">
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <Image
              src={user.avatar}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover size-20"
            />
          </div>
          <div className="w-2/3">
            <h2 className="text-lg font-semibold text-black">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/3"></div>
          <div className="w-2/3">
            <Link
              href="/profile-detail"
              className="text-sm text-white bg-green-800 px-4 py-1 rounded-md inline-block"
            >
              {t("edit")}
            </Link>
          </div>
        </div>
      </div>

      <ProfileItem icon={<GrLanguage />} label={t("languages")} />
      <ProfileItem icon={<CiLocationOn />} label={t("location")} />
      <div className="border border-t border-gray-200 mb-6"></div>
      <ProfileItem
        icon={<CiLogout />}
        label={t("logout")}
        onClickIcon={onClickIcon}
      />
    </div>
  );
}
