import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Flame, PlusCircle, RotateCcw, Trophy } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { goalProgress } from "#/lib/finance";

export const Route = createFileRoute("/group/contribution")({
  validateSearch: (search: Record<string, unknown>) => ({
    tripId: typeof search.tripId === "string" ? search.tripId : undefined,
  }),
  component: GroupContribution,
});

const quickAmounts = [25, 50, 100, 200];

function GroupContribution() {
  const { tripId } = Route.useSearch();
  const { trips, contributions, getTripMembers, addContribution, autoContributionByTrip, setAutoContribution } =
    useApp();
  const trip =
    trips.find((entry) => entry.id === tripId) ?? trips.find((entry) => entry.status === "active") ?? trips[0];
  const [amount, setAmount] = useState("50");
  const [completed, setCompleted] = useState(false);

  if (!trip) {
    return (
      <AppLayout>
        <div className="flex min-h-dvh items-center justify-center px-6 text-center">
          <p className="text-nets-on-surface-variant text-sm">Create a trip before making a contribution.</p>
        </div>
      </AppLayout>
    );
  }

  const tripContributions = contributions[trip.id] ?? {};
  const members = getTripMembers(trip.id);
  const totalSaved = Object.values(tripContributions).reduce((sum, value) => sum + value, 0);
  const progress = goalProgress(totalSaved, trip.goal);
  const circumference = 2 * Math.PI * 90;
  const dashOffset = circumference - (progress / 100) * circumference;
  const autoContribute = autoContributionByTrip[trip.id] ?? false;

  const handleContribution = () => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    addContribution(trip.id, "you", parsed);
    setCompleted(true);
    window.setTimeout(() => setCompleted(false), 1800);
  };

  return (
    <AppLayout>
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/trips/$tripId" params={{ tripId: trip.id }} className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface size-5" />
        </Link>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">{trip.name}</h1>
        <div className="size-9" />
      </div>

      <div className="flex flex-col gap-5 px-5 pb-24">
        <div className="flex flex-col items-center py-4">
          <div className="relative size-52">
            <svg className="size-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-nets-surface-container-high"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="text-nets-secondary transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-nets-on-surface text-4xl font-extrabold">${totalSaved.toLocaleString()}</span>
              <span className="text-nets-on-surface-variant text-sm">of ${trip.goal.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-nets-secondary mt-2 text-sm font-semibold">
            {progress >= 100 ? "Goal reached!" : `Only $${Math.max(trip.goal - totalSaved, 0).toLocaleString()} left`}
          </p>
        </div>

        <div className="shadow-ambient-soft flex flex-col gap-3 rounded-2xl bg-white p-4">
          <div>
            <h2 className="text-nets-on-surface text-sm font-bold">Add money with NETS</h2>
            <p className="text-nets-on-surface-variant text-xs">Funds are added to the shared trip wallet.</p>
          </div>
          <div className="relative">
            <span className="text-nets-primary absolute top-1/2 left-4 -translate-y-1/2 font-bold">$</span>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))}
              className="h-12 rounded-xl bg-white pl-8 text-lg font-bold"
              aria-label="Contribution amount"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(String(value))}
                className={`rounded-xl py-2 text-sm font-semibold ${
                  amount === String(value)
                    ? "bg-nets-secondary text-white"
                    : "bg-nets-surface-container-low text-nets-on-surface"
                }`}
              >
                ${value}
              </button>
            ))}
          </div>
          <Button onClick={handleContribution} className="bg-nets-primary h-12 w-full rounded-full font-bold">
            {completed ? <Check data-icon="inline-start" /> : <PlusCircle data-icon="inline-start" />}
            {completed ? "Contribution added" : "Add money"}
          </Button>
        </div>

        <div className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="bg-nets-primary/10 flex size-10 items-center justify-center rounded-xl">
              <RotateCcw className="text-nets-primary size-5" />
            </div>
            <div>
              <p className="text-nets-on-surface text-sm font-semibold">Weekly Auto-Contribution</p>
              <p className="text-nets-on-surface-variant text-xs">${amount || "0"} every Friday</p>
            </div>
          </div>
          <Switch
            checked={autoContribute}
            onCheckedChange={(enabled) => setAutoContribution(trip.id, enabled)}
            aria-label="Weekly auto-contribution"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
            <Flame className="text-nets-warning mb-2 size-5" />
            <p className="text-nets-on-surface-variant text-xs">Current streak</p>
            <p className="text-nets-secondary text-2xl font-extrabold">3 weeks</p>
          </div>
          <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
            <Trophy className="text-nets-warning mb-2 size-5" />
            <p className="text-nets-on-surface-variant text-xs">Group progress</p>
            <p className="text-nets-secondary text-2xl font-extrabold">{progress}%</p>
          </div>
        </div>

        <div>
          <h2 className="text-nets-on-surface mb-3 text-base font-bold">Member contributions</h2>
          <div className="flex flex-col gap-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-nets-on-surface text-sm font-semibold">{member.name}</span>
                </div>
                <span className="text-nets-on-surface text-sm font-bold">
                  ${(tripContributions[member.id] ?? 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
