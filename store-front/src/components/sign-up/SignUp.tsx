"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSignUpSchema } from "@/utils/validations/authSchema";
import Link from "next/link";
import axiosClient from "@/api/axiosClient";
import { FaSpinner } from "react-icons/fa";

const SignUp = () => {
  const t = useTranslations("sign-up");
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const signUpSchema = createSignUpSchema(t);
  type SignUpFormData = z.infer<typeof signUpSchema>;

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setRegisterError(null);
    try {
      await axiosClient.post("/api/auth/register", data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setRegisterError(message);
      throw new Error("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full relative">
      {form.formState.isSubmitSuccessful ? (
        <div className="bg-white max-w-md w-full p-4 rounded-lg shadow-lg text-center space-y-4 m-4">
          <h2 className="text-2xl font-bold text-orange-600">
            🎉 {t("check_email_title")}
          </h2>
          <p className="text-gray-600">{t("check_email_description")}</p>
          <button
            onClick={() => router.push("/sign-in")}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            {t("go_to_sign_in")}
          </button>
        </div>
      ) : (
        <>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white w-full max-w-md space-y-2 rounded-lg shadow-lg m-4 p-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              {t("title")}
            </h2>
            <div className="flex gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("first_name")}
                </label>
                <input
                  {...form.register("first_name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
                {form.formState.errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("last_name")}
                </label>
                <input
                  {...form.register("last_name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
                {form.formState.errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                {...form.register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("phone")}
              </label>
              <input
                {...form.register("phone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("confirm_password")}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...form.register("confirm_password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
              {form.formState.errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.confirm_password.message}
                </p>
              )}
            </div>

            {registerError && (
              <div className="text-red-500 text-sm text-center">
                {registerError}
              </div>
            )}

            <button
              type="submit"
              className={`w-full bg-orange-600 text-white py-2 px-4 rounded-2xl mt-2 hover:bg-orange-700 transition-colors duration-200 font-medium uppercase ${
                form.formState.isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={form.formState.isSubmitting}
            >
              {t("submit")}
            </button>
            <div className="text-center text-sm text-gray-500 mt-4">
              {t("already_have_account")}{" "}
              <Link href="/sign-in" className="text-orange-600">
                {t("sign_in")}
              </Link>
            </div>
          </form>
          {form.formState.isSubmitting && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center space-y-2">
                <FaSpinner className="animate-spin text-orange-500 text-2xl" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SignUp;
