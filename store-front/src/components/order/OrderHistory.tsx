"use client";
import { useState, useEffect } from "react";
import orderService from "@/services/orderService";
import { ListPageParams } from "@/types/common";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Title from "../common/Title";
import OrderSkeleton from "../common/OrderSkeleton";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import FeedbackForm from "../common/FeedbackForm";
import { makeHref } from "@/utils/common/common";
import toast from "react-hot-toast";
import Link from "next/link";

export default function OrderHistory() {
  const router = useRouter();
  const t = useTranslations("order-detail");
  const [show, setShow] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: ListPageParams = {
        page: 1,
        page_size: 100,
      };
      const res = await orderService.getListOrders(params);
      setOrders(res?.data?.items || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleClickFeedback = (id: string) => {
    setShow(true);
    setOrderId(id);
  };

  const handleCallStaff = async () => {
    await orderService.callStaff();
    toast.success(t("callStaffSuccess"));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Title titleKey="order-history" showBackButton center />
      <div className="text-right mb-4 border-t border-gray-200 pt-2">
        <button
          className="bg-green-800 p-2 rounded-xl text-sm text-white"
          onClick={handleCallStaff}
        >
          <span>{t("callStaff")}</span>
        </button>
      </div>
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => <OrderSkeleton key={idx} />)
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p
                    className="text-sm text-gray-500 cursor-pointer"
                    onClick={() =>
                      router.push(makeHref(`order-detail/${order.id}`))
                    }
                  >
                    #<span className="font-medium">{order.order_code}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span className="text-green-700 text-sm font-semibold">
                  {t(`status.${order.order_status}`)}
                </span>
              </div>
              {order.order_details.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-2 border-b last:border-none"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={"/img/product/image-not-available.png"}
                      alt={item.menu_item_name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <Link
                        href={makeHref(`product-detail/${item.id}`)}
                        className="font-medium text-gray-800"
                      >
                        {item.menu_item_name}
                      </Link>
                      {item.variants.length > 0 && (
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">
                          {item.variants
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map((v: any) => v.variant_name)
                            .join(", ")}
                        </p>
                      )}
                      {item.variant_name && (
                        <p className="text-xs text-gray-500">
                          {item.variant_name}
                        </p>
                      )}
                    </div>
                    <p className="text-green-800 text-sm font-semibold">
                      {item.total_price.toLocaleString("vi-VN") ?? 0} VND
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t("quantity")}: {item.quantity}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                {!order.is_feedback && (
                  <button
                    onClick={() => handleClickFeedback(order.id)}
                    className="border border-gray-300 text-[14px] flex items-center gap-2 px-3 py-1 rounded-md text-gray-800"
                  >
                    {t("feedback")}
                  </button>
                )}

                <div>
                  <span className="text-[14px] text-gray-500">
                    {t("total")}:{" "}
                  </span>
                  <span className="text-green-800 font-semibold">
                    {order.total_amount.toLocaleString("vi-VN") ?? 0} VND
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic mt-5">
            {t("noOrders")}
          </p>
        )}
      </div>

      {show && (
        <FeedbackForm onClose={() => setShow(false)} orderId={orderId} />
      )}
    </>
  );
}
