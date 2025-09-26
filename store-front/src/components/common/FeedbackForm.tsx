"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import { useTranslations } from "next-intl";
import orderService from "@/services/orderService";
import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/redux";
import LoadingOverlay from "./LoadingOverlay";

export interface FeedbackFormValues {
  star: number;
  description?: string;
  images: File[];
}

interface FeedbackFormProps {
  onClose: () => void;
  orderId: string;
  fetchOrders: () => void;
}

export default function FeedbackForm({
  onClose,
  orderId,
  fetchOrders,
}: FeedbackFormProps) {
  const t = useTranslations("FeedbackForm");
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FeedbackFormValues>();
  const { actorId } = useAppSelector((state) => state.common);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<(File | null)[]>([null, null]);
  const previews = files.map((file) => (file ? URL.createObjectURL(file) : ""));

  const onSubmit = (data: FeedbackFormValues) => {
    const realImages = files.filter((f): f is File => f !== null);
    if (realImages.length === 0) {
      setError("images", { message: t("pleaseUploadImages") });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("rating", String(data.star));
    formData.append("comment", data.description || "");
    formData.append("order_id", orderId);
    formData.append("actor_id", actorId);
    realImages.forEach((file) => {
      formData.append("images", file);
    });
    orderService
      .feedback(formData)
      .then(() => {
        toast.success(t("feedbackSuccess"));
        onClose();
        fetchOrders();
      })
      .catch(() => {
        toast.error(t("feedbackError"));
        setLoading(false);
      });
  };

  const handleImageChange = (updatedFiles: (File | null)[]) => {
    const realFiles = updatedFiles.filter((f): f is File => f !== null);
    setFiles(updatedFiles);
    setValue("images", realFiles);
    if (realFiles.length > 0) {
      clearErrors("images");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-slide-up">
      <LoadingOverlay visible={loading} />
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold text-black">{t("title")}</h2>
        <button onClick={onClose} className="text-gray-500">
          ✕
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 p-4 overflow-y-auto flex-grow"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="text-black text-xl">{t("howDoYouFeel")}</div>
          <div className="text-gray-500 text-sm text-center">
            {t("shareYourThoughts")}
          </div>
        </div>
        <div className="text-center">
          <Controller
            name="star"
            control={control}
            rules={{ required: t("starRequired") }}
            render={({ field }) => (
              <div className="flex items-center gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => field.onChange(value)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      size={28}
                      className={
                        value <= (field.value || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            )}
          />
          {errors.star && (
            <p className="text-red-500 text-sm mt-2">{errors.star.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register("description", {
              required: t("descriptionRequired"),
            })}
            placeholder={t("descriptionPlaceholder")}
            className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 p-2 w-full text-gray-600"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <ImageUpload
          previews={previews}
          files={files}
          onChange={handleImageChange}
        />
        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images.message}</p>
        )}

        <button
          type="submit"
          className="bg-green-800 text-white px-4 py-2 rounded w-full"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
