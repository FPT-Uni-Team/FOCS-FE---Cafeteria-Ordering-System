import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  createProfileDetailSchema,
  ProfileFormData,
} from "@/utils/validations/authSchema";
import Title from "../common/Title";
import userService from "@/services/userService";
import { UserResponse } from "@/types/userProfile";
import ProfileSkeleton from "../common/ProfileSkeleton";
import toast from "react-hot-toast";
import LoadingOverlay from "../common/LoadingOverlay";
const ProfileDetail = () => {
  const t = useTranslations("profile");
  const profileSchema = createProfileDetailSchema(t);

  const [profileDetail, setProfileDetail] = useState<UserResponse>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      const payload: UserResponse = {
        ...profileDetail,
        ...data,
        email: profileDetail?.email ?? "",
        phone_number: profileDetail?.phone_number ?? "",
      };
      await userService.update(payload);
      toast.success(t("update_success"));
    } catch {
      toast.error(t("update_fail"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await userService.detail();
        setProfileDetail(res.data);
        reset({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
        });
      } catch (error) {
        console.error("Failed to fetch user detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [reset]);

  return (
    <div>
      <Title titleKey="profile-detail" showBackButton center />
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-transparent flex items-center justify-center">
          <LoadingOverlay visible={true} />
        </div>
      )}
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="first_name"
                className="text-sm font-medium text-black mb-1"
              >
                {t("first_name")}
              </label>
              <input
                type="text"
                id="first_name"
                {...register("first_name")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="last_name"
                className="text-sm font-medium text-black mb-1"
              >
                {t("last_name")}
              </label>
              <input
                type="text"
                id="last_name"
                {...register("last_name")}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-black mb-1"
            >
              {t("phone")}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              disabled
              value={profileDetail?.phone_number ?? ""}
              className="px-4 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-black mb-1"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              disabled
              value={profileDetail?.email ?? ""}
              className="px-4 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="fixed bottom-[80px] left-4 right-4 bg-white">
            <button
              type="submit"
              className="w-full bg-green-800 text-white font-semibold py-2 rounded-md shadow-md"
            >
              {t("save")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileDetail;
