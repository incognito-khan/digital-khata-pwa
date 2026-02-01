"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2, Calendar, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllExpenses, deleteExpense } from "@/services/expenseService";
import { useAppDispatch } from "@/store/hooks";
import { fetchTodayTotal } from "@/store/expenseSlice";

export default function HistoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getAllExpenses();
      // Sort by date/createdAt descending
      const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
      setExpenses(sortedData);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteExpense(id);
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        dispatch(fetchTodayTotal());
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("Error deleting record.");
      }
    }
  };

  // Grouping logic
  const groupExpenses = () => {
    const groups = {};
    expenses.forEach((expense) => {
      const date = expense.date; // YYYY-MM-DD
      if (!groups[date]) groups[date] = [];
      groups[date].push(expense);
    });
    return groups;
  };

  const expenseGroups = groupExpenses();
  const sortedDates = Object.keys(expenseGroups).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  const formatDateLabel = (dateStr) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";

    return new Date(dateStr).toLocaleDateString("en-PK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full min-h-screen bg-[var(--background)]"
    >
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 py-4 sticky top-0 bg-[var(--background)] z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted-light flex items-center justify-center text-black hover:bg-muted-light/80 transition-colors shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Khata History</h1>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
          <div className="bg-muted-light p-6 rounded-full mb-4">
            <ReceiptText size={48} className="text-muted" />
          </div>
          <p className="text-lg font-medium">No expenses yet</p>
          <p className="text-sm">Start by adding your first khata entry.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-8">
          {sortedDates.map((date) => (
            <section key={date} className="space-y-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-widest px-1">
                {formatDateLabel(date)}
              </h3>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {expenseGroups[date].map((expense) => (
                    <motion.div
                      key={expense.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-muted-light p-5 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-md hover:ring-2 hover:ring-primary/5 transition-all"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-black">
                          Rs. {expense.amount.toLocaleString()}
                        </span>
                        {expense.note && (
                          <span className="text-sm text-gray-500 font-medium">
                            {expense.note}
                          </span>
                        )}
                        <span className="text-[10px] text-muted flex items-center gap-1 font-bold uppercase">
                          <Calendar size={10} />
                          {new Date(expense.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-3 text-danger/20 hover:text-danger hover:bg-danger/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          ))}
        </div>
      )}
    </motion.div>
  );
}
