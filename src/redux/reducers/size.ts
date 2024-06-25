import { createSlice } from "@reduxjs/toolkit";

export const sizes = createSlice({
  name: "sizes",
  initialState: {
    sizes: false,
  },
  reducers: {
    incrementSize(state, action) {
      state.sizes = action.payload;
    },
  },
});

export const { incrementSize } = sizes.actions;

export default sizes.reducer;
