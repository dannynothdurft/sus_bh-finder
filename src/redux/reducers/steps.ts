import { createSlice } from "@reduxjs/toolkit";

export const steps = createSlice({
  name: "steps",
  initialState: {
    step1: undefined,
    step2: undefined,
  },
  reducers: {
    incrementStep1(state, action) {
      state.step1 = action.payload;
    },
    incrementStep2(state, action) {
      state.step2 = action.payload;
    },
  },
});

export const { incrementStep1, incrementStep2 } = steps.actions;

export default steps.reducer;
