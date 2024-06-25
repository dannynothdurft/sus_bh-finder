import { combineReducers, configureStore } from "@reduxjs/toolkit";
import stepsReducer from "./reducers/steps";
import sizeReducer from "./reducers/size";

// export const store = configureStore({
//   reducer: {
//     steps: stepsReducer,
//   },
// });

const rootReducer = combineReducers({
  steps: stepsReducer,
  sizes: sizeReducer,
  // andere Reducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
