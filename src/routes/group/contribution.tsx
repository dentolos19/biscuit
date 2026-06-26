import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Settings, PlusCircle, RotateCcw, Flame, Trophy, Wallet, Receipt, Users } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "#/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Switch } from "#/components/ui/switch";

export const Route = createFileRoute("/group/contribution")({
  component: GroupContribution,
});

const contributions = [
  { name: "Sarah Lim", amount: 50, badge: "Weekly", time: "2 hours ago" },
  { name: "Jason Tan", amount: 100, badge: "Manual", time: "Yesterday" },
  { name: "You", amount: 50, badge: "Weekly", time: "Oct 12" },
];

export default function GroupContribution() {
  const [autoContribute, setAutoContribute] = useState(true);

  const totalSaved = 1150;
  const goal = 1500;
  const progress = (totalSaved / goal) * 100;
  const circumference = 2 * Math.PI * 90;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/" className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Bali Trip 2024</h1>
        <button className="rounded-full p-2">
          <Settings className="text-nets-on-surface h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 px-5 pb-4">
        {/* Circular Progress */}
        <div className="flex flex-col items-center py-4">
          <div className="relative h-52 w-52">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e1e3e4" strokeWidth="12" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#1261a3"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-nets-on-surface text-4xl font-extrabold">${totalSaved.toLocaleString()}</span>
              <span className="text-nets-on-surface-variant text-sm">of ${goal.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-nets-secondary mt-2 text-sm font-semibold">
            Only ${(goal - totalSaved).toLocaleString()} left
          </p>
        </div>

        {/* Primary Actions */}
        <Button className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Money with NETS
        </Button>

        {/* Auto-Contribution Toggle */}
        <div className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="bg-nets-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <RotateCcw className="text-nets-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-nets-on-surface text-sm font-semibold">Weekly Auto-Contribution</p>
              <p className="text-nets-on-surface-variant text-xs">$50 every Friday</p>
            </div>
          </div>
          <Switch checked={autoContribute} onCheckedChange={setAutoContribute} />
        </div>

        {/* Streaks */}
        <div>
          <h3 className="text-nets-on-surface mb-3 text-base font-bold">Your Streak</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="shadow-ambient-soft relative overflow-hidden rounded-2xl bg-white p-4">
              <Flame className="text-nets-warning/10 absolute -top-2 -right-2 h-16 w-16" />
              <p className="text-nets-on-surface-variant text-xs font-medium">Current</p>
              <p className="text-nets-secondary mt-1 text-3xl font-extrabold">3</p>
              <p className="text-nets-on-surface-variant text-xs">weeks</p>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-nets-secondary h-1.5 flex-1 rounded-full" />
                ))}
                {[4, 5].map((i) => (
                  <div key={i} className="bg-nets-surface-container-high h-1.5 flex-1 rounded-full" />
                ))}
              </div>
            </div>
            <div className="shadow-ambient-soft relative overflow-hidden rounded-2xl bg-white p-4">
              <Trophy className="text-nets-warning/10 absolute -top-2 -right-2 h-16 w-16" />
              <p className="text-nets-on-surface-variant text-xs font-medium">Best</p>
              <p className="text-nets-secondary mt-1 text-3xl font-extrabold">8</p>
              <p className="text-nets-on-surface-variant text-xs">weeks</p>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-nets-secondary h-1.5 flex-1 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Contributions */}
        <div>
          <h3 className="text-nets-on-surface mb-3 text-base font-bold">Recent Contributions</h3>
          <div className="space-y-2">
            {contributions.map((contrib) => (
              <div
                key={contrib.name}
                className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                      {contrib.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-nets-on-surface text-sm font-semibold">{contrib.name}</p>
                    <p className="text-nets-on-surface-variant text-xs">{contrib.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      contrib.badge === "Weekly"
                        ? "bg-nets-primary-fixed text-nets-primary"
                        : "bg-nets-surface-variant text-nets-tertiary"
                    }`}
                  >
                    {contrib.badge}
                  </span>
                  <span className="text-nets-on-surface text-sm font-bold">+${contrib.amount}.00</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
