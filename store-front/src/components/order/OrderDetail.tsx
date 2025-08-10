"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Title from "../common/Title";
import { useTranslations } from "next-intl";
import { OrderDetailSkeleton } from "../common/OrderDetailSkeleton";

const fakeOrderDetail = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  order_code: "ORD-2025-0001",
  user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  order_status: 0,
  order_type: 0,
  payment_status: 0,
  sub_total_amount: 100000,
  tax_amount: 10000,
  discount_amount: 5000,
  total_amount: 105000,
  customer_note: "Giao hàng trước 6h tối",
  created_at: "2025-08-10T07:59:07.460Z",
  created_by: "Admin",
  updated_at: "2025-08-10T07:59:07.460Z",
  updated_by: "Admin",
  order_details: [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      menu_item_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      menu_item_name: "Trà sữa trân châu",
      variant_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      variant_name: "Size L",
      quantity: 2,
      unit_price: 50000,
      total_price: 100000,
      note: "Ít đá, thêm đường",
    },
  ],
};

export default function OrderDetail() {
  const t = useTranslations("order-detail");
  const [order, setOrder] = useState<typeof fakeOrderDetail | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setOrder(fakeOrderDetail);
    }, 1500);
  }, []);

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
                    src={"/img/profile/default-avatar.jpg"}
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
                    {item.variant_name && (
                      <p className="text-xs text-gray-500">
                        {item.variant_name}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-xs text-gray-400 italic">
                        {item.note}
                      </p>
                    )}
                  </div>
                  <p className="text-green-800 text-sm font-semibold">
                    {item.total_price} VND
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
                {order.sub_total_amount} VND
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("tax")}</span>
              <span className="font-semibold">{order.tax_amount} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("discount")}</span>
              <span className="text-red-600 font-semibold">
                - {order.discount_amount} VND
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span className="text-sm font-bold text-green-800">
                {t("total")}
              </span>
              <span>{order.total_amount} VND</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
