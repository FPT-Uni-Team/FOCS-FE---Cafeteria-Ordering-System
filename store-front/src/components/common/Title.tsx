import React from "react";
import { useTranslations } from "next-intl";

interface TitleProps {
  titleKey: string;
  itemCount?: number;
}

export default function Title({ titleKey, itemCount }: TitleProps) {
  const t = useTranslations("common");
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-gray-800">
        {t(titleKey)}{" "}
        {itemCount !== undefined &&
          `(${itemCount.toString().padStart(2, "0")})`}
      </h2>
    </div>
  );
}
