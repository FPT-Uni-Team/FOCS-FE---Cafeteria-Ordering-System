"use client";

import { FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { makeHref } from "@/utils/common/common";

export default function PaymentFail() {
  const router = useRouter();
  const t = useTranslations("payment");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <FaTimesCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          {t("payment_fail_title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("payment_fail_message")}</p>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <button
            onClick={() => router.push(makeHref("product-list"))}
            className="px-4 py-2 bg-red-600 text-white rounded mt-4"
          >
            {t("continue_shopping")}
          </button>
        </div>
      </div>
    </div>
  );
}
