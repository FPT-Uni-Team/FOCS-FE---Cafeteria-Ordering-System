import { CartItemType, tableCart } from "@/types/cart";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItemState {
  cartItems: CartItemType[];
  loading: boolean;
  error: string | null;
}

const initialState: CartItemState = {
  cartItems: [],
  loading: false,
  error: null,
};

const menuItemSlice = createSlice({
  name: "menuItemList",
  initialState,
  reducers: {
    fetchCartItemsStart: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (params?: tableCart) => {
        return {
          payload: params,
        };
      },
    },
    fetchCartItemsSuccess: (
      state,
      action: PayloadAction<{
        cartItems: CartItemType[];
      }>
    ) => {
      state.loading = false;
      state.cartItems = action.payload.cartItems;
    },
    fetchCartItemsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.cartItems = [];
    },
  },
});

export const {
  fetchCartItemsStart,
  fetchCartItemsSuccess,
  fetchCartItemsFailure,
} = menuItemSlice.actions;
export default menuItemSlice.reducer;
