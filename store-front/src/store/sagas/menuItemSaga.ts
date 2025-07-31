import { call, put, takeLatest, type Effect } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";

import {
  fetchMenuItemDetailFailed,
  fetchMenuItemDetailStart,
  fetchMenuItemDetailSuccess,
} from "../slices/menuItem/menuItemDetailSlice";
import productService from "@/services/productService";
import { Category, Product, VariantGroup } from "@/types/menuItem";

const { menuItemDetail, menuItemImage, menuItemGroups, menuItemCategory } =
  productService;

function* fetchMenuItemDetail(
  action: PayloadAction<string>
): Generator<Effect, void, AxiosResponse<unknown>> {
  try {
    const response = yield call(() => menuItemDetail(action.payload));
    const menuItemDetailData = response.data as Product;
    const responseImage = yield call(() => menuItemImage(action.payload));
    menuItemDetailData.images = responseImage.data as [];
    const responseVariant = yield call(() => menuItemGroups(action.payload));
    menuItemDetailData.variant_groups = responseVariant.data as VariantGroup[];
    const responseCategory = yield call(() => menuItemCategory(action.payload));
    menuItemDetailData.categories = responseCategory.data as Category[];
    yield put(fetchMenuItemDetailSuccess(menuItemDetailData));
  } catch {
    yield put(fetchMenuItemDetailFailed());
  }
}

export function* watchMenuItemSaga() {
  yield takeLatest(fetchMenuItemDetailStart.type, fetchMenuItemDetail);
}
