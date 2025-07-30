import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";
import { cartItem, tableCart } from "@/types/cart";
import { CartItemInput } from "@/types/menuItem";

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
  delete: (dataTable: tableCart, dataCart: CartItemInput) => {
    return axiosClient.delete(endpoints.cart.delete(dataTable), {
      data: dataCart,
    });
  },
};

export default cartService;
