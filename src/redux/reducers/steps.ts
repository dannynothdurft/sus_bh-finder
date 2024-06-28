import { createSlice } from "@reduxjs/toolkit";

export const steps = createSlice({
  name: "steps",
  initialState: {
    step1: undefined,
    step2: undefined,
    step3: undefined,
    step4: undefined,
    step5: undefined,
    step6: undefined,
  },
  reducers: {
    incrementStep1(state, action) {
      state.step1 = action.payload;
    },
    incrementStep2(state, action) {
      state.step2 = action.payload;
    },
    incrementStep3(state, action) {
      state.step3 = action.payload;
    },
    incrementStep4(state, action) {
      state.step4 = action.payload;
    },
    incrementStep5(state, action) {
      state.step5 = action.payload;
    },
    incrementStep6(state, action) {
      state.step6 = action.payload;
    },
  },
});

export const {
  incrementStep1,
  incrementStep2,
  incrementStep3,
  incrementStep4,
  incrementStep5,
  incrementStep6,
} = steps.actions;

export default steps.reducer;
