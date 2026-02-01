"use client";

import Home from "@/components/home/home";
import ReduxProvider from "@/store/provider";

export default function HomePage() {
  return (
    <ReduxProvider>
      <Home />
    </ReduxProvider>
  );
}
