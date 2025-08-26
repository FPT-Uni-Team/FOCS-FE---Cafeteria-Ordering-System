import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";
import { defaultParams, ListPageParams } from "@/types/common";

const productService = {
  list: (params: ListPageParams) =>
    axiosClient.post(endpoints.menuItem.list(), params),
  listByIds: (params: string[]) =>
    axiosClient.post(endpoints.menuItem.listByIds(), params),
  menuItemDetail: (params: string) =>
    axiosClient.get(endpoints.menuItem.detail(params)),
  menuItemImage: (params: string) =>
    axiosClient.get(endpoints.menuItem.images(params)),
  menuItemGroups: (params: string) =>
    axiosClient.get(endpoints.menuItem.variantGroups(params)),
  menuItemCategory: (params: string) =>
    axiosClient.post(endpoints.menuItem.menuItemCategory(params)),
  mostOrder: () => axiosClient.post(endpoints.menuItem.mostOrder()),
  basedOnHistory: () => axiosClient.post(endpoints.menuItem.basOnHistory()),
  productFeedback: (params: string) =>
    axiosClient.post(endpoints.menuItem.productFeedback(params)),
  couponValid: () =>
    axiosClient.post(endpoints.coupon.couponValid(), defaultParams(1000, 1)),
};

export default productService;
