import { combineReducers } from "@reduxjs/toolkit";
import commonReducer from "./slices/common/commonSlice";
import menuItemSlice from "./slices/cart/cartSlice";
import menuItemDetailSlice from "./slices/menuItem/menuItemDetailSlice";
import checkoutSlice from "./slices/cart/checkoutSlice";

const rootReducer = combineReducers({
  common: commonReducer,
  cartItem: menuItemSlice,
  menuItemDetail: menuItemDetailSlice,
  checkoutSlice: checkoutSlice,
});

export default rootReducer;
