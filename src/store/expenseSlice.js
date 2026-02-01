import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTodayExpenses } from "../services/expenseService";

// Async thunk to fetch today's total from IndexedDB
export const fetchTodayTotal = createAsyncThunk(
  "expenses/fetchTodayTotal",
  async () => {
    const expenses = await getTodayExpenses();
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return total;
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    todayTotal: 0, // derived only
  },
  reducers: {
    // optional future reducers (UI-only)
    resetTotal: (state) => {
      state.todayTotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodayTotal.fulfilled, (state, action) => {
      state.todayTotal = action.payload || 0;
    });
  },
});

export const { resetTotal } = expenseSlice.actions;
export default expenseSlice.reducer;
