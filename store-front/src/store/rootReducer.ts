import { combineReducers } from "@reduxjs/toolkit";
import commonReducer from "./slices/common/commonSlice";
import menuItemSlice from "./slices/cart/cartSlice";
import menuItemDetailSlice from "./slices/menuItem/menuItemDetailSlice";

const rootReducer = combineReducers({
  common: commonReducer,
  cartItem: menuItemSlice,
  menuItemDetail: menuItemDetailSlice,
});

export default rootReducer;
