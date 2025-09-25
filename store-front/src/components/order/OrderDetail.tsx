"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Title from "../common/Title";
import { useTranslations } from "next-intl";
import { OrderDetailSkeleton } from "../common/OrderDetailSkeleton";
import orderService from "@/services/orderService";
import { useParams } from "next/navigation";
import { Order } from "@/types/order";

export default function OrderDetail() {
  const t = useTranslations("order-detail");
  const params = useParams();
  const orderId = params?.id;
  const [order, setOrder] = useState<Order>();

  const fetchOrders = async () => {
    try {
      const res = await orderService.getDetailOrder(orderId as string);
      setOrder(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orderId]);

  return (
    <>
      <Title titleKey="order-detail" showBackButton center />
      {!order ? (
        <OrderDetailSkeleton />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-4 space-y-2 mb-4 relative">
            <p className="text-sm text-gray-500">
              #<span className="font-medium">{order.order_code}</span>
            </p>
            <p className="text-xs text-gray-400">
              {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
            <p className="text-green-700 text-sm font-semibold absolute top-4 right-4">
              {t(`status.${order.order_status}`)}
            </p>
            {order.customer_note && (
              <p className="text-sm text-gray-600">
                {t("note")}: {order.customer_note}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            {order.order_details.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 border-b last:border-none pb-3 last:pb-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                    <p className="font-medium text-gray-800">
                      {item.menu_item_name}
                    </p>
                    {item.variants && (
                      <p className="text-xs text-gray-500">
                        {item.variants
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          .map((v: any) => v.variant_name)
                          .join(", ")}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-xs text-gray-400 italic">
                        {item.note}
                      </p>
                    )}
                  </div>
                  <p className="text-green-800 text-sm font-semibold">
                    {item.unit_price.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {t("quantity")}: {item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-4 mt-4 space-y-2 text-sm text-gray-800">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="font-semibold">
                {order.sub_total_amount.toLocaleString("vi-VN")} VND
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("tax")}</span>
              <span className="font-semibold">
                {order.tax_amount.toLocaleString("vi-VN")} VND
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("discount")}</span>
              <span className="text-red-600 font-semibold">
                - {order.discount_amount.toLocaleString("vi-VN")} VND
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span className="text-sm font-bold text-green-800">
                {t("total")}
              </span>
              <span>{order.total_amount.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
