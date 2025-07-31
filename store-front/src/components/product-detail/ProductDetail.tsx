"use client";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import "swiper/css";
import { FaStar } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { fetchMenuItemDetailStart } from "@/store/slices/menuItem/menuItemDetailSlice";
import { useParams, useRouter } from "next/navigation";
import ImageSlider from "../common/ImageSlider";
import { CiShoppingCart } from "react-icons/ci";
import ProductModalCart from "../product-list/ProductModalCart";
import { SubmitPayload } from "@/types/cart";
import axiosClient from "@/api/axiosClient";
import { ImageType, Variant } from "@/types/menuItem";
import ProductDetailSkeleton from "../common/ProductDetailSkeleton";
import { IoIosArrowBack } from "react-icons/io";

export default function ProductDetail() {
  const t = useTranslations("product-detail");
  const [showSlider, setShowSlider] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const menuItemId = params?.id;
  const { menuItem: product, loading } = useAppSelector(
    (state) => state.menuItemDetail
  );
  const { actorId, tableId, prevNavigate } = useAppSelector(
    (state) => state.common
  );

  const handleSubmit = async (product: SubmitPayload) => {
    try {
      const data = {
        menu_item_id: product.menu_item_id,
        variants: product.variant_ids.map((id) => ({
          variant_id: id,
          quantity: 1,
        })),
        quantity: product.quantity,
        note: product.note,
        actorId,
        tableId,
      };
      await axiosClient.post("/api/cart/add", data);
    } catch {
      throw new Error("");
    }
  };

  const onBack = () => {
    router.push(prevNavigate);
  };

  useEffect(() => {
    dispatch(fetchMenuItemDetailStart(menuItemId as string));
  }, [dispatch, menuItemId]);

  return (
    <div>
      {!loading ? (
        <div className="relative">
          <button
            type="button"
            onClick={onBack}
            className="text-black text-3xl rounded-sm bg-white shadow-2xs absolute top-4 left-4 z-2"
          >
            <IoIosArrowBack />
          </button>
          <ImageSlider images={product.images as ImageType[]} />
          <div className="mb-4 flex flex-col gap-2 relative">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500">
                {product.categories?.map((cat) => cat.name).join(", ")}
              </p>
            </div>
            <p className="text-sm text-gray-400">{product.description}</p>
            <p className="text-green-800 text-lg font-semibold">
              {(product?.base_price || 0)
                .toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                })
                .replace("₫", "VND")}
            </p>
            <button
              className="absolute bottom-4 right-4 text-white bg-green-800 px-[10px] py-1 rounded-xl"
              title="Add to cart"
              onClick={() => {
                setShowSlider(true);
              }}
            >
              <CiShoppingCart size={18} />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 border-t border-t-gray-200 text-black pt-2">
              {t("feedbackTitle")}
            </h3>
            {product.feedbacks && product.feedbacks.length > 0 ? (
              <div className="space-y-3">
                {product.feedbacks.map((fb, idx) => (
                  <div key={idx} className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-800">
                        {fb.user}
                      </span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={14}
                            className={
                              i < fb.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{fb.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-4 text-gray-500 italic text-sm mt-6">
                <VscFeedback size={50} />
                <span>{t("noFeedback")}</span>
              </div>
            )}
          </div>
          {product && (
            <ProductModalCart
              product={{
                ...product,
                images: (product.images as ImageType[])?.[0]?.url,
                variant_groups: product.variant_groups.map(
                  ({ variants, ...rest }) => ({
                    ...rest,
                    variant: variants as Variant[],
                  })
                ),
              }}
              show={showSlider}
              onClose={() => setShowSlider(false)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      ) : (
        <ProductDetailSkeleton />
      )}
    </div>
  );
}
