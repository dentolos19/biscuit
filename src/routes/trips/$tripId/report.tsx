// ── Trip Report / Export Page ──

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  FileText,
  Plane,
  MapPin,
  Calendar,
  CheckCircle,
  TrendingDown,
  DollarSign,
} from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { computeSettlement, goalProgress } from "#/lib/finance";

export const Route = createFileRoute("/trips/$tripId/report")({
  component: TripReport,
});

function TripReport() {
  const { tripId } = Route.useParams();
  const { trips, expenses, receipts, members } = useApp();
  const trip = trips.find((t) => t.id === tripId);

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

  const tripMembers = trip.memberIds.map((id) => members.find((m) => m.id === id)).filter(Boolean);
  const settlement = computeSettlement(trip.id, trip.goal, expenses, receipts, tripMembers as any);
  const progress = goalProgress(trip.contribution, trip.goal);

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/trips/$tripId" params={{ tripId }} className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Trip Report</h1>
        <div className="w-9" />
      </div>

      <div className="px-5 pb-24">
        {/* Report Header */}
        <div className="shadow-ambient-soft relative overflow-hidden rounded-3xl bg-white p-5">
          <div className="bg-nets-secondary/5 absolute -top-8 -right-8 h-32 w-32 rounded-full blur-2xl" />
          <Badge
            variant="secondary"
            className="bg-nets-primary-fixed text-nets-primary mb-3 gap-1 rounded-full text-xs font-semibold"
          >
            <FileText className="h-3 w-3" />
            Summary Report
          </Badge>
          <h2 className="text-nets-on-surface mb-2 text-2xl font-extrabold">{trip.name}</h2>
          <div className="text-nets-on-surface-variant flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {trip.destination}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {trip.dates}
            </span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
            <div className="bg-nets-secondary/10 mb-2 flex h-8 w-8 items-center justify-center rounded-lg">
              <DollarSign className="text-nets-secondary h-4 w-4" />
            </div>
            <span className="text-nets-on-surface-variant text-xs">Total Contributed</span>
            <p className="text-nets-on-surface text-lg font-extrabold">
              ${settlement.totalContributed.toLocaleString()}
            </p>
          </div>
          <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
            <div className="bg-nets-primary/10 mb-2 flex h-8 w-8 items-center justify-center rounded-lg">
              <TrendingDown className="text-nets-primary h-4 w-4" />
            </div>
            <span className="text-nets-on-surface-variant text-xs">Total Spent</span>
            <p className="text-nets-on-surface text-lg font-extrabold">${settlement.totalSpent.toLocaleString()}</p>
          </div>
          <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-nets-on-surface-variant text-xs">Remaining</span>
            <p className="text-nets-on-surface text-lg font-extrabold">
              ${settlement.remainingBalance.toLocaleString()}
            </p>
          </div>
          <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <Plane className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-nets-on-surface-variant text-xs">Goal Progress</span>
            <p className="text-nets-on-surface text-lg font-extrabold">{progress}%</p>
          </div>
        </div>

        {/* Fair Share Breakdown */}
        <div className="mt-5">
          <h3 className="text-nets-on-surface mb-3 text-base font-bold">Fair Share per Person</h3>
          <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-nets-on-surface-variant text-sm">Per person average</span>
              <span className="text-nets-on-surface text-xl font-extrabold">
                ${settlement.fairSharePerPerson.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {settlement.splits.map((split) => {
                const member = tripMembers.find((m) => m?.id === split.memberId);
                return (
                  <div
                    key={split.memberId}
                    className="bg-nets-surface-container-low flex items-center justify-between rounded-xl px-3 py-2"
                  >
                    <span className="text-nets-on-surface text-sm font-semibold">{member?.name ?? split.memberId}</span>
                    <Badge
                      variant="secondary"
                      className={
                        split.direction === "gets_back"
                          ? "rounded-full bg-emerald-100 text-xs text-emerald-700"
                          : "rounded-full bg-red-100 text-xs text-red-700"
                      }
                    >
                      {split.direction === "gets_back" ? "+" : "-"}${split.amount.toFixed(2)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Export CTA */}
        <div className="mt-5">
          <Button className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold">
            <Download data-icon="inline-start" className="h-5 w-5" />
            Download PDF Report
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
