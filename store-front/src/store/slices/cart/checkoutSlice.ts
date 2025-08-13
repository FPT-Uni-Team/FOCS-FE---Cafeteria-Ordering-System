import { CheckoutRequest, CheckoutResponse } from "@/types/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  loading: boolean;
  error: string | null;
  data: CheckoutResponse | null;
  success: boolean;
}

const initialState: CheckoutState = {
  loading: false,
  error: null,
  data: null,
  success: false,
};

export interface CheckoutPayload {
  actorId: string;
  data: CheckoutRequest;
}

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    checkoutStart: {
      reducer(state) {
        state.loading = true;
        state.error = null;
      },
      prepare(payload: CheckoutPayload) {
        return { payload };
      },
    },
    checkoutSuccess(state, action: PayloadAction<CheckoutResponse>) {
      state.loading = false;
      state.data = action.payload;
      state.success = true;
    },
    checkoutFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetCheckoutState(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.success = false;
    },
  },
});

export const {
  checkoutStart,
  checkoutSuccess,
  checkoutFailed,
  resetCheckoutState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
