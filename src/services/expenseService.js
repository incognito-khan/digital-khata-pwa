import { db } from "../db/dexie";

// Add a new expense
export const addExpense = async (expense) => {
  return db.expenses.add({
    ...expense,
    createdAt: Date.now(),
  });
};

// Get all expenses
export const getAllExpenses = async () => {
  return db.expenses.toArray();
};

// Get today's expenses
export const getTodayExpenses = async () => {
  const today = new Date().toISOString().slice(0, 10);
  return db.expenses.where("date").equals(today).toArray();
};

// Delete an expense
export const deleteExpense = async (id) => {
  return db.expenses.delete(id);
};

// Update an expense
export const updateExpense = async (id, updates) => {
  return db.expenses.update(id, updates);
};
