import { createFileRoute } from "@tanstack/react-router";
import { Bell, Award, UtensilsCrossed, BellRing, SmilePlus } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";

export const Route = createFileRoute("/group/")({
  component: SocialActivityFeed,
});

const badges = [
  {
    name: "Budget Hero",
    person: "Zavic",
    icon: Award,
    color: "text-nets-secondary",
    bg: "bg-nets-secondary/10",
  },
  {
    name: "Foodie",
    person: "Sean",
    icon: UtensilsCrossed,
    color: "text-nets-warning",
    bg: "bg-nets-warning/10",
  },
];

const reactions = [
  { emoji: "🤤", count: 3 },
  { emoji: "🔥", count: 1 },
];

export default function SocialActivityFeed() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-5 py-3 backdrop-blur-md">
        <Avatar className="h-9 w-9">
          <AvatarImage src="" />
          <AvatarFallback className="bg-nets-primary-container text-xs text-white">Y</AvatarFallback>
        </Avatar>
        <h1 className="text-nets-primary flex-1 text-center text-lg font-bold">NETS Biscuit</h1>
        <button className="relative rounded-full p-2">
          <Bell className="text-nets-on-surface h-5 w-5" />
          <span className="bg-nets-primary absolute top-1 right-1 h-2 w-2 rounded-full" />
        </button>
      </div>

      <div className="px-5 pb-24">
        {/* Trip Highlights */}
        <div className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-nets-on-surface text-base font-bold">Trip Highlights</h3>
            <button className="text-nets-secondary text-sm font-semibold">View All</button>
          </div>

          {/* Badges */}
          <div className="snap-x-mandatory mb-4 flex gap-3 overflow-x-auto pb-2">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className="shadow-ambient-soft flex flex-shrink-0 snap-start items-center gap-3 rounded-xl bg-white px-4 py-3"
                >
                  <div className="relative">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${badge.bg}`}>
                      <Icon className={`h-6 w-6 ${badge.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-nets-on-surface text-sm font-bold">{badge.name}</p>
                    <p className="text-nets-on-surface-variant text-xs">{badge.person}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestone Card */}
          <div className="from-nets-secondary to-nets-on-secondary-container relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white">
            <div className="absolute -top-4 -right-4 text-4xl opacity-30">🎉</div>
            <div className="absolute bottom-2 left-4 text-2xl opacity-20">✨</div>
            <div className="absolute top-4 right-8 text-xl opacity-20">🎈</div>
            <div className="relative">
              <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                Milestone Reached
              </span>
              <h3 className="text-xl font-extrabold">Hotel goal reached!</h3>
              <p className="mt-1 text-sm text-white/80">Your group has saved enough for accommodation</p>
            </div>
          </div>
        </div>

        {/* Nudge Banner */}
        <div className="shadow-ambient-soft mb-5 flex items-center gap-3 rounded-2xl bg-white p-4">
          <BellRing className="text-nets-primary h-5 w-5 flex-shrink-0" />
          <p className="text-nets-on-surface flex-1 text-sm">Sean still needs to claim 2 receipt items</p>
          <button className="bg-nets-primary/10 text-nets-primary rounded-full px-3 py-1.5 text-xs font-semibold">
            Nudge
          </button>
        </div>

        {/* Expense Post */}
        <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                Z
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-nets-on-surface text-sm font-bold">
                Zavic paid <span className="text-nets-primary">$48.50</span>
              </p>
              <p className="text-nets-on-surface-variant text-xs">First meal paid @ After You · 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {reactions.map((r) => (
              <button
                key={r.emoji}
                className="bg-nets-surface-container-low flex items-center gap-1 rounded-full px-3 py-1.5 text-sm"
              >
                <span>{r.emoji}</span>
                <span className="text-nets-on-surface-variant text-xs font-medium">{r.count}</span>
              </button>
            ))}
            <button className="bg-nets-surface-container-low text-nets-tertiary flex h-8 w-8 items-center justify-center rounded-full">
              <SmilePlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
