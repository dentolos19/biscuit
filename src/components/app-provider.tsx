import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
