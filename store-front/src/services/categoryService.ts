import { ListPageParams } from "@/types/common";
import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

const categoryService = {
  getListCategories: (
    params: ListPageParams,
    headers: Record<string, string> = {}
  ) => {
    return axiosClient.post(endpoints.category.list(), params, { headers });
  },
};

export default categoryService;
