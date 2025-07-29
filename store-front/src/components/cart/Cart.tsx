"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Title from "../common/Title";
import { CartItem } from "@/types/menuItem";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useSignalR } from "@/hooks/useSignalR";
import endpoints from "@/api/endpoint";
import { fetchCartItemsStart } from "@/store/slices/cart/cartSlice";
import ProductSkeleton from "../common/ProductSkeleton";

export default function Cart() {
  const t = useTranslations("cart");
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cartItem);
  const { actorId, tableId, storeId } = useAppSelector((state) => state.common);
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useSignalR({
    hubUrl: endpoints.cart.hub({ storeId, tableId }),
    onReceiveUpdate: (data) => {
      console.log("📡 Realtime update:", data);
    },
  });

  useEffect(() => {
    setItems(cartItems);
    setIsLoading(false);
  }, [cartItems]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchCartItemsStart({ actorId, tableId }));
  }, []);

  const handleQuantityChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  useEffect(() => {
    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.base_price,
      0
    );
    setTotal(calculatedSubtotal);
  }, [items]);

  return (
    <div className="relative">
      <Title titleKey="cart" itemCount={items.length} />
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500 py-10">{t("empty")}</p>
      ) : (
        <>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex relative gap-2">
                <Image
                  src={item.images?.[0] || "/img/profile/default-avatar.jpg"}
                  alt={item.name}
                  width={84}
                  height={84}
                  className="rounded-xl object-cover"
                />
                <div className="flex rounded-xl bg-gray-100 p-2 flex-1 justify-between">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h1 className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {item.categories?.map((cat) => cat.name).join(", ")}
                      </p>
                    </div>
                    <p className="text-green-800 text-md font-semibold">
                      {item.base_price
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        })
                        .replace("₫", "VND")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">QTY:</span>
                      <span className="font-medium text-black text-sm">
                        {item.quantity.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-6">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className=" text-black "
                      >
                        <CiCircleMinus />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className=" text-black"
                      >
                        <CiCirclePlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-[80px] left-0 right-0">
            <div className="p-4 flex justify-between items-center border-t border-gray-300">
              <span className="text-sm font-bold text-gray-900">
                {total
                  .toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  })
                  .replace("₫", "VND")}
              </span>
              <button className="bg-green-800 text-white rounded-xl font-semibold text-sm py-2 px-10">
                {t("checkout")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
