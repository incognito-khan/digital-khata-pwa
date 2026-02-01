import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      expenses: expenseReducer,
    },
  });
};
