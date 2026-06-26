// ── Bottom Navigation Bar ──

import { Link, useLocation } from "@tanstack/react-router";
import { Wallet, Receipt, ScanLine, Split, Users } from "lucide-react";

import { cn } from "#/lib/utils";

const tabs = [
  { name: "Wallet", href: "/", icon: Wallet },
  { name: "Expenses", href: "/trips/bangkok-2024/expenses", icon: Receipt },
  { name: "Scan", href: "/scan", icon: ScanLine, isSpecial: true },
  { name: "Split", href: "/split", icon: Split },
  { name: "Group", href: "/group", icon: Users },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="border-nets-outline-variant/30 shadow-nav fixed right-0 bottom-0 left-0 z-50 border-t bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;

          if (tab.isSpecial) {
            return (
              <Link key={tab.name} to={tab.href} className="relative -mt-5 flex flex-col items-center">
                <div className="bg-nets-primary shadow-ambient-pop flex h-14 w-14 items-center justify-center rounded-2xl text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-nets-tertiary mt-1 text-[10px] font-medium">{tab.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 transition-colors",
                active ? "text-nets-primary" : "text-nets-tertiary hover:text-nets-on-surface",
              )}
            >
              <Icon className={cn("h-6 w-6", active && "fill-current")} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.name}</span>
              {active && <div className="bg-nets-primary h-1 w-1 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
