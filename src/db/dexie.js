import Dexie from "dexie";

// 1. Initialize DB
export const db = new Dexie("KhataDB");

// 2. Define schema
db.version(1).stores({
  expenses: "++id, amount, note, date, createdAt",
});
