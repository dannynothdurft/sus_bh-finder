import { createSlice } from "@reduxjs/toolkit";

export const steps = createSlice({
  name: "steps",
  initialState: {
    step1: undefined,
  },
  reducers: {
    incrementStep1(state, action) {
      state.step1 = action.payload;
    },
  },
});

export const { incrementStep1 } = steps.actions;

export default steps.reducer;
