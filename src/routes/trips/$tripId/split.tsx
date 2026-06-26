import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Info, Calculator, TrendingDown, TrendingUp, Send } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/trips/$tripId/split")({
  component: SmartSplitSummary,
});

const receiving = [
  { name: "Yu Xiang", amount: 12.4, getsBack: true },
  { name: "Zavic", amount: 3.1, getsBack: true },
];

const paying = [
  { name: "Miguel", amount: 8.2, getsBack: false },
  { name: "Sean", amount: 7.3, getsBack: false },
];

export default function SmartSplitSummary() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/" className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-primary flex-1 text-center text-lg font-bold">Smart Split</h1>
        <button className="rounded-full p-2">
          <Info className="text-nets-secondary h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-24">
        {/* Trip Title */}
        <div className="mb-4">
          <h2 className="text-nets-on-surface text-2xl font-extrabold">Dinner at Hai Di Lao</h2>
        </div>

        {/* Logic Explanation */}
        <div className="bg-nets-surface-container-low mb-5 flex items-center gap-2 rounded-xl p-3">
          <Calculator className="text-nets-secondary h-4 w-4 flex-shrink-0" />
          <p className="text-nets-on-surface-variant text-xs">Personal items + Shared taxes − Wallet share</p>
        </div>

        {/* Receiving Section */}
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="bg-nets-success/10 flex h-6 w-6 items-center justify-center rounded-full">
              <TrendingUp className="text-nets-success h-3.5 w-3.5" />
            </div>
            <h3 className="text-nets-success text-sm font-bold">Receiving</h3>
          </div>
          <div className="space-y-2">
            {receiving.map((person) => (
              <div
                key={person.name}
                className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                      {person.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-nets-on-surface text-base font-bold">{person.name}</p>
                    <p className="text-nets-success text-xs">Gets back</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="text-nets-success h-4 w-4" />
                  <span className="text-nets-success text-lg font-extrabold">+${person.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paying Section */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="bg-nets-error/10 flex h-6 w-6 items-center justify-center rounded-full">
              <TrendingDown className="text-nets-error h-3.5 w-3.5" />
            </div>
            <h3 className="text-nets-error text-sm font-bold">Paying</h3>
          </div>
          <div className="space-y-2">
            {paying.map((person) => (
              <div
                key={person.name}
                className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                      {person.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-nets-on-surface text-base font-bold">{person.name}</p>
                    <p className="text-nets-error text-xs">Owes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="text-nets-on-surface-variant h-4 w-4" />
                  <span className="text-nets-on-surface text-lg font-extrabold">-${person.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold">
            <Send className="mr-2 h-5 w-5" />
            Settle Now
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
