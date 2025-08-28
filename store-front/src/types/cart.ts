import { Product } from "./menuItem";

export interface cartItem {
  menu_item_id: string;
  variants: [];
  quantity: number;
  note: string;
}

export interface tableCart {
  tableId: string;
  actorId: string;
}

export type SubmitPayload = {
  menu_item_id: string;
  variant_ids: string[];
  quantity: number;
  note: string;
};

export type CartItemType = Product & {
  quantity: number;
  note: string;
  uniqueId?: string;
};

export interface VariantCheckout {
  variant_id: string;
  quantity: number;
}
export interface CheckoutItem {
  menuItemId: string;
  variants: VariantCheckout[];
  quantity: number;
  note: string;
}

export interface CheckoutRequest {
  store_id: string;
  actor_id?: string;
  table_id: string;
  items: CheckoutItem[];
  note?: string;
  coupon_code?: string;
  point?: number;
  is_use_point?: boolean;
}

export interface CheckoutResponse {
  tax_amount?: number;
  total_discount: number;
  total_price: number;
  applied_coupon_code?: string;
  applied_promotions: string[];
  item_discount_details: ItemDiscountDetail[];
  messages: string[];
  is_discount_applied: boolean;
  order_code: string | null;
}

export interface ItemDiscountDetail {
  item_code: string;
  item_name: string;
  quantity: number;
  discount_amount: number;
  source: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface OrderRequest {
  store_id: string;
  table_id: string;
  items: CheckoutItem[];
  note: string;
  coupon_code: string;
  customer_info: CustomerInfo;
  is_use_point: boolean;
  point: number;
  discount: CheckoutResponse;
  payment_type: number;
  order_type: number;
}

export type OrderRequestPayment = {
  order_code: number;
  amount: number;
  description?: string;
  items?: string;
  table_id?: string;
};
