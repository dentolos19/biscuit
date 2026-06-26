import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Bed,
  Plane,
  UtensilsCrossed,
  Car,
  CheckCircle,
  Receipt,
  ScanLine,
  Clock,
  Plus,
} from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { Badge } from "#/components/ui/badge";

export const Route = createFileRoute("/trips/$tripId/expenses")({
  component: TripExpenseFeed,
});

const expenses = [
  {
    name: "Hotel Booking",
    amount: 500.0,
    paidBy: "Group Wallet",
    status: "paid" as const,
    icon: Bed,
    iconBg: "bg-nets-secondary/10",
    iconColor: "text-nets-secondary",
    hasReceipt: true,
  },
  {
    name: "Airfare",
    amount: 300.0,
    paidBy: "Group Wallet",
    status: "paid" as const,
    icon: Plane,
    iconBg: "bg-nets-secondary/10",
    iconColor: "text-nets-secondary",
    hasReceipt: false,
  },
  {
    name: "Lunch at After You",
    amount: 86.4,
    paidBy: "Yu Xiang",
    status: "scanning" as const,
    icon: UtensilsCrossed,
    iconBg: "bg-nets-primary-container/10",
    iconColor: "text-nets-primary",
    hasReceipt: false,
  },
  {
    name: "Grab to Airport",
    amount: 25.0,
    paidBy: "Group Wallet",
    status: "pending" as const,
    icon: Car,
    iconBg: "bg-nets-surface-container-high/50",
    iconColor: "text-nets-tertiary",
    hasReceipt: false,
  },
];

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
};

export default function TripExpenseFeed() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/" className="rounded-full p-2">
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
          <h2 className="text-nets-on-surface text-2xl font-extrabold">Tokyo Trip 2024</h2>
          <p className="text-nets-on-surface-variant text-sm">Expense Feed</p>
        </div>

        {/* Expense Cards */}
        <div className="space-y-3">
          {expenses.map((expense) => {
            const Icon = expense.icon;
            const status = statusConfig[expense.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={expense.name}
                className="group shadow-ambient-soft hover:shadow-ambient-pop relative overflow-hidden rounded-2xl bg-white p-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${expense.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${expense.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-nets-on-surface text-sm font-bold">{expense.name}</h3>
                        <p className="text-nets-on-surface-variant text-xs">Paid by {expense.paidBy}</p>
                      </div>
                      <span className="text-nets-on-surface text-lg font-extrabold">${expense.amount.toFixed(2)}</span>
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
      </div>

      {/* FAB */}
      <button className="bg-nets-primary shadow-ambient-pop fixed right-5 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform active:scale-95">
        <Plus className="h-6 w-6" />
      </button>
    </AppLayout>
  );
}
