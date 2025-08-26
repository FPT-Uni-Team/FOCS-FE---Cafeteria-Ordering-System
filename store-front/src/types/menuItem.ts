export type Variant = {
  id: string;
  name: string;
  price: number;
  prep_per_time: number;
  quantity_per_time: number;
  is_available: boolean;
  isSelected?: boolean;
};

export type VariantGroup = {
  id: string;
  name: string;
  variant: Variant[];
  variants?: Variant[];
  is_required: boolean;
  min_select: number;
  max_select: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
};

export interface ImageType {
  url: string;
  is_main?: boolean;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[] | ImageType[] | string;
  base_price: number;
  is_available: boolean;
  variant_groups: VariantGroup[];
  categories: Category[];
  feedbacks?: FeedbackDTO[];
};

export type CartItem = Product & {
  quantity: number;
  note?: string;
};
export interface CartItemInputVariant {
  variant_id: string;
  quantity: number;
}

export interface CartItemInput {
  menu_item_id: string;
  variants: CartItemInputVariant[];
  quantity: number;
}

export interface OrderItem {
  menuItemId: string;
  variantId: string;
  quantity: number;
  note?: string;
}

export interface FeedbackDTO {
  id: string;
  order_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  is_public: boolean;
  reply?: string;
  created_at: string;
}
