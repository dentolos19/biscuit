// ── Bottom Navigation Bar ──

import { Link, useLocation } from "@tanstack/react-router";
import { Wallet, Receipt, ScanLine, Split, Users } from "lucide-react";

import { useApp } from "#/components/demo-data-provider";
import { cn } from "#/lib/utils";

export function BottomNav() {
  const location = useLocation();
  const { trips } = useApp();
  const routeTripId = location.pathname.match(/^\/trips\/([^/]+)/)?.[1];
  const activeTrip =
    trips.find((trip) => trip.id === routeTripId) ?? trips.find((trip) => trip.status === "active") ?? trips[0];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="border-nets-outline-variant/30 shadow-nav fixed right-0 bottom-0 left-0 z-50 border-t bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        <NavItem name="Wallet" href="/" icon={Wallet} active={isActive("/")} />
        {activeTrip ? (
          <Link
            to="/trips/$tripId/expenses"
            params={{ tripId: activeTrip.id }}
            className={cn(
              "flex flex-col items-center gap-0.5 px-4 py-2 transition-colors",
              location.pathname.includes("/expenses")
                ? "text-nets-primary"
                : "text-nets-tertiary hover:text-nets-on-surface",
            )}
          >
            <Receipt className="size-6" />
            <span className="text-[10px] font-medium">Expenses</span>
          </Link>
        ) : (
          <NavItem name="Trips" href="/trips" icon={Receipt} active={isActive("/trips")} />
        )}
        <Link to="/scan" search={{ tripId: activeTrip?.id }} className="relative -mt-5 flex flex-col items-center">
          <div className="bg-nets-primary shadow-ambient-pop flex size-14 items-center justify-center rounded-2xl text-white">
            <ScanLine className="size-6" />
          </div>
          <span className="text-nets-tertiary mt-1 text-[10px] font-medium">Scan</span>
        </Link>
        <NavItem name="Split" href="/split" icon={Split} active={isActive("/split")} />
        <NavItem name="Group" href="/group" icon={Users} active={isActive("/group")} />
      </div>
    </nav>
  );
}

function NavItem({
  name,
  href,
  icon: Icon,
  active,
}: {
  name: string;
  href: "/" | "/trips" | "/split" | "/group";
  icon: typeof Wallet;
  active: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center gap-0.5 px-4 py-2 transition-colors",
        active ? "text-nets-primary" : "text-nets-tertiary hover:text-nets-on-surface",
      )}
    >
      <Icon className={cn("size-6", active && "fill-current")} strokeWidth={active ? 2.5 : 1.5} />
      <span className="text-[10px] font-medium">{name}</span>
      {active && <div className="bg-nets-primary size-1 rounded-full" />}
    </Link>
  );
}
