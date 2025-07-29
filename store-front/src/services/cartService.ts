import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";
import { cartItem, tableCart } from "@/types/cart";

const cartService = {
  add: (cartItem: cartItem, dataTable: tableCart, token?: string) => {
    return axiosClient.post(endpoints.cart.addToCart(dataTable), cartItem, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  get: (dataTable: tableCart) => {
    return axiosClient.post(endpoints.cart.get(dataTable));
  },
};

export default cartService;
