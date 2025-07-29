export type Variant = {
  id: string;
  name: string;
  price: number;
  prep_per_time: number;
  quantity_per_time: number;
  is_available: boolean;
};

export type VariantGroup = {
  id: string;
  name: string;
  variant: Variant[];
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

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[] | string;
  base_price: number;
  is_available: boolean;
  variant_groups: VariantGroup[];
  categories: Category[];
};

export type CartItem = Product & {
  quantity: number;
  note?: string;
};
