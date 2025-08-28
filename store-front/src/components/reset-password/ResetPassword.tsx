"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import axiosClient from "@/api/axiosClient";
import {
  createPasswordSchema,
  PasswordFormData,
} from "@/utils/validations/authSchema";
import { useSearchParams, useRouter } from "next/navigation";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { makeHref } from "@/utils/common/common";

export default function ResetPassword() {
  const t = useTranslations("reset-password");
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const tokenFromUrl = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(createPasswordSchema(t)),
  });

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setResetError(null);
    try {
      await axiosClient.post("/api/me/reset-password", {
        email,
        token: tokenFromUrl,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      toast.success(t("reset_success"));
      router.push(makeHref("sign-in"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || t("error_generic");
      setResetError(message);
    }
  };

  useEffect(() => {
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [emailFromUrl]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50">
      <div className="bg-white max-w-md w-full p-4 rounded-lg shadow-lg space-y-4 m-4 relative">
        <>
          <button
            onClick={() => router.push(makeHref("sign-in"))}
            className="absolute left-4 top-5 text-black text-sm"
            aria-label="Back"
          >
            <TbArrowNarrowLeft size={21} />
          </button>
          <h2 className="text-2xl font-bold text-center text-orange-600">
            {t("reset_title")}
          </h2>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("new_password")}
              </label>
              <input
                placeholder="••••••••"
                type="password"
                {...passwordForm.register("new_password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
              {passwordForm.formState.errors.new_password && (
                <p className="text-sm text-red-500 mt-1">
                  {passwordForm.formState.errors.new_password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("confirm_password")}
              </label>
              <input
                placeholder="••••••••"
                type="password"
                {...passwordForm.register("confirm_password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
              {passwordForm.formState.errors.confirm_password && (
                <p className="text-sm text-red-500 mt-1">
                  {passwordForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>

            {resetError && <p className="text-sm text-red-500">{resetError}</p>}

            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition text-center"
            >
              {t("submit_reset")}
            </button>
          </form>
          {passwordForm.formState.isSubmitting && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center space-y-2">
                <FaSpinner className="animate-spin text-orange-500 text-2xl" />
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
