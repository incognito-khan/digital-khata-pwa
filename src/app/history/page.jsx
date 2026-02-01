"use client";

import HistoryPage from "@/components/history/history";
import ReduxProvider from "@/store/provider";

export default function History() {
  return (
    <ReduxProvider>
      <HistoryPage />
    </ReduxProvider>
  );
}
