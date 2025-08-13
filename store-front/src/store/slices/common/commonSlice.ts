import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";

interface CommonState {
  storeId: string;
  tableId: string;
  actorId: string;
  searchGlobalData: string;
  searchTrigger: number;
}

const initialState: CommonState = {
  storeId: "",
  tableId: "",
  actorId: "",
  searchGlobalData: "",
  searchTrigger: 0,
};

if (typeof window !== "undefined") {
  initialState.storeId = localStorage.getItem("storeFrontId") || "";
  initialState.tableId = localStorage.getItem("tableStoreId") || "";
  initialState.actorId = localStorage.getItem("actorId") || "";
}

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setStoreId(state, action: PayloadAction<string>) {
      state.storeId = action.payload;
    },
    setTableId(state, action: PayloadAction<string>) {
      state.tableId = action.payload;
    },
    setSearchGlobalData(state, action: PayloadAction<string>) {
      state.searchGlobalData = action.payload;
    },
    setSearchTrigger(state) {
      state.searchTrigger += 1;
    },
    resetCommonState() {
      return initialState;
    },
  },
});

export const {
  setStoreId,
  setTableId,
  resetCommonState,
  setSearchGlobalData,
  setSearchTrigger,
} = commonSlice.actions;
export default commonSlice.reducer;
