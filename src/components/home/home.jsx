"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowUpRight, History } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTodayTotal } from "@/store/expenseSlice";

export default function Home() {
  const [total, setTotal] = useState(0);
  const todayTotal = useAppSelector((state) => state.expenses.todayTotal);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodayTotal());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTotal(todayTotal);
    }, 500);
    return () => clearTimeout(timer);
  }, [todayTotal]);

  return (
    <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 py-4">
        <div>
          <h2 className="text-muted text-sm font-medium uppercase tracking-wide">
            Digital Khata
          </h2>
          <h1 className="text-xl font-bold">As-salamu alaykum</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold shadow-sm">
          S
        </div>
      </header>
      {/* Main Content: Today's Total */}
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <span className="text-muted font-medium uppercase tracking-widest text-[10px]">
            Today&apos;s Total
          </span>
        </motion.div>

        <div className="flex items-baseline gap-2 mb-12">
          <span className="text-3xl font-medium text-muted">Rs.</span>
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-bold tracking-tighter"
          >
            <Counter value={total} />
          </motion.h2>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-1 gap-4 mt-8">
          <Link href="/add">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-white p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-xl shadow-primary/30 active:shadow-lg transition-all"
            >
              <div className="bg-white/20 p-4 rounded-full">
                <Plus size={36} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Add Expense
              </span>
            </motion.div>
          </Link>
        </div>
      </div>
      {/* Footer Navigation or Recent Activity Shortcut */}
      <footer className="mt-auto py-8">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/history"
            className="flex items-center justify-center gap-2 p-5 rounded-3xl bg-muted-light font-semibold text-sm text-black hover:bg-muted-light/80 transition-colors"
          >
            <History size={18} />
            History
          </Link>
          <Link
            href="/reports"
            className="flex items-center justify-center gap-2 p-5 rounded-3xl bg-muted-light font-semibold text-sm text-black hover:bg-muted-light/80 transition-colors"
          >
            <ArrowUpRight size={18} />
            Reports
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Counter({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}
