"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import axiosClient from "@/api/axiosClient";
import {
  createEmailSchema,
  EmailFormData,
} from "@/utils/validations/authSchema";
import { useRouter } from "next/navigation";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { makeHref } from "@/utils/common/common";

export default function ForgotPassword() {
  const router = useRouter();
  const t = useTranslations("forgot-password");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(createEmailSchema(t)),
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    setForgotError(null);
    try {
      await axiosClient.post("/api/auth/forgot-password", data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || t("error_generic");
      setForgotError(message);
      throw new Error("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50">
      <div className="bg-white max-w-md w-full p-4 rounded-lg shadow-lg space-y-4 m-4 relative">
        {emailForm.formState.isSubmitSuccessful ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-600">
              🎉 {t("check_email_title")}
            </h2>
            <p className="text-gray-600">{t("check_email_description")}</p>
            <button
              onClick={() => router.push(makeHref("sign-in"))}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              {t("go_to_sign_in")}
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => router.push(makeHref("sign-in"))}
              className="absolute left-4 top-5 text-black text-sm"
              aria-label="Back"
            >
              <TbArrowNarrowLeft size={21} />
            </button>
            <h2 className="text-2xl font-bold text-center text-orange-600">
              {t("title")}
            </h2>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("email")}
                </label>
                <input
                  {...emailForm.register("email")}
                  type="email"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              {forgotError && (
                <p className="text-sm text-red-500">{forgotError}</p>
              )}
              <button
                type="submit"
                disabled={emailForm.formState.isSubmitting}
                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
              >
                {t("submit")}
              </button>
            </form>
            {emailForm.formState.isSubmitting && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                  <FaSpinner className="animate-spin text-orange-500 text-2xl" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
