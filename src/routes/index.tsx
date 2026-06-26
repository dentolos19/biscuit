// ── Home / Wallet Overview ──

import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Plane, MapPin, Calendar, Plus, Receipt, ScanLine, PieChart, Flame, ArrowRight } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Progress } from "#/components/ui/progress";
import { goalProgress } from "#/lib/finance";

export const Route = createFileRoute("/")({
  component: WalletOverview,
});

function WalletOverview() {
  const { trips, members, notifications, contributions } = useApp();
  const trip = trips.find((t) => t.status === "active") ?? trips[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!trip) {
    return (
      <AppLayout>
        <div className="bg-nets-surface mx-auto min-h-dvh max-w-lg">
          <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center justify-between px-5 py-3 backdrop-blur-md">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-nets-primary-container text-xs text-white">Y</AvatarFallback>
            </Avatar>
            <h1 className="text-nets-primary text-lg font-bold">NETS Biscuit</h1>
            <Link to="/notifications" className="relative rounded-full p-2">
              <Bell className="text-nets-on-surface h-5 w-5" />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="bg-nets-surface-container mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Plane className="text-nets-tertiary h-8 w-8" />
            </div>
            <h2 className="text-nets-on-surface mb-1 text-lg font-bold">No trips yet</h2>
            <p className="text-nets-on-surface-variant mb-4 text-sm">
              Create a group wallet to start saving with friends.
            </p>
            <Link
              to="/wallet/create"
              className="bg-nets-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Create Trip
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const progress = goalProgress(trip.contribution, trip.goal);
  const remaining = Math.max(trip.goal - trip.contribution, 0);
  const tripContribs = contributions[trip.id] ?? {};
  const tripMembers = trip.memberIds.map((id) => members.find((m) => m.id === id)).filter(Boolean);

  const quickActions = [
    { name: "Contribute", icon: Plus, variant: "primary" as const, href: "/group/contribution" },
    { name: "Add Expense", icon: Receipt, variant: "outline" as const, href: `/trips/${trip.id}/expenses/new` },
    { name: "Scan Receipt", icon: ScanLine, variant: "neutral" as const, href: "/scan" },
    { name: "View Split", icon: PieChart, variant: "neutral" as const, href: `/trips/${trip.id}/split` },
  ];

  return (
    <AppLayout>
      {/* Top App Bar */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center justify-between px-5 py-3 backdrop-blur-md">
        <Link to="/profile">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="You" />
            <AvatarFallback className="bg-nets-primary-container text-xs text-white">Y</AvatarFallback>
          </Avatar>
        </Link>
        <Link to="/" className="text-nets-primary text-lg font-bold">
          NETS Biscuit
        </Link>
        <Link to="/notifications" className="relative rounded-full p-2">
          <Bell className="text-nets-on-surface h-5 w-5" />
          {unreadCount > 0 && <span className="bg-nets-primary absolute top-1 right-1 h-2 w-2 rounded-full" />}
        </Link>
      </div>

      <div className="space-y-5 px-5 pb-4">
        {/* Hero Card */}
        <div className="shadow-ambient-soft relative overflow-hidden rounded-3xl bg-white p-5">
          <div className="bg-nets-secondary/5 absolute -top-8 -right-8 h-32 w-32 rounded-full blur-2xl" />

          <div className="bg-nets-secondary-fixed/50 mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1">
            <Plane className="text-nets-secondary h-3.5 w-3.5" />
            <span className="text-nets-secondary text-xs font-semibold">
              {trip.status === "active" ? "Active Trip" : trip.status === "upcoming" ? "Upcoming Trip" : "Completed"}
            </span>
          </div>

          <h2 className="text-nets-on-surface mb-2 text-2xl font-extrabold">{trip.name}</h2>

          <div className="text-nets-on-surface-variant mb-4 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {trip.destination}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {trip.dates}
            </span>
          </div>

          {/* Destination thumbnail */}
          <div className="bg-nets-surface-container mb-4 h-32 overflow-hidden rounded-2xl">
            <img src={trip.imageUrl} alt={trip.destination} className="h-full w-full object-cover" />
          </div>

          {/* Savings Progress */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-nets-primary text-3xl font-extrabold">${trip.contribution.toLocaleString()}</span>
              <span className="text-nets-on-surface-variant text-sm">/ ${trip.goal.toLocaleString()}</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-2.5 rounded-full" />
              <div className="absolute inset-0 h-2.5 overflow-hidden rounded-full">
                <div className="animate-shimmer h-full w-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="bg-nets-primary-fixed text-nets-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
                {progress}% Reached
              </span>
              <span className="text-nets-on-surface-variant text-xs">${remaining.toLocaleString()} to go</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
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
              </Link>
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
            {tripMembers.map((member) => {
              const amount = tripContribs[member!.id] ?? 0;
              return (
                <div
                  key={member!.id}
                  className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                        {member!.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-nets-on-surface text-sm font-semibold">{member!.name}</span>
                        {member!.isCurrentUser && <Flame className="text-nets-warning h-4 w-4" />}
                      </div>
                      {member!.isCurrentUser && <span className="text-nets-secondary text-xs">You</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            i < Math.ceil(amount / 100) ? "bg-nets-secondary" : "bg-nets-surface-container-high"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-nets-on-surface text-sm font-bold">${amount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
