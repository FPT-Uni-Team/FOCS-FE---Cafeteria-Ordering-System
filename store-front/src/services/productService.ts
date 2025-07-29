import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";
import { ListPageParams } from "@/types/common";

const productService = {
  list: (params: ListPageParams) =>
    axiosClient.post(endpoints.menuItem.list(), params),
  listByIds: (params: string[]) =>
    axiosClient.post(endpoints.menuItem.listByIds(), params),
};

export default productService;
