"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { addExpense } from "@/services/expenseService";

export default function AddExpense() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const expense = {
      amount: Number(amount),
      note: note.trim(),
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      setIsSubmitting(true);
      await addExpense(expense); // update derived total
      router.push("/"); // go back to home
    } catch (err) {
      console.error(err);
      alert("Error saving expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full"
    >
      {/* Header */}
      <header className="flex items-center gap-4 mb-12 py-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted-light flex items-center justify-center text-black hover:bg-muted-light/80 transition-colors shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Add Expense</h1>
      </header>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-10">
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">
            Amount (Rs.)
          </label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted font-bold text-xl group-focus-within:text-primary transition-colors">
              Rs.
            </div>
            <input
              type="number"
              inputMode="decimal"
              // placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-muted-light border-2 pl-16 text-black border-transparent rounded-[2rem] py-8 pl-18 pr-6 text-4xl font-bold focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted/20"
              autoFocus
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">
            Optional Note
          </label>
          <textarea
            placeholder="What was this for? (e.g. Milk delivery)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full bg-muted-light border-2 text-gray-600 border-transparent rounded-[1.5rem] p-6 text-lg font-medium focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted/20 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-auto pb-10">
          <motion.button
            type="submit"
            disabled={!amount || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-6 rounded-[2.5rem] flex items-center justify-center gap-3 shadow-xl transition-all font-bold text-lg ${
              !amount || isSubmitting
                ? "bg-muted-light text-muted cursor-not-allowed shadow-none"
                : "bg-primary text-white shadow-primary/30 active:shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Saving to Khata...</span>
            ) : (
              <>
                <Check size={26} strokeWidth={3} />
                <span>Save Khata</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
