// ── Bottom Navigation Bar ──

import { useLocation, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Receipt, ScanLine, Split, Users, Wallet } from "lucide-react";
import { useState } from "react";

import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { goalProgress } from "#/lib/finance";
import type { Trip } from "#/lib/types";
import { cn } from "#/lib/utils";

type TripAction = "expenses" | "scan" | "split" | "group";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trips, members } = useApp();
  const [pendingAction, setPendingAction] = useState<TripAction | null>(null);
  const currentTripId = currentTripIdFromLocation(location.pathname, location.search);
  const currentTrip = currentTripId ? trips.find((trip) => trip.id === currentTripId) : undefined;

  const isActive = (target: "wallet" | TripAction) => {
    if (target === "wallet") return location.pathname === "/";
    if (target === "expenses") return location.pathname.includes("/expenses");
    if (target === "scan") return location.pathname === "/scan";
    if (target === "split") return location.pathname.includes("/split");
    return location.pathname === "/group" || /^\/trips\/[^/]+\/?$/.test(location.pathname);
  };

  const chooseTrip = (trip: Trip) => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    navigateToTripAction(action, trip.id, navigate);
  };

  const goToTripAction = (action: TripAction) => {
    if (currentTrip) {
      navigateToTripAction(action, currentTrip.id, navigate);
      return;
    }
    setPendingAction(action);
  };

  const goToWallet = () => {
    if (currentTrip) {
      navigate({ to: "/trips/$tripId", params: { tripId: currentTrip.id } });
      return;
    }
    navigate({ to: "/", hash: "home" });
  };

  return (
    <>
      <nav className="border-nets-outline-variant/30 shadow-nav fixed right-0 bottom-0 left-0 z-50 border-t bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          <NavButton name="Wallet" icon={Wallet} active={isActive("wallet")} onClick={goToWallet} />
          <NavButton
            name="Expenses"
            icon={Receipt}
            active={isActive("expenses")}
            onClick={() => goToTripAction("expenses")}
          />
          <button
            type="button"
            onClick={() => goToTripAction("scan")}
            className="relative -mt-5 flex flex-col items-center"
          >
            <div className="bg-nets-primary shadow-ambient-pop flex size-14 items-center justify-center rounded-2xl text-white">
              <ScanLine className="size-6" />
            </div>
            <span
              className={cn(
                "mt-1 text-[10px] font-medium",
                isActive("scan") ? "text-nets-primary" : "text-nets-tertiary",
              )}
            >
              Scan
            </span>
          </button>
          <NavButton name="Split" icon={Split} active={isActive("split")} onClick={() => goToTripAction("split")} />
          <NavButton name="Group" icon={Users} active={isActive("group")} onClick={() => goToTripAction("group")} />
        </div>
      </nav>

      {pendingAction && (
        <div className="fixed inset-0 z-[60] bg-black/35 px-4 pt-20 pb-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close trip selector"
            onClick={() => setPendingAction(null)}
          />
          <div className="shadow-ambient-pop relative mx-auto flex max-h-[78dvh] max-w-lg flex-col overflow-hidden rounded-3xl bg-white">
            <div className="border-nets-outline-variant/40 border-b px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-nets-on-surface-variant text-xs font-bold tracking-wide uppercase">
                    Select trip or event
                  </p>
                  <h2 className="text-nets-on-surface text-xl font-extrabold">{actionTitle(pendingAction)}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="bg-nets-surface-container text-nets-on-surface rounded-full px-3 py-1.5 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {trips.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <CalendarDays className="text-nets-tertiary mx-auto mb-3 size-10" />
                <h3 className="text-nets-on-surface font-extrabold">Create a trip or event first</h3>
                <p className="text-nets-on-surface-variant mt-1 text-sm">
                  Expenses, scans, splits, and group activity need a group plan to belong to.
                </p>
                <Button
                  onClick={() => {
                    setPendingAction(null);
                    navigate({ to: "/", hash: "create" });
                  }}
                  className="bg-nets-primary mt-5 rounded-full px-5"
                >
                  Go to Create
                </Button>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {trips.map((trip) => {
                  const progress = goalProgress(trip.contribution, trip.goal);
                  const tripMembers = trip.memberIds
                    .map((id) => members.find((member) => member.id === id))
                    .filter((member) => member !== undefined);
                  return (
                    <button
                      key={trip.id}
                      type="button"
                      onClick={() => chooseTrip(trip)}
                      className="border-nets-outline-variant/50 flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left shadow-[0_2px_14px_rgba(0,0,0,0.04)] active:scale-[0.99]"
                    >
                      <img src={trip.imageUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-nets-on-surface truncate text-sm font-extrabold">{trip.name}</h3>
                        <p className="text-nets-on-surface-variant truncate text-xs font-semibold">
                          {trip.destination}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex -space-x-1.5">
                            {tripMembers.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="size-6 border-2 border-white">
                                <AvatarFallback className="text-[9px] font-bold">{member.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-nets-primary text-xs font-extrabold">{progress}% saved</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function navigateToTripAction(action: TripAction, tripId: string, navigate: ReturnType<typeof useNavigate>) {
  if (action === "expenses") {
    navigate({ to: "/trips/$tripId/expenses", params: { tripId } });
    return;
  }
  if (action === "scan") {
    navigate({ to: "/scan", search: { tripId } });
    return;
  }
  if (action === "split") {
    navigate({ to: "/trips/$tripId/split", params: { tripId } });
    return;
  }
  navigate({ to: "/trips/$tripId", params: { tripId } });
}

function currentTripIdFromLocation(pathname: string, search: unknown) {
  const routeTripId = pathname.match(/^\/trips\/([^/]+)/)?.[1];
  if (routeTripId) return routeTripId;

  if (search && typeof search === "object" && "tripId" in search) {
    const tripId = (search as { tripId?: unknown }).tripId;
    return typeof tripId === "string" ? tripId : undefined;
  }

  return undefined;
}

function actionTitle(action: TripAction) {
  if (action === "expenses") return "Which plan has the expense?";
  if (action === "scan") return "Which plan is this receipt for?";
  if (action === "split") return "Which plan do you want to split?";
  return "Which group do you want to view?";
}

function NavButton({
  name,
  icon: Icon,
  active,
  onClick,
}: {
  name: string;
  icon: typeof Wallet;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 px-4 py-2 transition-colors",
        active ? "text-nets-primary" : "text-nets-tertiary hover:text-nets-on-surface",
      )}
    >
      <Icon className={cn("size-6", active && "fill-current")} strokeWidth={active ? 2.5 : 1.5} />
      <span className="text-[10px] font-medium">{name}</span>
      {active && <div className="bg-nets-primary size-1 rounded-full" />}
    </button>
  );
}
