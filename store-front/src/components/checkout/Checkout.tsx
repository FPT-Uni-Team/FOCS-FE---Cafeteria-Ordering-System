import Image from "next/image";
import Title from "../common/Title";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { FaCheckCircle, FaTag, FaTimes } from "react-icons/fa";
import productService from "@/services/productService";
import PaymentSuccess from "../success/PaymentSuccess";

interface Coupon {
  code: string;
  description: string;
}
const Checkout = () => {
  const t = useTranslations("checkout");
  const [orderType, setOrderType] = useState("0");
  const [paymentType, setPaymentType] = useState("0");
  const [usePoint, setUsePoint] = useState(false);
  const [orderCode, setOrderCode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [validCoupons, setValidCoupons] = useState<Coupon[]>();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

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
    selectedCartItems,
  } = useAppSelector((state) => state.checkoutSlice);
  const { actorId, tableId, storeId } = useAppSelector((state) => state.common);
  const [couponCode, setCouponCode] = useState("");
  const [codeZero, setCodeZero] = useState("");
  const [point, setPoint] = useState(0);
  const [priceZoro, serPriceZero] = useState(false);
  const isLoading = checkoutLoading || isSubmitting;
  const { data: session } = useSession();
  const isAuth = !!session?.accessToken;
  const dispatch = useAppDispatch();
  const handleSelect = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };
  const handleCheckout = async (couponCode?: string) => {
    try {
      const checkoutData: CheckoutRequest = {
        store_id: storeId,
        table_id: tableId,
        actor_id: actorId,
        items: selectedCartItems.map((item) => ({
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
        is_use_point: usePoint,
        coupon_code: couponCode,
      };

      await dispatch(
        checkoutStart({
          actorId,
          data: checkoutData,
        })
      );
      const coupon =
        validCoupons && validCoupons.find((item) => item.code === couponCode);
      if (coupon) {
        setSelectedCoupon(coupon);
      }
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    handleCheckout(selectedCoupon?.code);
  };

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    handleCheckout(couponCode);
  };

  const onSubmit = async (values: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const orderData: OrderRequest = {
        store_id: storeId,
        table_id: tableId,
        items: selectedCartItems.map((item) => ({
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
        is_use_point: usePoint,
        point: usePoint ? point : 0,
        customer_info: {
          name: values.customerName,
          phone: values.customerPhone,
        },
        discount: data as CheckoutResponse,
        payment_type: paymentType === "0" ? 0 : 1,
        order_type: parseInt(orderType),
      };
      const res = await cartService.create_order(orderData);
      if (res.data.total_price === 0) {
        serPriceZero(true);
        setCodeZero(res.data.order_code);
        await cartService.order_update({
          orderCode: res.data.order_code,
          statusString: "00",
        });
        return;
      }
      if (paymentType === "1") {
        setOrderCode(res.data.order_code);
        return;
      }
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

  const handleChangePoint = () => {
    setUsePoint(!usePoint);
    handleCheckout();
  };

  useEffect(() => {
    handleCheckout();
  }, [selectedCartItems]);

  useEffect(() => {
    setCouponCode((data?.applied_coupon_code as string) || "");
  }, [data]);

  useEffect(() => {
    productService.couponValid().then((res) => {
      setValidCoupons(res.data.items);
    });
    cartService.get_point().then((res) => {
      setPoint(res.data);
    });
  }, []);

  if (priceZoro) {
    return <PaymentSuccess titlePaymentZero={true} orderCode={codeZero} />;
  }

  if (orderCode) {
    return <PaymentSuccess titlePaymentMoney={true} orderCode={orderCode} />;
  }

  return (
    <>
      <Title titleKey="checkout" showBackButton center />
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-transparent flex items-center justify-center">
          <LoadingOverlay visible={true} />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-h-[calc(100vh-320px)] overflow-y-auto pb-4">
          <div className="flex flex-col gap-2">
            {selectedCartItems.map((item) => {
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
                              {basePrice.toLocaleString("vi-VN")} VND
                            </span>
                          )}
                          <span className="text-green-800 text-md font-semibold">
                            {finalPrice.toLocaleString("vi-VN")} VND
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

            <div>
              <p className="text-sm font-semibold text-black">
                {t("paymentType")}
              </p>
              <div className="flex items-center gap-6 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentType"
                    value="1"
                    checked={paymentType === "1"}
                    onChange={(e) => setPaymentType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-black">{t("cash")}</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentType"
                    value="0"
                    checked={paymentType === "0"}
                    onChange={(e) => setPaymentType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-black">
                    {t("transfer")}
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
                  className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode}
                  className={`px-4 py-2 rounded-md text-sm text-white 
                ${
                  couponCode ? "bg-green-800" : "bg-gray-400 cursor-not-allowed"
                }`}
                >
                  {t("apply")}
                </button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div
              onClick={() => setShowModal(true)}
              className="text-right text-gray-600 text-sm"
            >
              * {t("choose")}
            </div>

            {isAuth && point !== 0 && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-black">
                  {t("point")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    {point.toLocaleString("vi-VN")} point
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={usePoint}
                      onChange={handleChangePoint}
                    />
                    <div
                      className="relative w-11 h-6 bg-gray-200 rounded-full 
                  peer-checked:bg-green-600 
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                  after:bg-white after:border-gray-300 after:border 
                  after:rounded-full after:h-5 after:w-5 
                  after:transition-all peer-checked:after:translate-x-full"
                    ></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-[80px] left-0 right-0 bg-white">
          <div className="px-4 pt-3 pb-2 border-t border-gray-300 space-y-1 text-sm text-gray-900">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="font-semibold">
                {(
                  (data?.total_discount ?? 0) +
                  (data?.total_price ?? 0) -
                  (data?.tax_amount ?? 0)
                ).toLocaleString("vi-VN")}{" "}
                VND
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("discount")}</span>
              <span className="text-red-600 font-semibold">
                - {data?.total_discount.toLocaleString("vi-VN") ?? 0} VND
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("tax")}</span>
              <span className="text-green-600 font-semibold">
                +{" "}
                {(data?.tax_amount &&
                  data?.tax_amount.toLocaleString("vi-VN")) ??
                  0}{" "}
                VND
              </span>
            </div>
          </div>

          <div className="p-4 flex justify-between items-center border-t border-gray-300">
            <span className="text-gray-900 font-semibold">{t("total")}</span>
            <span className="text-sm font-bold text-gray-900">
              {data?.total_price.toLocaleString("vi-VN") ?? 0} VND
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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-4 bg-[#00000080] p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("chooseCoupons")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-3">
              {validCoupons ? (
                validCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    onClick={() => handleSelect(coupon)}
                    className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-colors 
                          duration-200 flex items-center
                          ${
                            selectedCoupon &&
                            selectedCoupon.code === coupon.code
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-gray-400"
                          }
                          `}
                  >
                    <FaTag className="text-green-600 mr-3 w-6 h-6 flex-shrink-0" />
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">
                        {coupon.code}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {coupon.description}
                      </p>
                    </div>
                    {selectedCoupon && selectedCoupon.code === coupon.code && (
                      <FaCheckCircle className="text-green-600 ml-4 w-6 h-6 flex-shrink-0" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {t("noCouponsAvailable")}
                </p>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-400 rounded-md text-black"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
                  selectedCoupon
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedCoupon}
              >
                {t("Apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Checkout;
