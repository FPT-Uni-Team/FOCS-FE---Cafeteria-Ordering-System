import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";

interface CommonState {
  storeId: string;
  tableId: string;
  actorId: string;
  searchGlobalData: string;
  searchTrigger: number;
  prevNavigate: string;
}

const initialState: CommonState = {
  storeId: "550e8400-e29b-41d4-a716-446655440000",
  tableId: "94690db9-5c86-4fcc-b485-1ee69b3875c0",
  actorId: "f3c3b4e8-2b7f-4f47-b6a1-0ec2b7a5f8a1",
  searchGlobalData: "",
  searchTrigger: 0,
  prevNavigate: "/en/product-list",
};

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
    setPrevNavigate(state, action: PayloadAction<string>) {
      state.prevNavigate = action.payload;
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
  setPrevNavigate,
} = commonSlice.actions;
export default commonSlice.reducer;
