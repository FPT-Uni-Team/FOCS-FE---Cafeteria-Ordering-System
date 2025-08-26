"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Title from "../common/Title";
import { CartItem, CartItemInput, Product } from "@/types/menuItem";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useSignalR } from "@/hooks/useSignalR";
import endpoints from "@/api/endpoint";
import { fetchCartItemsStart } from "@/store/slices/cart/cartSlice";
import ProductSkeleton from "../common/ProductSkeleton";

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { MdDeleteOutline } from "react-icons/md";
import { cartItem, CheckoutRequest, SubmitPayload } from "@/types/cart";
import ProductModalCart from "../product-list/ProductModalCart";
import cartService from "@/services/cartService";
import LoadingOverlay from "../common/LoadingOverlay";
import { useRouter } from "next/navigation";
import {
  checkoutStart,
  setSelectedCartItems,
} from "@/store/slices/cart/checkoutSlice";
import { makeHref } from "@/utils/common/common";
import toast from "react-hot-toast";

export default function Cart() {
  const t = useTranslations("cart");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cartItem);
  const { actorId, tableId, storeId } = useAppSelector((state) => state.common);
  const { loading, success: successCheckout } = useAppSelector(
    (state) => state.checkoutSlice
  );
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [selectedCartItem, setSelectedCartItem] = useState<CartItem>({
    id: "",
    name: "",
    description: "",
    base_price: 0,
    images: "/img/profile/default-avatar.jpg",
    variant_groups: [],
    categories: [],
    quantity: 1,
    note: "",
    is_available: true,
  } as CartItem);

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((i) => i.id));
    }
  };

  const handleVariantClick = (item: CartItem) => {
    setSelectedCartItem(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSubmit = async (product: SubmitPayload) => {
    try {
      await handleRemove({ itemId: product.menu_item_id, typeRemove: "all" });
      const data = {
        menu_item_id: product.menu_item_id,
        variants: product.variant_ids.map((id) => ({
          variant_id: id,
          quantity: 1,
        })),
        quantity: product.quantity,
        note: product.note,
      };
      await cartService.add(data as cartItem, { actorId, tableId });
    } catch {
      throw new Error("");
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) return;

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    dispatch(setSelectedCartItems(selectedCartItems));

    const checkoutData: CheckoutRequest = {
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
      point: 0,
      is_use_point: true,
    };

    await dispatch(
      checkoutStart({
        actorId,
        data: checkoutData,
      })
    );
  };

  const convertCartItemToProduct = (cartItem: CartItem): Product => {
    return {
      id: cartItem.id,
      name: cartItem.name,
      description: cartItem.description || "",
      base_price: cartItem.base_price,
      images: cartItem.images,
      variant_groups: cartItem.variant_groups.map((vg) => ({
        ...vg,
        variant: vg.variant.map((v) => ({
          ...v,
          is_available: true,
        })),
      })),
      categories: cartItem.categories,
      is_available: true,
    };
  };

  const getInitialData = (cartItem: CartItem) => {
    const selectedVariants = cartItem.variant_groups.flatMap((group) =>
      group.variant.filter((v) => v.isSelected).map((v) => v.id)
    );

    return {
      quantity: cartItem.quantity,
      note: cartItem.note || "",
      selectedVariants,
    };
  };

  const handleRemove = async ({
    itemId,
    typeRemove = "all",
    numberRemove = 1,
  }: {
    itemId: string;
    typeRemove?: "all" | "single";
    numberRemove?: number;
  }) => {
    try {
      const itemToRemove = items.find((item) => item.id === itemId);
      if (!itemToRemove) return;

      const variants = itemToRemove.variant_groups.flatMap((group) =>
        group.variant
          .filter((v) => v.isSelected)
          .map((v) => ({
            variant_id: v.id,
            quantity: 1,
          }))
      );

      const dataCart: CartItemInput = {
        menu_item_id: itemToRemove.id,
        variants,
        quantity:
          typeRemove == "all"
            ? itemToRemove.quantity
            : itemToRemove.quantity - numberRemove,
      };
      const dataTable = {
        tableId,
        actorId,
      };
      await cartService.delete(dataTable, dataCart);
    } catch {
    } finally {
      setIsRemoving(false);
    }
  };

  const trailingActions = (itemId: string) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={async () => {
          setIsRemoving(true);
          await handleRemove({ itemId: itemId, typeRemove: "all" });
          toast.success(t("removeSuccess"));
        }}
      >
        <div className="bg-red-500 flex items-center text-white">
          <MdDeleteOutline size={20} className="w-full" />
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  useSignalR({
    hubUrl: endpoints.cart.hub({ storeId, tableId }),
    onReceiveUpdate: () => {
      dispatch(fetchCartItemsStart({ actorId, tableId }));
    },
  });

  useEffect(() => {
    const calculatedSubtotal = items.reduce((sum, item) => {
      if (!selectedItems.includes(item.id)) return sum;

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
  }, [items, selectedItems]);

  useEffect(() => {
    if (successCheckout) {
      router.push(makeHref("checkout"));
    }
  }, [dispatch, router, successCheckout]);

  useEffect(() => {
    setItems(cartItems);
    setIsLoading(false);
  }, [cartItems]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchCartItemsStart({ actorId, tableId }));
  }, []);

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-transparent flex items-center justify-center">
          <LoadingOverlay visible={true} />
        </div>
      )}
      <Title titleKey="cart" itemCount={items.length} />
      <LoadingOverlay visible={isRemoving} />
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
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={
                selectedItems.length === items.length && items.length > 0
              }
              className="accent-green-700 cursor-pointer"
              onChange={handleSelectAll}
            />
            <span className="text-sm text-gray-700">Select All</span>
          </div>
          <SwipeableList
            threshold={0.3}
            className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-3 pb-2"
          >
            {items.map((item) => (
              <SwipeableListItem
                key={item.id}
                trailingActions={trailingActions(item.id)}
              >
                <div key={item.id} className="flex relative gap-2 w-full">
                  <input
                    type="checkbox"
                    className="mt-2 accent-green-700 cursor-pointer"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleToggleSelect(item.id)}
                  />
                  <Image
                    src={
                      (item.images as string) ||
                      "/img/product/image-not-available.png"
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
                        <p className="text-sm text-gray-500 truncate max-w-[150px]">
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
                      <p
                        className="text-green-800 text-md font-semibold"
                        onClick={() => handleVariantClick(item)}
                      >
                        {item.base_price +
                          (item.variant_groups?.reduce((vgSum, vg) => {
                            return (
                              vgSum +
                              vg.variant
                                .filter((v) => v.isSelected)
                                .reduce((vSum, v) => vSum + v.price, 0)
                            );
                          }, 0) || 0)}
                        VND
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
                  </div>
                </div>
              </SwipeableListItem>
            ))}
          </SwipeableList>
          <div className="fixed bottom-[80px] h-[70px] left-0 right-0 bg-white">
            <div className="p-4 flex justify-between items-center border-t border-gray-300">
              <span className="text-sm font-bold text-gray-900">
                {total} VND
              </span>
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className={`rounded-xl font-semibold text-sm py-2 px-10 bg-green-800
                ${
                  selectedItems.length === 0
                    ? "opacity-70 cursor-not-allowed"
                    : "text-white"
                }`}
              >
                {t("checkout")}
              </button>
            </div>
          </div>
          {selectedCartItem && (
            <ProductModalCart
              product={convertCartItemToProduct(selectedCartItem)}
              show={showModal}
              onClose={handleModalClose}
              onSubmit={handleModalSubmit}
              initialData={
                selectedCartItem.id
                  ? getInitialData(selectedCartItem)
                  : undefined
              }
            />
          )}
        </>
      )}
    </div>
  );
}
