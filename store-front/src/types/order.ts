export interface OrderDetail {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  variant_id: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  note: string;
  variants?: { variant_id: string; variant_name: string }[];
  images?: { url: string; is_main: boolean }[];
}

export interface Order {
  id: string;
  order_code: string;
  user_id: string;
  order_status: number;
  order_type: number;
  payment_status: number;
  sub_total_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  customer_note: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_feedback: boolean;
  order_details: OrderDetail[];
  discount_note?: string;
}

export interface OrderListResponse {
  total_count: number;
  page_index: number;
  page_size: number;
  items: Order[];
}
