import { createSlice } from "@reduxjs/toolkit";

export const filter = createSlice({
  name: "filter",
  initialState: {
    filterSize: false,
  },
  reducers: {
    incrementFilterSize(state, action) {
      state.filterSize = action.payload;
    },
  },
});

export const { incrementFilterSize } = filter.actions;

export default filter.reducer;
