import { combineReducers, configureStore } from "@reduxjs/toolkit";
import stepsReducer from "./reducers/steps";
import sizeReducer from "./reducers/size";
import filterReducer from "./reducers/filter";

const rootReducer = combineReducers({
  steps: stepsReducer,
  sizes: sizeReducer,
  filter: filterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
