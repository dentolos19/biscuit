import { createFileRoute, Link } from "@tanstack/react-router";
import { PieChart } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";

export const Route = createFileRoute("/split/")({
  component: SmartSplitIndex,
});

function SmartSplitIndex() {
  const { trips, receipts, members } = useApp();
  const tripsWithExpenses = trips.filter((trip) => receipts.some((receipt) => receipt.tripId === trip.id));

  return (
    <AppLayout>
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-5 py-3 backdrop-blur-md">
        <h1 className="text-nets-primary flex-1 text-lg font-bold">Smart Split</h1>
      </div>
      <div className="px-5 pb-24">
        <p className="text-nets-on-surface-variant mb-5 text-sm">Receipt splits from your trips</p>
        {tripsWithExpenses.length === 0 ? (
          <div className="shadow-ambient-soft rounded-2xl bg-white px-6 py-12 text-center">
            <PieChart className="text-nets-tertiary mx-auto mb-3 size-9" />
            <h2 className="text-nets-on-surface font-bold">No splits yet</h2>
            <p className="text-nets-on-surface-variant mt-1 text-sm">Scan a receipt to start claiming items.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tripsWithExpenses.map((trip) => {
              const tripReceipts = receipts.filter((receipt) => receipt.tripId === trip.id);
              const total = tripReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
              const tripMembers = trip.memberIds
                .map((id) => members.find((member) => member.id === id))
                .filter((member) => member !== undefined);
              return (
                <Link
                  key={trip.id}
                  to="/trips/$tripId/split"
                  params={{ tripId: trip.id }}
                  className="shadow-ambient-soft block rounded-2xl bg-white p-4 transition-all"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-nets-on-surface font-bold">{trip.name}</h3>
                    <span className="text-nets-on-surface-variant text-xs">{tripReceipts.length} receipts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {tripMembers.slice(0, 4).map((member) => (
                        <Avatar key={member.id} className="size-7 border-2 border-white">
                          <AvatarFallback className="text-[10px]">{member.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-nets-on-surface text-lg font-extrabold">${total.toFixed(2)}</span>
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
