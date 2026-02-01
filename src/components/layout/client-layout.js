"use client";

import ReduxProvider from "@/store/provider";

export default function ClientLayout({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
