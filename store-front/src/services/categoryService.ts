import { ListPageParams } from "@/types/common";
import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

const categoryService = {
  getListCategories: (params: ListPageParams) =>
    axiosClient.post(endpoints.category.list(), params),
};

export default categoryService;
