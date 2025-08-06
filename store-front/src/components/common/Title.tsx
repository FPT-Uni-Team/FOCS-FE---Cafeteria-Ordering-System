"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

interface TitleProps {
  titleKey: string;
  itemCount?: number;
  center?: boolean;
  showBackButton?: boolean;
}

export default function Title({
  titleKey,
  itemCount,
  center = false,
  showBackButton = false,
}: TitleProps) {
  const t = useTranslations("common");
  const router = useRouter();

  return (
    <div
      className={`flex relative items-center justify-between mb-2 ${
        center ? "justify-center" : ""
      }`}
    >
      <div className="flex items-center ">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="text-gray-600 focus:outline-none absolute transform -translate-y-1/2 top-1/2 left-0"
          >
            <IoIosArrowBack />
          </button>
        )}
        <h2 className="text-lg font-semibold text-gray-800">
          {t(titleKey)}{" "}
          {itemCount !== undefined &&
            `(${itemCount.toString().padStart(2, "0")})`}
        </h2>
      </div>
    </div>
  );
}
