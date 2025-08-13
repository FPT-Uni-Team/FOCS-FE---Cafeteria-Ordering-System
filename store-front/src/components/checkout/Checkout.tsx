import Image from "next/image";
import Title from "../common/Title";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import { fetchCartItemsStart } from "@/store/slices/cart/cartSlice";
import { checkoutStart } from "@/store/slices/cart/checkoutSlice";
import { useTranslations } from "next-intl";
import LoadingOverlay from "../common/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckoutFormData,
  createCheckoutSchema,
} from "@/utils/validations/authSchema";
import { useForm } from "react-hook-form";
import { CheckoutRequest, CheckoutResponse, OrderRequest } from "@/types/cart";
import cartService from "@/services/cartService";

const Checkout = () => {
  const t = useTranslations("checkout");
  const [orderType, setOrderType] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(createCheckoutSchema(t)),
    defaultValues: {
      customerName: "",
      customerPhone: "",
    },
  });
  const {
    data,
    error,
    loading: checkoutLoading,
  } = useAppSelector((state) => state.checkoutSlice);
  const { cartItems, loading: cartItemLoading } = useAppSelector(
    (state) => state.cartItem
  );
  const { actorId, tableId, storeId } = useAppSelector((state) => state.common);
  const [couponCode, setCouponCode] = useState("");
  const isLoading = cartItemLoading || checkoutLoading || isSubmitting;

  const dispatch = useAppDispatch();

  const handleCheckout = async (couponCode?: string) => {
    try {
      const checkoutData: CheckoutRequest = {
        store_id: storeId,
        table_id: tableId,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          variants: item.variant_groups.flatMap((group) =>
            group.variant
              .filter((v) => v.isSelected)
              .map((v) => ({
                variant_id: v.id,
                quantity: 1,
              }))
          ),
          quantity: item.quantity,
          note: item.note ?? "",
        })),
        point: 0,
        is_use_point: false,
        coupon_code: couponCode,
      };

      await dispatch(
        checkoutStart({
          actorId,
          data: checkoutData,
        })
      );
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  useEffect(() => {
    handleCheckout();
  }, [cartItems]);

  useEffect(() => {
    setCouponCode((data?.applied_coupon_code as string) || "");
  }, [data]);

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    handleCheckout(couponCode);
  };

  useEffect(() => {
    dispatch(fetchCartItemsStart({ actorId, tableId }));
  }, []);

  const onSubmit = async (values: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const orderData: OrderRequest = {
        store_id: storeId,
        table_id: tableId,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          variants: item.variant_groups.flatMap((group) =>
            group.variant
              .filter((v) => v.isSelected)
              .map((v) => ({
                variant_id: v.id,
                quantity: 1,
              }))
          ),
          quantity: item.quantity,
          note: item.note ?? "",
        })),
        note: "",
        coupon_code: couponCode,
        is_use_point: true,
        point: 0,
        customer_info: {
          name: values.customerName,
          phone: values.customerPhone,
        },
        discount: data as CheckoutResponse,
        payment_type: 0,
        order_type: parseInt(orderType),
      };
      const res = await cartService.create_order(orderData);
      const resPayment = await cartService.payment_order({
        order_code: res.data.order_code as number,
        amount: res.data.total_price as number,
        description: `Order ${res.data.order_code}`,
        table_id: tableId,
      });
      if (resPayment.data) {
        window.location.href = resPayment.data;
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Title titleKey="checkout" showBackButton center />
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-transparent flex items-center justify-center">
          <LoadingOverlay visible={true} />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto pb-4">
          <div className="flex flex-col gap-2">
            {cartItems.map((item) => {
              const selectedVariant = item.variant_groups
                .flatMap((g) => g.variant)
                .find((v) => v.isSelected);

              const itemCode = `${item.id}_${selectedVariant?.id}`;
              const discountDetail = data?.item_discount_details?.find(
                (detail) => detail.item_code === itemCode
              );

              const basePrice =
                item.base_price +
                (item.variant_groups?.reduce((vgSum, vg) => {
                  return (
                    vgSum +
                    vg.variant
                      .filter((v) => v.isSelected)
                      .reduce((vSum, v) => vSum + v.price, 0)
                  );
                }, 0) || 0);

              const finalPrice = discountDetail
                ? basePrice - discountDetail.discount_amount
                : basePrice;

              return (
                <div key={item.id}>
                  <div className="flex relative gap-2 w-full">
                    <Image
                      src={
                        (item.images as string) ||
                        "/img/profile/default-avatar.jpg"
                      }
                      alt={item.name}
                      width={96}
                      height={96}
                      className="rounded-xl object-cover aspect-square"
                    />
                    <div className="flex rounded-xl bg-gray-100 p-2 flex-1 justify-between relative">
                      <div className="flex flex-col justify-between">
                        <div>
                          <h1 className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
                            {item.name}
                          </h1>
                          <p className="text-sm text-gray-500 truncate max-w-[180px]">
                            {item.categories?.map((cat) => cat.name).join(", ")}
                          </p>
                          {item.variant_groups.length > 0 && (
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">
                              {item.variant_groups
                                .flatMap((group) =>
                                  group.variant
                                    .filter((v) => v.isSelected)
                                    .map((v) => v.name)
                                )
                                .join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {discountDetail && (
                            <span className="text-gray-400 line-through text-xs">
                              {basePrice} VND
                            </span>
                          )}
                          <span className="text-green-800 text-md font-semibold">
                            {finalPrice} VND
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="leading-5">
                          <span className="text-gray-600 text-[10px]">
                            QTY:
                          </span>
                          <span className="font-semibold text-black text-[10px]">
                            {item.quantity.toString().padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {discountDetail && discountDetail.source && (
                    <span className="text-[10px] italic text-gray-400 mt-1">
                      * {discountDetail.source}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-t-gray-300 space-y-4 mt-4">
            <div className="mt-2">
              <p className="text-sm font-semibold text-black">
                {t("customerInfo")}
              </p>
              <div className="mt-2 flex gap-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder={t("name")}
                    {...register("customerName")}
                    className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="tel"
                    placeholder={t("phone")}
                    {...register("customerPhone")}
                    className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.customerPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-black">
                {t("orderType")}
              </p>
              <div className="flex items-center gap-6 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="orderType"
                    value="0"
                    checked={orderType === "0"}
                    onChange={(e) => setOrderType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-black">{t("dineIn")}</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="orderType"
                    value="1"
                    checked={orderType === "1"}
                    onChange={(e) => setOrderType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-black">
                    {t("takeAway")}
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-black">
                {t("couponCode")}
              </label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t("enterCoupon")}
                  className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none  text-black"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-green-800 text-white rounded-md text-sm"
                >
                  {t("apply")}
                </button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>
        </div>
        <div className="fixed bottom-[80px] left-0 right-0 bg-white">
          <div className="px-4 pt-3 pb-2 border-t border-gray-300 space-y-1 text-sm text-gray-900">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="font-semibold">
                {(data?.total_discount ?? 0) + (data?.total_price ?? 0)} VND
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("discount")}</span>
              <span className="text-red-600 font-semibold">
                - {data?.total_discount ?? 0} VND
              </span>
            </div>
          </div>

          <div className="p-4 flex justify-between items-center border-t border-gray-300">
            <span className="text-gray-900 font-semibold">{t("total")}</span>
            <span className="text-sm font-bold text-gray-900">
              {data?.total_price ?? 0} VND
            </span>
          </div>
          <div className="px-4 pb-2">
            <button
              type="submit"
              className="bg-green-800 text-white rounded-xl font-semibold text-sm py-2 px-10 w-full focus:outline-none"
            >
              {t("pay")}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
export default Checkout;
