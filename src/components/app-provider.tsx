import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { DemoDataProvider } from "#/components/demo-data-provider";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
      <DemoDataProvider>{children}</DemoDataProvider>
    </ThemeProvider>
  );
}
