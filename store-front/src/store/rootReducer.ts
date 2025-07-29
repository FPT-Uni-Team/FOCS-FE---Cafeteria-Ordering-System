import { combineReducers } from "@reduxjs/toolkit";
import commonReducer from "./slices/common/commonSlice";
import menuItemSlice from "./slices/cart/cartSlice";

const rootReducer = combineReducers({
  common: commonReducer,
  cartItem: menuItemSlice,
});

export default rootReducer;
