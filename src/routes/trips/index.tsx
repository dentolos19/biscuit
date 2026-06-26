// ── Trips List Page ──

import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, MapPin, Calendar, Plus, ChevronRight } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Progress } from "#/components/ui/progress";
import { goalProgress } from "#/lib/finance";

export const Route = createFileRoute("/trips/")({
  component: TripsList,
});

const statusColors = {
  upcoming: "bg-nets-secondary-fixed text-nets-secondary",
  active: "bg-nets-primary-fixed text-nets-primary",
  completed: "bg-nets-surface-container-high text-nets-tertiary",
};

function TripsList() {
  const { trips, members } = useApp();

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center justify-between px-5 py-3 backdrop-blur-md">
        <h1 className="text-nets-primary text-lg font-bold">NETS Biscuit</h1>
        <Link
          to="/wallet/create"
          className="bg-nets-primary/10 text-nets-primary flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          New Trip
        </Link>
      </div>

      <div className="px-5 pb-24">
        <h2 className="text-nets-on-surface mb-1 text-2xl font-extrabold">My Trips</h2>
        <p className="text-nets-on-surface-variant mb-5 text-sm">Manage your shared wallets</p>

        {trips.length === 0 ? (
          <div className="shadow-ambient-soft flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center">
            <div className="bg-nets-surface-container mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Plane className="text-nets-tertiary h-8 w-8" />
            </div>
            <h3 className="text-nets-on-surface mb-1 text-base font-bold">No trips yet</h3>
            <p className="text-nets-on-surface-variant mb-4 text-sm">
              Create a group wallet to start saving with friends.
            </p>
            <Link
              to="/wallet/create"
              className="bg-nets-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map((trip) => {
              const progress = goalProgress(trip.contribution, trip.goal);
              const tripMembers = trip.memberIds.map((id) => members.find((m) => m.id === id)).filter(Boolean);
              const remaining = Math.max(trip.goal - trip.contribution, 0);

              return (
                <Link
                  key={trip.id}
                  to="/trips/$tripId"
                  params={{ tripId: trip.id }}
                  className="shadow-ambient-soft hover:shadow-ambient-pop block overflow-hidden rounded-2xl bg-white transition-all"
                >
                  {/* Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img src={trip.imageUrl} alt={trip.destination} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <Badge
                      variant="secondary"
                      className={`absolute top-2 left-2 gap-1 rounded-full text-xs font-semibold ${statusColors[trip.status]}`}
                    >
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                    <div className="absolute right-3 bottom-2 left-3">
                      <h3 className="text-lg font-extrabold text-white">{trip.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {trip.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {trip.dates}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Progress */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-nets-primary text-xl font-extrabold">
                          ${trip.contribution.toLocaleString()}
                        </span>
                        <span className="text-nets-on-surface-variant text-sm">/ ${trip.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-2 rounded-full" />
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-nets-on-surface-variant text-xs">{progress}% reached</span>
                        <span className="text-nets-on-surface-variant text-xs">
                          ${remaining.toLocaleString()} to go
                        </span>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {tripMembers.slice(0, 4).map((m) => (
                          <Avatar key={m!.id} className="h-7 w-7 border-2 border-white">
                            <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-[10px] font-semibold">
                              {m!.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {tripMembers.length > 4 && (
                          <Avatar className="h-7 w-7 border-2 border-white">
                            <AvatarFallback className="bg-nets-surface-container text-nets-tertiary text-[10px]">
                              +{tripMembers.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <ChevronRight className="text-nets-tertiary h-5 w-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
