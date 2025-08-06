"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { Product } from "@/types/menuItem";
import { useTranslations } from "next-intl";
import { MdOutlineClose } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import { SubmitPayload } from "@/types/cart";
import LoadingOverlay from "../common/LoadingOverlay";
import toast from "react-hot-toast";

type ProductSliderProps = {
  product: Product;
  show: boolean;
  onClose: () => void;
  onSubmit?: (data: SubmitPayload) => void;
  initialData?: {
    quantity: number;
    note: string;
    selectedVariants: string[];
  };
};

type FormValues = {
  quantity: number;
  note: string;
} & Record<`variants-${string}`, string[]>;

export default function ProductModalCart({
  product,
  show,
  onClose,
  onSubmit,
  initialData,
}: ProductSliderProps) {
  const t = useTranslations("product-modal");
  const [totalPrice, setTotalPrice] = useState(product.base_price);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      quantity: initialData?.quantity || 1,
      note: initialData?.note || "",
      ...Object.fromEntries(
        product.variant_groups.map((group) => [
          `variants-${group.id}`,
          initialData?.selectedVariants?.filter((variantId) =>
            group.variant.some((v) => v.id === variantId)
          ) || [],
        ])
      ),
    },
  });

  const quantity = watch("quantity");
  const watchedPriceDependencies = {
    quantity: quantity,
    variants: product.variant_groups.map((group) =>
      watch(`variants-${group.id}`)
    ),
  };

  const priceCalculationKey = JSON.stringify(watchedPriceDependencies);

  const handleFormSubmit = async (data: FormValues) => {
    let hasAnyError = false;

    product.variant_groups.forEach((group) => {
      const fieldName = `variants-${group.id}` as const;
      const selected = getValues(fieldName) || [];
      const selectedCount = selected.length;
      if (selectedCount === 0 && group.is_required) {
        setError(fieldName, {
          type: "manual",
          message: t("required_msg"),
        });
        hasAnyError = true;
        return;
      }

      if (group.min_select > 0 && selectedCount < group.min_select) {
        setError(fieldName, {
          type: "manual",
          message: t("min_select_msg", { count: group.min_select }),
        });
        hasAnyError = true;
      }

      if (group.max_select > 0 && selectedCount > group.max_select) {
        setError(fieldName, {
          type: "manual",
          message: t("max_select_msg", { count: group.max_select }),
        });
        hasAnyError = true;
      }

      if (!hasAnyError) {
        clearErrors(fieldName);
      }
    });

    if (hasAnyError) return;

    const variant_ids: string[] = product.variant_groups
      .flatMap((group) => getValues(`variants-${group.id}`) || [])
      .filter(Boolean);

    const payload: SubmitPayload = {
      menu_item_id: product.id,
      variant_ids,
      quantity: data.quantity,
      note: data.note,
    };

    try {
      setIsSubmitting(true);
      await onSubmit?.(payload);
      onClose();
      toast.success(t("add_to_cart_success"));
    } catch {
      toast.error(t("add_to_cart_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsCalculating(true);
    const timeout = setTimeout(() => {
      let price = product.base_price;
      product.variant_groups.forEach((group) => {
        const selectedIds: string[] = getValues(`variants-${group.id}`) || [];
        group.variant.forEach((variant) => {
          if (selectedIds.includes(variant.id)) {
            price += variant.price;
          }
        });
      });
      setTotalPrice(price * (getValues("quantity") || 1));
      setIsCalculating(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [
    product.base_price,
    product.variant_groups,
    getValues,
    priceCalculationKey,
  ]);

  console.log("total", totalPrice);

  useEffect(() => {
    const defaultValues = {
      quantity: initialData?.quantity || 1,
      note: initialData?.note || "",
      ...Object.fromEntries(
        product.variant_groups.map((group) => [
          `variants-${group.id}`,
          initialData?.selectedVariants?.filter((variantId) =>
            group.variant.some((v) => v.id === variantId)
          ) || [],
        ])
      ),
    };

    reset(defaultValues);
  }, [product, reset, initialData]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollThreshold = 160;
        setShowFixedHeader(
          scrollContainerRef.current.scrollTop > scrollThreshold
        );
      }
    };
    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-3 ${
          show
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`fixed bottom-0 left-0 right-0 z-4 bg-white rounded-t-3xl
        pb-[env(safe-area-inset-bottom)] transition-all duration-500 ease-out transform
        overflow-hidden
        h-[90vh] ${
          show ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"
        }`}
      >
        <LoadingOverlay visible={isSubmitting} />
        <div
          className={`absolute top-0 left-0 right-0 bg-white p-3 border-b border-gray-200
          flex items-center justify-between transition-all ease-out duration-75
          ${showFixedHeader ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h2 className="text-lg font-bold text-black">{product.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 text-2xl rounded-4xl bg-white"
          >
            <MdOutlineClose />
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto pb-20 h-full"
          ref={scrollContainerRef}
        >
          <div className="relative">
            <button
              type="button"
              onClick={onClose}
              className={`absolute top-2 right-2 text-gray-400 text-2xl rounded-4xl bg-white p-1
                ${showFixedHeader ? "hidden" : ""}`}
            >
              <MdOutlineClose />
            </button>
            <Image
              src={
                (product.images as string) || "/img/profile/default-avatar.jpg"
              }
              alt={product.name}
              className="w-full h-[160px] object-cover"
              width={120}
              height={240}
            />
          </div>

          <div className="p-4">
            <div className="flex items-start gap-4 mb-4 justify-between">
              <h2 className="text-lg font-bold text-black">{product.name}</h2>
              <div className="flex flex-col gap-1 items-end">
                <p className="text-green-800 text-md font-semibold">
                  {product.base_price} VND
                </p>
                <div className=" text-xs text-gray-600">{t("base_price")}</div>
              </div>
            </div>
            <p className="text-sm text-gray-500">{product.description}</p>
          </div>

          <div className="border-b border-gray-300" />

          {product.variant_groups.map((group) => (
            <div key={group.id} className="p-4 border-b border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-black">{group.name}</h3>
                <p className="bg-gray-200 text-black p-1 rounded-lg text-[10px] font-semibold">
                  {group.is_required ? t("required") : t("not_required")}
                  {group.min_select > 0 && `, ${t("min")} ${group.min_select}`}
                  {group.max_select > 0 && `, ${t("max")} ${group.max_select}`}
                </p>
              </div>
              {errors[`variants-${group.id}`]?.message && (
                <p className="text-red-600 text-xs mt-1">
                  {errors[`variants-${group.id}`]?.message?.toString()}
                </p>
              )}
              <div className="space-y-2 text-sm mt-2">
                {group.variant.map((variant) => (
                  <label
                    key={variant.id}
                    className={`flex items-center gap-2 ${
                      variant.is_available ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={variant.id}
                      {...register(`variants-${group.id}`)}
                      disabled={!variant.is_available}
                      className="accent-green-700 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {variant.name}
                    <span
                      className={`ml-auto ${
                        variant.is_available ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      +{variant.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-black">{t("note_label")}</h3>
              <p className="bg-gray-200 text-black p-1 rounded-lg text-[10px] font-semibold">
                {t("not_required")}
              </p>
            </div>
            <textarea
              {...register("note")}
              placeholder={t("note_placeholder")}
              className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none"
              rows={3}
            />
            <div className="flex items-center overflow-hidden gap-4 justify-center mt-4">
              <button
                type="button"
                className="px-3 py-1 bg-green-400 text-xl text-white rounded-full"
                onClick={() =>
                  setValue("quantity", Math.max(getValues("quantity") - 1, 1))
                }
              >
                −
              </button>
              <input
                type="number"
                {...register("quantity", { min: 1 })}
                className="w-12 text-center border-l border-r border-none outline-none text-black"
                min={1}
              />
              <button
                type="button"
                className="px-3 py-1 bg-green-700 text-xl rounded-full text-white"
                onClick={() => setValue("quantity", getValues("quantity") + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
          <button
            type="submit"
            className="w-full bg-green-800 text-white h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <FaSpinner className="animate-spin w-4 h-4" />
            ) : (
              <>
                {t("add_to_cart")} – {totalPrice} VND
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
