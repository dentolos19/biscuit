// ── Trip Detail Dashboard ──

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Plus,
  Receipt,
  ScanLine,
  PieChart,
  Users,
  Bell,
  Share2,
  FileText,
  ChevronRight,
  Clock3,
} from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Progress } from "#/components/ui/progress";
import { goalProgress, tripExpenses } from "#/lib/finance";
import type { PlanType } from "#/lib/types";

export const Route = createFileRoute("/trips/$tripId/")({
  component: TripDetail,
});

function TripDetail() {
  const { trips, expenses, contributions, members } = useApp();
  const { tripId } = Route.useParams();
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <AppLayout>
        <div className="flex h-dvh flex-col items-center justify-center px-6 text-center">
          <p className="text-nets-on-surface-variant text-sm">Trip not found.</p>
          <Link to="/" hash="home" className="text-nets-secondary mt-2 text-sm font-semibold">
            Go back home
          </Link>
        </div>
      </AppLayout>
    );
  }

  const progress = goalProgress(trip.contribution, trip.goal);
  const remaining = Math.max(trip.goal - trip.contribution, 0);
  const tripExpensesList = tripExpenses(trip.id, expenses);
  const tripMembers = trip.memberIds.map((id) => members.find((m) => m.id === id)).filter(Boolean);
  const tripContribs = contributions[trip.id] ?? {};
  const planLabel = planTypeLabel(trip.planType);
  const countdown = countdownSummary(trip.startDate);
  const countdownTitle = countdown.days === 0 ? `${planLabel} starts today` : `${countdown.days} days to go`;

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/" hash="home" className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-primary flex-1 text-center text-lg font-bold">NETS Biscuit</h1>
        <div className="flex gap-1">
          <Link to="/notifications" className="rounded-full p-2">
            <Bell className="text-nets-on-surface h-5 w-5" />
          </Link>
          <Link to="/trips/$tripId/invite" params={{ tripId }} className="rounded-full p-2">
            <Share2 className="text-nets-on-surface h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="px-5 pb-24">
        {/* Hero Card */}
        <div className="shadow-ambient-soft relative overflow-hidden rounded-3xl bg-white p-5">
          <div className="bg-nets-secondary/5 absolute -top-8 -right-8 h-32 w-32 rounded-full blur-2xl" />

          <Badge
            variant="secondary"
            className="bg-nets-secondary-fixed/50 text-nets-secondary mb-3 gap-1 rounded-full text-xs font-semibold"
          >
            {trip.status === "active"
              ? `Active ${planLabel}`
              : trip.status === "upcoming"
                ? `Upcoming ${planLabel}`
                : `Completed ${planLabel}`}
          </Badge>

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

          {/* Image */}
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
              <Badge
                variant="secondary"
                className="bg-nets-primary-fixed text-nets-primary rounded-full text-xs font-semibold"
              >
                {progress}% Reached
              </Badge>
              <span className="text-nets-on-surface-variant text-xs">${remaining.toLocaleString()} to go</span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-5">
          <h3 className="text-nets-on-surface mb-3 text-base font-bold">{planLabel} Countdown</h3>
          <div className="shadow-ambient-soft overflow-hidden rounded-3xl bg-white">
            <div className="bg-nets-primary px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-wide text-white/75 uppercase">Before it begins</p>
                  <h4 className="mt-1 text-3xl font-extrabold">{countdownTitle}</h4>
                  <p className="mt-1 text-sm font-semibold text-white/75">
                    {countdown.helperText || `${trip.name} is coming up on ${trip.dates}.`}
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <Clock3 className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4">
              <CountdownStat label="Weeks" value={String(countdown.weeks)} />
              <CountdownStat label="Days" value={String(countdown.remainingDays)} />
              <CountdownStat label="Date" value={trip.dates} compact />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            to="/group/contribution"
            search={{ tripId }}
            className="bg-nets-primary shadow-ambient-soft flex items-center gap-3 rounded-2xl p-4 text-white transition-all active:scale-[0.97]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">Contribute</span>
          </Link>
          <Link
            to="/trips/$tripId/expenses/new"
            params={{ tripId }}
            className="border-nets-secondary text-nets-secondary shadow-ambient-soft flex items-center gap-3 rounded-2xl border bg-white p-4 transition-all active:scale-[0.97]"
          >
            <div className="bg-nets-secondary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <Receipt className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">Add Expense</span>
          </Link>
          <Link
            to="/scan"
            search={{ tripId }}
            className="shadow-ambient-soft text-nets-on-surface flex items-center gap-3 rounded-2xl bg-white p-4 transition-all active:scale-[0.97]"
          >
            <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
              <ScanLine className="text-nets-on-surface h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">Scan Receipt</span>
          </Link>
          <Link
            to="/trips/$tripId/split"
            params={{ tripId }}
            className="shadow-ambient-soft text-nets-on-surface flex items-center gap-3 rounded-2xl bg-white p-4 transition-all active:scale-[0.97]"
          >
            <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
              <PieChart className="text-nets-on-surface h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">View Split</span>
          </Link>
        </div>

        {/* Member Contributions */}
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-nets-on-surface text-base font-bold">Members</h3>
            <Link
              to="/trips/$tripId/invite"
              params={{ tripId }}
              className="text-nets-secondary flex items-center gap-1 text-sm font-semibold"
            >
              <Users className="h-4 w-4" />
              Invite
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {tripMembers.map((m) => (
              <div
                key={m!.id}
                className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                      {m!.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-nets-on-surface text-sm font-semibold">
                      {m!.name}
                      {m!.isCurrentUser && <span className="text-nets-tertiary ml-1 text-xs">(You)</span>}
                    </span>
                  </div>
                </div>
                <span className="text-nets-on-surface text-sm font-bold">
                  ${(tripContribs[m!.id] ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-nets-on-surface text-base font-bold">Recent Expenses</h3>
            <Link
              to="/trips/$tripId/expenses"
              params={{ tripId }}
              className="text-nets-secondary flex items-center gap-1 text-sm font-semibold"
            >
              See All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {tripExpensesList.length === 0 ? (
            <div className="shadow-ambient-soft flex flex-col items-center rounded-2xl bg-white px-4 py-8 text-center">
              <Receipt className="text-nets-tertiary mb-2 h-8 w-8" />
              <p className="text-nets-on-surface-variant text-sm">No expenses yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tripExpensesList.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
                      <Receipt className="text-nets-tertiary h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-nets-on-surface text-sm font-semibold">{exp.name}</span>
                      <p className="text-nets-on-surface-variant text-xs">
                        {exp.status === "paid" ? "Paid" : exp.status === "scanning" ? "Scanning" : "Pending"}
                      </p>
                    </div>
                  </div>
                  <span className="text-nets-on-surface text-sm font-bold">${exp.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export */}
        <Link
          to="/trips/$tripId/report"
          params={{ tripId }}
          className="shadow-ambient-soft mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 transition-all active:scale-[0.97]"
        >
          <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
            <FileText className="text-nets-on-surface h-5 w-5" />
          </div>
          <div className="flex-1">
            <span className="text-nets-on-surface text-sm font-semibold">Export Trip Report</span>
            <p className="text-nets-on-surface-variant text-xs">Download summary as PDF</p>
          </div>
          <ChevronRight className="text-nets-tertiary h-5 w-5" />
        </Link>
      </div>
    </AppLayout>
  );
}

function CountdownStat({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="bg-nets-surface-container-low min-w-0 rounded-2xl px-3 py-3 text-center">
      <p
        className={cnText(
          "text-nets-on-surface truncate font-extrabold",
          compact ? "text-xs leading-5" : "text-2xl leading-none",
        )}
      >
        {value}
      </p>
      <p className="text-nets-on-surface-variant mt-1 text-[10px] font-bold">{label}</p>
    </div>
  );
}

function countdownSummary(startDate: string | undefined) {
  if (!startDate) {
    return {
      days: 0,
      weeks: 0,
      remainingDays: 0,
      helperText: "Add a date to unlock a live countdown.",
    };
  }

  const target = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) {
    return {
      days: 0,
      weeks: 0,
      remainingDays: 0,
      helperText: "Add a date to unlock a live countdown.",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.max(Math.ceil((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)), 0);

  return {
    days,
    weeks: Math.floor(days / 7),
    remainingDays: days % 7,
    helperText: days === 0 ? "Time to enjoy the plan with your group." : "Keep the group excited and on track.",
  };
}

function planTypeLabel(planType: PlanType | undefined) {
  if (!planType) return "Trip";
  return planType.charAt(0).toUpperCase() + planType.slice(1);
}

function cnText(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
