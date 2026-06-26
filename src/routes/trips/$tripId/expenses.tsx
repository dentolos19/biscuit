// ── Trip Expense Feed ──

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Bed,
  Plane,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Ticket,
  CheckCircle,
  Receipt,
  ScanLine,
  Clock,
  Plus,
} from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Badge } from "#/components/ui/badge";
import type { ExpenseCategory } from "#/lib/types";

export const Route = createFileRoute("/trips/$tripId/expenses")({
  component: TripExpenseFeed,
});

const categoryIcons: Record<ExpenseCategory, typeof Bed> = {
  accommodation: Bed,
  airfare: Plane,
  food: UtensilsCrossed,
  transport: Car,
  shopping: ShoppingBag,
  activity: Ticket,
  other: Receipt,
};

const categoryColors: Record<ExpenseCategory, { bg: string; text: string }> = {
  accommodation: { bg: "bg-nets-secondary/10", text: "text-nets-secondary" },
  airfare: { bg: "bg-nets-secondary/10", text: "text-nets-secondary" },
  food: { bg: "bg-nets-primary-container/10", text: "text-nets-primary" },
  transport: { bg: "bg-nets-surface-container-high/50", text: "text-nets-tertiary" },
  shopping: { bg: "bg-purple-100", text: "text-purple-600" },
  activity: { bg: "bg-emerald-100", text: "text-emerald-600" },
  other: { bg: "bg-nets-surface-container-high/50", text: "text-nets-tertiary" },
};

const statusConfig = {
  paid: {
    label: "Paid",
    icon: CheckCircle,
    className: "bg-nets-secondary-fixed text-nets-secondary",
  },
  scanning: {
    label: "Scanning",
    icon: ScanLine,
    className: "bg-nets-primary-fixed text-nets-primary",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-nets-surface-variant text-nets-tertiary",
  },
  disputed: {
    label: "Disputed",
    icon: MoreVertical,
    className: "bg-red-100 text-red-600",
  },
};

function TripExpenseFeed() {
  const { tripId } = Route.useParams();
  const { getTrip, getTripExpenses, members } = useApp();
  const trip = getTrip(tripId);
  const expenses = getTripExpenses(tripId);

  if (!trip) {
    return (
      <AppLayout>
        <div className="flex h-dvh flex-col items-center justify-center px-6 text-center">
          <p className="text-nets-on-surface-variant text-sm">Trip not found.</p>
          <Link to="/" className="text-nets-secondary mt-2 text-sm font-semibold">
            Go back home
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/trips/$tripId" params={{ tripId }} className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-primary flex-1 text-center text-lg font-bold">NETS Biscuit</h1>
        <div className="flex gap-1">
          <button className="rounded-full p-2">
            <Search className="text-nets-on-surface h-5 w-5" />
          </button>
          <button className="rounded-full p-2">
            <MoreVertical className="text-nets-on-surface h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-5 pb-24">
        {/* Trip Header */}
        <div className="mb-5">
          <h2 className="text-nets-on-surface text-2xl font-extrabold">{trip.name}</h2>
          <p className="text-nets-on-surface-variant text-sm">Expense Feed</p>
        </div>

        {/* Expense Cards */}
        {expenses.length === 0 ? (
          <div className="shadow-ambient-soft flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center">
            <div className="bg-nets-surface-container mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Receipt className="text-nets-tertiary h-8 w-8" />
            </div>
            <h3 className="text-nets-on-surface mb-1 text-base font-bold">No expenses yet</h3>
            <p className="text-nets-on-surface-variant mb-4 text-sm">Add your first expense or scan a receipt.</p>
            <Link
              to="/trips/$tripId/expenses/new"
              params={{ tripId }}
              className="bg-nets-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const status = statusConfig[expense.status];
              const StatusIcon = status.icon;
              const catColor = categoryColors[expense.category];
              const payer = members.find((m) => m.id === expense.paidBy);

              return (
                <div
                  key={expense.id}
                  className="group shadow-ambient-soft hover:shadow-ambient-pop relative overflow-hidden rounded-2xl bg-white p-4 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${catColor.bg}`}
                    >
                      {(() => {
                        const Icon = categoryIcons[expense.category];
                        return <Icon className={`h-6 w-6 ${catColor.text}`} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-nets-on-surface text-sm font-bold">{expense.name}</h3>
                          <p className="text-nets-on-surface-variant text-xs">Paid by {payer?.name ?? "Unknown"}</p>
                        </div>
                        <span className="text-nets-on-surface text-lg font-extrabold">
                          ${expense.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`${status.className} gap-1 rounded-full text-xs font-semibold`}
                        >
                          <StatusIcon className={`h-3 w-3 ${expense.status === "scanning" ? "animate-spin" : ""}`} />
                          {status.label}
                        </Badge>
                        {expense.hasReceipt && (
                          <Badge
                            variant="secondary"
                            className="bg-nets-surface-container-high text-nets-tertiary gap-1 rounded-full text-xs"
                          >
                            <Receipt className="h-3 w-3" />
                            Receipt
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {expense.status === "scanning" && (
                    <div className="bg-nets-surface-container-high absolute right-0 bottom-0 left-0 h-0.5">
                      <div className="animate-shimmer bg-nets-primary h-full w-1/3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        to="/trips/$tripId/expenses/new"
        params={{ tripId }}
        className="bg-nets-primary shadow-ambient-pop fixed right-5 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </AppLayout>
  );
}
