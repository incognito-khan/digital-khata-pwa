"use client";

import AddExpense from "@/components/add-expense/add-expense";
import ReduxProvider from "@/store/provider";

export default function Add() {
  return (
    <ReduxProvider>
      <AddExpense />
    </ReduxProvider>
  );
}
