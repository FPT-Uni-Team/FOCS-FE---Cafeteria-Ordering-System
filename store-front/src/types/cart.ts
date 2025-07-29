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
};
