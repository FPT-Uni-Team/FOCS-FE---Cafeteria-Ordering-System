"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaChevronDown, FaShippingFast } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createSignInSchema } from "@/utils/validations/authSchema";
import { makeHref } from "@/utils/common/common";

const SignIn = () => {
  const t = useTranslations("sign-in");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const signInSchema = createSignInSchema(t);
  type SignInFormData = z.infer<typeof signInSchema>;

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setLoginError(null);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (!res) return;
      if (res.error) {
        setLoginError(t("error_invalid_credentials"));
      } else {
        router.push(makeHref("home-page"));
      }
    } catch {
      setLoginError("Something went wrong.");
    }
  };

  const handleNavigate = (path: string) => {
    router.push(makeHref(path));
  };

  return (
    <div className="h-screen w-full relative bg-cover bg-center bg-green-700">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center">
        <FaShippingFast size={80} />
        <div className="text-center text-2xl font-bold mt-2">FOCS</div>
      </div>
      <div
        className="absolute top-4/5 left-1/2 -translate-x-1/2 -translate-y-1/2 
        text-white cursor-pointer bg-orange-600 rounded-full p-2"
        onClick={() => setShowForm(!showForm)}
      >
        <FaChevronDown size={32} />
      </div>

      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-2
        ${
          showForm
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowForm(false)}
      />

      <form
        className={`fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] z-3 bg-white rounded-t-4xl
        transition-all duration-500 ease-out transform
        ${
          showForm ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="p-6 pb-16">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("get_something")}
          </h2>
          <p className="text-sm text-gray-400 mb-6 mt-1">
            {t("good_to_see_you")}
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("email")}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="focs@gmail.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("password")}
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="••••••••"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {loginError && <div className="text-red-500">{loginError}</div>}

            <button
              type="submit"
              className={`w-full bg-orange-600 text-white py-2 px-4 rounded-2xl hover:bg-orange-700 transition-colors duration-200 font-medium uppercase ${
                form.formState.isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={form.formState.isSubmitting}
            >
              {t("sign_in")}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            {t("do_not_account")}{" "}
            <div
              onClick={() => handleNavigate("sign-up")}
              className="text-orange-600 inline-block"
            >
              {t("sign_up")}
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            <div
              onClick={() => handleNavigate("forgot-password")}
              className="text-orange-600"
            >
              {t("forgot_password")}
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            <div
              onClick={() => handleNavigate("home-page")}
              className="text-gray-800"
            >
              {t("continue_as_guest")}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
