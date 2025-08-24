import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";
import { ListPageParams } from "@/types/common";

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
};

export default productService;
