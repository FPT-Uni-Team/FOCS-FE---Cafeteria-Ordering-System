import { ListPageParams } from "@/types/common";
import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

const orderService = {
  getListOrders: (params: ListPageParams) =>
    axiosClient.post(endpoints.order.list(), params),
  getDetailOrder: (params: string) =>
    axiosClient.get(endpoints.order.detail(params)),
  feedback: (data: FormData) =>
    axiosClient.post(endpoints.order.feedback(), data),
};

export default orderService;
