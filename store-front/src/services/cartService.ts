import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";
import {
  cartItem,
  CheckoutRequest,
  OrderRequest,
  OrderRequestPayment,
  tableCart,
} from "@/types/cart";
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
  checkout: (actorId: string, dataCheckout: CheckoutRequest) => {
    return axiosClient.post(
      endpoints.checkout.apply_discount({ actorId }),
      dataCheckout
    );
  },
  create_order: (data: OrderRequest) => {
    return axiosClient.post(endpoints.checkout.create_cart(), data);
  },
  payment_order: (data: OrderRequestPayment) => {
    return axiosClient.post(endpoints.checkout.payment(), data);
  },
};

export default cartService;
