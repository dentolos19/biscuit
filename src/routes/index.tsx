import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Plane, MapPin, Calendar, Plus, Receipt, ScanLine, PieChart, Flame, ArrowRight } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Progress } from "#/components/ui/progress";

export const Route = createFileRoute("/")({
  component: WalletOverview,
});

const members = [
  { name: "Yu Xiang", amount: 250, isTop: true },
  { name: "Miguel", amount: 250, isTop: false },
  { name: "Zavic", amount: 200, isTop: false },
  { name: "Sean", amount: 150, isTop: false },
];

const quickActions = [
  { name: "Contribute", icon: Plus, variant: "primary" as const },
  { name: "Add Expense", icon: Receipt, variant: "outline" as const },
  { name: "Scan Receipt", icon: ScanLine, variant: "neutral" as const },
  { name: "View Split", icon: PieChart, variant: "neutral" as const },
];

function WalletOverview() {
  return (
    <AppLayout>
      {/* Top App Bar */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center justify-between px-5 py-3 backdrop-blur-md">
        <Avatar className="h-9 w-9">
          <AvatarImage src="" alt="You" />
          <AvatarFallback className="bg-nets-primary-container text-xs text-white">Y</AvatarFallback>
        </Avatar>
        <h1 className="text-nets-primary text-lg font-bold">NETS Biscuit</h1>
        <button className="relative rounded-full p-2">
          <Bell className="text-nets-on-surface h-5 w-5" />
          <span className="bg-nets-primary absolute top-1 right-1 h-2 w-2 rounded-full" />
        </button>
      </div>

      <div className="space-y-5 px-5 pb-4">
        {/* Hero Card */}
        <div className="shadow-ambient-soft relative overflow-hidden rounded-3xl bg-white p-5">
          <div className="bg-nets-secondary/5 absolute -top-8 -right-8 h-32 w-32 rounded-full blur-2xl" />

          <div className="bg-nets-secondary-fixed/50 mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1">
            <Plane className="text-nets-secondary h-3.5 w-3.5" />
            <span className="text-nets-secondary text-xs font-semibold">Upcoming Trip</span>
          </div>

          <h2 className="text-nets-on-surface mb-2 text-2xl font-extrabold">Bangkok Grad Trip</h2>

          <div className="text-nets-on-surface-variant mb-4 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Bangkok, Thailand
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Dec 15-22
            </span>
          </div>

          {/* Destination thumbnail */}
          <div className="bg-nets-surface-container mb-4 h-32 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=200&fit=crop"
              alt="Grand Palace"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Savings Progress */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-nets-primary text-3xl font-extrabold">$850</span>
              <span className="text-nets-on-surface-variant text-sm">/ $2,000</span>
            </div>
            <div className="relative">
              <Progress value={42} className="h-2.5 rounded-full" />
              <div className="absolute inset-0 h-2.5 overflow-hidden rounded-full">
                <div className="animate-shimmer h-full w-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="bg-nets-primary-fixed text-nets-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
                42% Reached
              </span>
              <span className="text-nets-on-surface-variant text-xs">$1,150 to go</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                className={`flex items-center gap-3 rounded-2xl p-4 transition-all active:scale-[0.97] ${
                  action.variant === "primary"
                    ? "bg-nets-primary shadow-ambient-soft text-white"
                    : action.variant === "outline"
                      ? "border-nets-secondary text-nets-secondary border bg-white"
                      : "text-nets-on-surface shadow-ambient-soft bg-white"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    action.variant === "primary"
                      ? "bg-white/20"
                      : action.variant === "outline"
                        ? "bg-nets-secondary/10"
                        : "bg-nets-surface-container"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      action.variant === "primary"
                        ? "text-white"
                        : action.variant === "outline"
                          ? "text-nets-secondary"
                          : "text-nets-on-surface"
                    }`}
                  />
                </div>
                <span className="text-sm font-semibold">{action.name}</span>
              </button>
            );
          })}
        </div>

        {/* Member Contributions */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-nets-on-surface text-base font-bold">Member Contributions</h3>
            <Link to="/group" className="text-nets-secondary flex items-center gap-1 text-sm font-semibold">
              See All Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.name}
                className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-nets-on-surface text-sm font-semibold">{member.name}</span>
                      {member.isTop && <Flame className="text-nets-warning h-4 w-4" />}
                    </div>
                    {member.isTop && <span className="text-nets-secondary text-xs">Top contributor</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < Math.ceil(member.amount / 100) ? "bg-nets-secondary" : "bg-nets-surface-container-high"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-nets-on-surface text-sm font-bold">${member.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
