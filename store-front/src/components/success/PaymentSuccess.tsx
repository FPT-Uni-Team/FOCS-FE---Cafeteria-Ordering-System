"use client";

import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { makeHref } from "@/utils/common/common";

interface PaymentSuccessProps {
  orderCode: string;
}

export default function PaymentSuccess({ orderCode }: PaymentSuccessProps) {
  const router = useRouter();
  const t = useTranslations("payment");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          {t("payment_success_title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("payment_success_message")}</p>

        <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
          <p className="text-gray-700">
            <strong>{t("order_code")}:</strong> #{orderCode}
          </p>
          <div className="text-gray-700">
            <button
              onClick={() => router.push(makeHref("order-history"))}
              className="px-4 py-2 bg-green-800 text-white rounded mt-4"
            >
              {t("continue_shopping")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
