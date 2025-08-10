import { OrderListResponse } from "@/types/order";

export const fakeOrders: OrderListResponse = {
  total_count: 1,
  page_index: 1,
  page_size: 10,
  items: [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      order_code: "ORD-2025-0001",
      user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      order_status: 0,
      order_type: 0,
      payment_status: 0,
      sub_total_amount: 100000,
      tax_amount: 10000,
      discount_amount: 5000,
      total_amount: 105000,
      customer_note: "Giao hàng trước 6h tối",
      created_at: "2025-08-10T07:11:53.281Z",
      created_by: "Admin",
      updated_at: "2025-08-10T07:11:53.281Z",
      updated_by: "Admin",
      order_details: [
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          menu_item_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          menu_item_name: "Trà sữa trân châu",
          variant_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          variant_name: "Size L",
          quantity: 2,
          unit_price: 50000,
          total_price: 100000,
          note: "Ít đá, thêm đường",
        },
      ],
    },
  ],
};
