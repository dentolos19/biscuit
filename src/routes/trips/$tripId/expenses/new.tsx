// ── Add Expense Page ──

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Receipt,
  Plane,
  Bed,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Ticket,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import type { ExpenseCategory } from "#/lib/types";

export const Route = createFileRoute("/trips/$tripId/expenses/new")({
  component: AddExpense,
});

const categoryOptions: { name: string; icon: typeof Receipt; value: ExpenseCategory }[] = [
  { name: "Hotel", icon: Bed, value: "accommodation" },
  { name: "Airfare", icon: Plane, value: "airfare" },
  { name: "Food", icon: UtensilsCrossed, value: "food" },
  { name: "Transport", icon: Car, value: "transport" },
  { name: "Shopping", icon: ShoppingBag, value: "shopping" },
  { name: "Activity", icon: Ticket, value: "activity" },
  { name: "Other", icon: MoreHorizontal, value: "other" },
];

function AddExpense() {
  const { tripId } = Route.useParams();
  const navigate = useNavigate();
  const { getTrip, getTripMembers, addExpense, addActivity } = useApp();
  const trip = getTrip(tripId);
  const members = getTripMembers(tripId);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [paidBy, setPaidBy] = useState("you");
  const [paidFrom, setPaidFrom] = useState<"wallet" | "personal">("wallet");
  const [error, setError] = useState("");

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

  const formatAmount = (value: string) => {
    const num = value.replace(/[^0-9.]/g, "");
    return num;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter an expense name");
      return;
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    addExpense({
      tripId,
      name: name.trim(),
      amount: parsed,
      category,
      paidBy,
      paidFrom,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      hasReceipt: false,
    });

    addActivity({
      tripId,
      type: "expense_added",
      memberId: paidBy,
      message: `${paidFrom === "wallet" ? "The group wallet" : (members.find((m) => m.id === paidBy)?.name ?? "Someone")} paid "${name.trim()}" ($${parsed.toFixed(2)})`,
      timestamp: "Just now",
    });

    navigate({ to: "/trips/$tripId/expenses", params: { tripId } });
  };

  return (
    <div className="bg-nets-surface mx-auto min-h-dvh max-w-lg">
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <button
          onClick={() => navigate({ to: "/trips/$tripId/expenses", params: { tripId } })}
          className="rounded-full p-2"
        >
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </button>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Add Expense</h1>
        <div className="w-9" />
      </div>

      <div className="space-y-5 px-5 pb-24">
        {/* Expense Name */}
        <div className="space-y-2">
          <label className="text-nets-on-surface text-sm font-semibold">Expense Name</label>
          <Input
            placeholder="e.g. Lunch at After You"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            className="border-nets-outline-variant focus:border-nets-secondary focus:ring-nets-secondary rounded-xl bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.04)]"
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-nets-on-surface text-sm font-semibold">Amount</label>
          <div className="shadow-ambient-soft relative overflow-hidden rounded-2xl bg-white p-5">
            <div className="flex items-baseline gap-1">
              <span className="text-nets-primary text-4xl font-extrabold">$</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  setAmount(formatAmount(e.target.value));
                  setError("");
                }}
                placeholder="0.00"
                className="text-nets-on-surface flex-1 bg-transparent text-4xl font-extrabold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error && <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

        {/* Category */}
        <div>
          <label className="text-nets-on-surface mb-3 block text-sm font-semibold">Category</label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    category === cat.value
                      ? "bg-nets-secondary text-white"
                      : "border-nets-outline-variant text-nets-tertiary border bg-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-nets-on-surface mb-3 block text-sm font-semibold">Payment Source</label>
          <div className="bg-nets-surface-container-low grid grid-cols-2 rounded-xl p-1">
            {(["wallet", "personal"] as const).map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => setPaidFrom(source)}
                className={`rounded-lg py-2.5 text-sm font-semibold capitalize ${
                  paidFrom === source ? "shadow-ambient-soft text-nets-on-surface bg-white" : "text-nets-tertiary"
                }`}
              >
                {source === "wallet" ? "Group Wallet" : "Personal"}
              </button>
            ))}
          </div>
        </div>

        {/* Paid By */}
        <div>
          <label className="text-nets-on-surface mb-3 block text-sm font-semibold">
            {paidFrom === "wallet" ? "Added By" : "Paid By"}
          </label>
          <div className="flex flex-col gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setPaidBy(m.id)}
                className={`flex items-center gap-3 rounded-2xl p-3 transition-all ${
                  paidBy === m.id ? "bg-nets-secondary/10 ring-nets-secondary ring-2" : "shadow-ambient-soft bg-white"
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                    {m.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-nets-on-surface text-sm font-semibold">
                  {m.name}
                  {m.isCurrentUser && <span className="text-nets-tertiary ml-1 text-xs">(You)</span>}
                </span>
                {paidBy === m.id && (
                  <div className="bg-nets-secondary ml-auto flex h-5 w-5 items-center justify-center rounded-full text-white">
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={handleSubmit}
            className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold"
          >
            <Receipt data-icon="inline-start" className="h-5 w-5" />
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
