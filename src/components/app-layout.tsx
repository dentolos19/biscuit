import type { ReactNode } from "react";

import { BottomNav } from "./bottom-nav";

export function AppLayout({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="bg-nets-surface mx-auto min-h-dvh max-w-lg">
      <main className={hideNav ? "" : "pb-20"}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
