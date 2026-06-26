import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Star, ArrowDown, ArrowUp, PieChart, Wallet, Banknote, Share2 } from "lucide-react";

import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/trips/$tripId/settle")({
  component: EndTripSettlement,
});

export default function EndTripSettlement() {
  return (
    <div className="bg-nets-surface relative mx-auto min-h-dvh max-w-lg overflow-hidden">
      {/* Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-nets-primary/5 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-nets-secondary/5 absolute right-1/4 bottom-1/3 h-48 w-48 rounded-full blur-3xl" />
        {/* Confetti particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="animate-float-up absolute h-2 w-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${60 + Math.random() * 30}%`,
              backgroundColor: ["#b5000b", "#1261a3", "#f59e0b", "#0b8a00"][i % 4],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col items-center px-5 pt-16">
        {/* Success Icon */}
        <div className="animate-slide-up mb-6">
          <div className="relative">
            <div className="bg-nets-primary-fixed flex h-24 w-24 items-center justify-center rounded-full">
              <CheckCircle className="text-nets-primary h-12 w-12" />
            </div>
            <Star
              className="text-nets-secondary animate-subtle-bounce absolute -top-1 -right-1 h-6 w-6"
              fill="currentColor"
            />
            <Star
              className="text-nets-warning animate-subtle-bounce absolute -bottom-1 -left-1 h-4 w-4"
              fill="currentColor"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>

        {/* Celebration Text */}
        <div className="animate-slide-up mb-8 text-center" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-nets-on-surface text-4xl font-extrabold">Trip Settled!</h1>
          <p className="text-nets-on-surface-variant mt-2 text-base">Bali 2024 is officially in the books</p>
        </div>

        {/* Finance Card */}
        <div
          className="animate-slide-up shadow-ambient-soft mb-4 w-full rounded-2xl bg-white p-5"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="mb-4 text-center">
            <p className="text-nets-on-surface-variant text-sm font-medium">Remaining Wallet Balance</p>
            <p className="text-nets-primary mt-1 text-4xl font-extrabold">$150.00</p>
          </div>
          <div className="border-nets-outline-variant flex items-center border-t pt-4">
            <div className="flex-1 text-center">
              <div className="mb-1 flex items-center justify-center gap-1">
                <ArrowUp className="text-nets-primary h-4 w-4" />
                <span className="text-nets-on-surface-variant text-xs">Contributed</span>
              </div>
              <p className="text-nets-on-surface text-lg font-bold">$2,500</p>
            </div>
            <div className="bg-nets-outline-variant h-10 w-px" />
            <div className="flex-1 text-center">
              <div className="mb-1 flex items-center justify-center gap-1">
                <ArrowDown className="text-nets-secondary h-4 w-4" />
                <span className="text-nets-on-surface-variant text-xs">Spent</span>
              </div>
              <p className="text-nets-on-surface text-lg font-bold">$2,350</p>
            </div>
          </div>
        </div>

        {/* Fair Share Card */}
        <div
          className="animate-slide-up bg-nets-secondary-fixed/30 mb-8 w-full rounded-2xl p-5 text-center"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="mb-1 flex items-center justify-center gap-2">
            <PieChart className="text-nets-secondary h-5 w-5" />
            <span className="text-nets-on-surface-variant text-sm font-medium">Your Fair Share</span>
          </div>
          <p className="text-nets-secondary text-3xl font-extrabold">$587.50</p>
        </div>

        {/* Actions */}
        <div className="animate-slide-up w-full space-y-3" style={{ animationDelay: "0.4s" }}>
          <Button className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold">
            <Wallet className="mr-2 h-5 w-5" />
            Settle with NETS
          </Button>
          <Button
            variant="outline"
            className="border-nets-secondary text-nets-secondary hover:bg-nets-secondary/5 h-12 w-full rounded-full text-base font-semibold"
          >
            <Banknote className="mr-2 h-5 w-5" />
            Refund Balance to Bank
          </Button>
          <button className="text-nets-tertiary flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold">
            <Share2 className="h-4 w-4" />
            Export Trip Report
          </button>
        </div>
      </div>
    </div>
  );
}
