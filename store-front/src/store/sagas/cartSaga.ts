import { call, Effect, put, takeLatest } from "redux-saga/effects";
import {
  fetchCartItemsFailure,
  fetchCartItemsStart,
  fetchCartItemsSuccess,
} from "../slices/cart/cartSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import cartService from "@/services/cartService";
import { cartItem, CheckoutResponse, tableCart } from "@/types/cart";
import productService from "@/services/productService";
import { Product } from "@/types/menuItem";
import {
  checkoutFailed,
  CheckoutPayload,
  checkoutStart,
  checkoutSuccess,
} from "../slices/cart/checkoutSlice";

function* fetchCartItemList(
  action: PayloadAction<tableCart>
): Generator<Effect, void, AxiosResponse> {
  try {
    const response = yield call(() => cartService.get(action.payload));
    const menuItemIds: string[] = response.data.map(
      (item: cartItem) => item.menu_item_id
    );
    const responseMenuData = yield call(() =>
      productService.listByIds([...new Set(menuItemIds)])
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputMap = response.data.reduce((acc: any, item: cartItem) => {
      if (!acc[item.menu_item_id]) {
        acc[item.menu_item_id] = [];
      }
      acc[item.menu_item_id].push(item);
      return acc;
    }, {} as Record<string, cartItem[]>);
    const mergedData = (responseMenuData.data as Product[]).flatMap(
      (product) => {
        const cartItems = inputMap[product.id] || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return cartItems.map((cartItem: any, index: number) => {
          const selectedVariantIds = new Set(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cartItem.variants.map((v: any) => v.variant_id)
          );
          const uniqueId =
            `${cartItem.menu_item_id}-` +
            `${
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cartItem.variants.map((v: any) => v.variant_id).join("-") ||
              "no-variant"
            }-` +
            `${cartItem.note || "no-note"}-${index}`;
          return {
            ...product,
            quantity: cartItem.quantity,
            note: cartItem.note,
            uniqueId,
            variant_groups: product.variant_groups.map((group) => ({
              ...group,
              variant: group.variant.map((v) => ({
                ...v,
                isSelected: selectedVariantIds.has(v.id),
              })),
            })),
          };
        });
      }
    );
    yield put(fetchCartItemsSuccess({ cartItems: mergedData }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch";
    yield put(fetchCartItemsFailure(errorMessage));
  }
}

function* handleCheckoutSaga(
  action: PayloadAction<CheckoutPayload>
): Generator<Effect, void, AxiosResponse<CheckoutResponse>> {
  try {
    const response = yield call(() =>
      cartService.checkout(action.payload.actorId, action.payload.data)
    );
    yield put(checkoutSuccess(response.data));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    yield put(checkoutFailed(err.response.data.message || "Checkout failed"));
  }
}

export function* watchMenuSaga() {
  yield takeLatest(fetchCartItemsStart.type, fetchCartItemList);
  yield takeLatest(checkoutStart.type, handleCheckoutSaga);
}
