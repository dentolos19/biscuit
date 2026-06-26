// ── React context for demo data ──

import { createContext, useContext } from "react";

import { useDemoData } from "#/hooks/use-demo-data";

type DemoDataContextValue = ReturnType<typeof useDemoData>;

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const demo = useDemoData();
  return <DemoDataContext value={demo}>{children}</DemoDataContext>;
}

export function useApp() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useApp must be used within DemoDataProvider");
  return ctx;
}
