"use client";

import ReportsPage from "@/components/reports/reports";
import ReduxProvider from "@/store/provider";

export default function Reports() {
  return (
    <ReduxProvider>
      <ReportsPage />
    </ReduxProvider>
  );
}
