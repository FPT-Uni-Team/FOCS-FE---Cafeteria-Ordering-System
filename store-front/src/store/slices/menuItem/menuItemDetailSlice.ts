import { Product } from "@/types/menuItem";
import { createSlice } from "@reduxjs/toolkit";

interface MenuItemDetail {
  loading: boolean;
  success: boolean;
  error: string | null;
  menuItem: Product;
}

const initialState: MenuItemDetail = {
  loading: true,
  success: false,
  error: null,
  menuItem: {
    id: "",
    name: "",
    description: "",
    images: [],
    base_price: 0,
    categories: [],
    is_available: false,
    variant_groups: [],
  },
};

const menuItemDetailSlice = createSlice({
  name: "menuItemDetail",
  initialState,
  reducers: {
    fetchMenuItemDetailStart: {
      reducer: (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      },
      prepare: (payload: string) => ({ payload }),
    },
    fetchMenuItemDetailSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.menuItem = action.payload;
    },
    fetchMenuItemDetailFailed: (state) => {
      state.loading = false;
      state.success = false;
    },
  },
});

export const {
  fetchMenuItemDetailStart,
  fetchMenuItemDetailSuccess,
  fetchMenuItemDetailFailed,
} = menuItemDetailSlice.actions;

export default menuItemDetailSlice.reducer;
