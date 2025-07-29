import { call, Effect, put, takeLatest } from "redux-saga/effects";
import {
  fetchCartItemsFailure,
  fetchCartItemsStart,
  fetchCartItemsSuccess,
} from "../slices/cart/cartSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import cartService from "@/services/cartService";
import { cartItem, tableCart } from "@/types/cart";
import productService from "@/services/productService";
import { Product } from "@/types/menuItem";

function* fetchCartItemList(
  action: PayloadAction<tableCart>
): Generator<Effect, void, AxiosResponse> {
  try {
    const response = yield call(() => cartService.get(action.payload));
    const menuItemIds = response.data.map(
      (item: cartItem) => item.menu_item_id
    );
    const responseMenuData = yield call(() =>
      productService.listByIds(menuItemIds)
    );
    const inputMap = new Map(
      response.data.map((item: cartItem) => [item.menu_item_id, item])
    );

    const mergedData = (responseMenuData.data as Product[]).map((item) => {
      const input = inputMap.get(item.id);
      const selectedVariantIds = new Set(
        ((input as cartItem) || [])?.variants.map(
          (v: { variant_id: string; quantity: number }) => v.variant_id
        )
      );
      return {
        ...item,
        quantity: ((input as cartItem) || [])?.quantity ?? 0,
        note: ((input as cartItem) || [])?.note ?? "",
        variant_groups: item.variant_groups.map((group) => ({
          ...group,
          variant: group.variant.map((v) => ({
            ...v,
            isSelected: selectedVariantIds.has(v.id),
          })),
        })),
      };
    });
    yield put(fetchCartItemsSuccess({ cartItems: mergedData }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch";
    yield put(fetchCartItemsFailure(errorMessage));
  }
}

export function* watchMenuSaga() {
  yield takeLatest(fetchCartItemsStart.type, fetchCartItemList);
}
