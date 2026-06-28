// ── React context for demo data ──

import { createContext, useContext } from "react";

import Loading from "#/components/loading";
import { useDemoData } from "#/hooks/use-demo-data";

type DemoDataContextValue = ReturnType<typeof useDemoData>;

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const demo = useDemoData();
  if (!demo.hydrated) {
    return (
      <main className="h-dvh">
        <Loading />
      </main>
    );
  }
  return <DemoDataContext value={demo}>{children}</DemoDataContext>;
}

export function useApp() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useApp must be used within DemoDataProvider");
  return ctx;
}
