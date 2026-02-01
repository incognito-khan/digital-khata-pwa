"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  PieChart,
  BarChart3,
  ReceiptText,
} from "lucide-react";
import { motion } from "framer-motion";
import { getAllExpenses } from "@/services/expenseService";

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAllTime: 0,
    totalThisMonth: 0,
    spendingTrend: [],
    noteBreakdown: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allExpenses = await getAllExpenses();

      // Calculate All Time Total
      const totalAllTime = allExpenses.reduce((sum, e) => sum + e.amount, 0);

      // Current Month Total
      const now = new Date();
      const currentYearMonth = now.toISOString().slice(0, 7); // YYYY-MM
      const totalThisMonth = allExpenses
        .filter((e) => e.date.startsWith(currentYearMonth))
        .reduce((sum, e) => sum + e.amount, 0);

      // Spending Trend (Last 7 days)
      const last7Days = [...Array(7)]
        .map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().slice(0, 10);
        })
        .reverse();

      const spendingTrend = last7Days.map((date) => {
        const dayTotal = allExpenses
          .filter((e) => e.date === date)
          .reduce((sum, e) => sum + e.amount, 0);
        return { date, amount: dayTotal };
      });

      // Note Breakdown (Top 5 recurring notes)
      const noteGroups = {};
      allExpenses.forEach((e) => {
        const note = e.note || "No note";
        if (!noteGroups[note]) noteGroups[note] = 0;
        noteGroups[note] += e.amount;
      });

      const noteBreakdown = Object.entries(noteGroups)
        .map(([note, amount]) => ({ note, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      setStats({
        totalAllTime,
        totalThisMonth,
        spendingTrend,
        noteBreakdown,
      });
    } catch (err) {
      console.error("Failed to load report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const maxDailyAmount = Math.max(
    ...stats.spendingTrend.map((d) => d.amount),
    1,
  );

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
        <h1 className="text-xl font-bold tracking-tight">Reports</h1>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : stats.totalAllTime === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
          <div className="bg-muted-light p-6 rounded-full mb-4">
            <BarChart3 size={48} className="text-muted" />
          </div>
          <p className="text-lg font-medium">No data for reports</p>
          <p className="text-sm">
            Reports will appear once you add some khata.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary text-white p-5 rounded-[2rem] shadow-lg shadow-primary/20"
            >
              <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-3">
                <TrendingDown size={16} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 current-month-label">
                This Month
              </p>
              <h3 className="text-xl font-bold">
                Rs. {stats.totalThisMonth.toLocaleString()}
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-muted-light p-5 rounded-[2rem]"
            >
              <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mb-3 text-primary">
                <PieChart size={16} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                All Time
              </p>
              <h3 className="text-xl font-bold text-black">
                Rs. {stats.totalAllTime.toLocaleString()}
              </h3>
            </motion.div>
          </div>

          {/* Spending Trend Chart */}
          <section className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest">
                  Weekly Trend
                </h3>
                <p className="text-lg font-bold">Daily Activity</p>
              </div>
              <div className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                <TrendingUp size={10} />
                Last 7 Days
              </div>
            </div>

            <div className="bg-muted-light p-6 rounded-[2.5rem] flex items-end justify-between h-48 gap-2">
              {stats.spendingTrend.map((day, idx) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${(day.amount / maxDailyAmount) * 100}%`,
                    }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    className={`w-full max-w-[12px] rounded-full transition-all group-hover:w-[16px] ${
                      day.amount === maxDailyAmount
                        ? "bg-primary"
                        : "bg-primary/30 group-hover:bg-primary/50"
                    }`}
                    style={{ minHeight: day.amount > 0 ? "4px" : "0" }}
                  />
                  <span className="text-[8px] font-bold text-muted uppercase">
                    {new Date(day.date)
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .slice(0, 1)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Top Spending Categories (Notes) */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest px-1">
              Top Expenses
            </h3>
            <div className="space-y-3">
              {stats.noteBreakdown.map((item, idx) => (
                <motion.div
                  key={item.note}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-2 border-muted-light p-4 rounded-3xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-muted-light flex items-center justify-center text-muted">
                      <ReceiptText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black truncate max-w-[150px]">
                        {item.note}
                      </p>
                      <div className="w-24 h-1.5 bg-muted-light rounded-full mt-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(item.amount / stats.totalAllTime) * 100}%`,
                          }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">
                      Rs. {item.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-muted uppercase">
                      {((item.amount / stats.totalAllTime) * 100).toFixed(0)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Monthly Comparison Callout */}
          <div className="bg-[#0f172a] text-white p-6 rounded-[2.5rem] flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
                Savings Insight
              </p>
              <h4 className="text-lg font-bold leading-tight">
                You spent{" "}
                {stats.totalThisMonth > 0
                  ? "Rs. " + stats.totalThisMonth.toLocaleString()
                  : "nothing"}{" "}
                <br /> this month.
              </h4>
            </div>
            <div className="bg-white/10 p-3 rounded-full relative z-10">
              <ArrowRight size={24} />
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
