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
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  const handleTouchStart = (e: React.TouchEvent, _id: string) => {
    console.log(_id);
    const touch = e.touches[0];
    (e.target as HTMLElement).setAttribute(
      "data-start-x",
      touch.clientX.toString()
    );
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    const touch = e.changedTouches[0];
    const startX = parseFloat(
      (e.target as HTMLElement).getAttribute("data-start-x") || "0"
    );
    const deltaX = touch.clientX - startX;

    if (deltaX > 80) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSwipedItemId(null);
    }
  };

  useSignalR({
    hubUrl: endpoints.cart.hub({ storeId, tableId }),
    onReceiveUpdate: () => {
      dispatch(fetchCartItemsStart({ actorId, tableId }));
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
    const calculatedSubtotal = items.reduce((sum, item) => {
      const variantTotal =
        item.variant_groups?.reduce((vgSum, vg) => {
          return (
            vgSum +
            vg.variant
              .filter((v) => v.isSelected)
              .reduce((vSum, v) => vSum + v.price, 0)
          );
        }, 0) || 0;
      const itemTotal = (item.base_price + variantTotal) * item.quantity;
      return sum + itemTotal;
    }, 0);
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
          <div className="space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex relative gap-2 transition-transform duration-200 ease-in-out ${
                  swipedItemId === item.id ? "translate-x-20" : ""
                }`}
                onTouchStart={(e) => handleTouchStart(e, item.id)}
                onTouchEnd={(e) => handleTouchEnd(e, item.id)}
              >
                <Image
                  src={
                    (item.images as string) || "/img/profile/default-avatar.jpg"
                  }
                  alt={item.name}
                  width={84}
                  height={84}
                  className="rounded-xl object-cover"
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
                    <p className="text-green-800 text-md font-semibold">
                      {(
                        item.base_price +
                        (item.variant_groups?.reduce((vgSum, vg) => {
                          return (
                            vgSum +
                            vg.variant
                              .filter((v) => v.isSelected)
                              .reduce((vSum, v) => vSum + v.price, 0)
                          );
                        }, 0) || 0)
                      )
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        })
                        .replace("₫", "VND")}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="leading-5">
                      <span className="text-gray-600 text-[10px]">QTY:</span>
                      <span className="font-semibold text-black text-[10px]">
                        {item.quantity.toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 absolute bottom-2 right-2">
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
            ))}
          </div>
          <div className="fixed bottom-[80px] h-[70px] left-0 right-0 bg-white">
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
