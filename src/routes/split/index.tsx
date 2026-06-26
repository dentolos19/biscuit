import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Receipt, TrendingDown } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";

export const Route = createFileRoute("/split/")({
  component: SmartSplitIndex,
});

const recentSplits = [
  {
    trip: "Tokyo Trip 2024",
    items: 4,
    total: 44.44,
    date: "2 hours ago",
    people: ["You", "Yu Xiang", "Miguel", "Zavic"],
  },
  {
    trip: "Bali Trip 2024",
    items: 6,
    total: 86.4,
    date: "Yesterday",
    people: ["You", "Jason Tan", "Sarah Lim"],
  },
];

export default function SmartSplitIndex() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-5 py-3 backdrop-blur-md">
        <h1 className="text-nets-primary flex-1 text-lg font-bold">Smart Split</h1>
      </div>

      <div className="px-5 pb-4">
        <p className="text-nets-on-surface-variant mb-5 text-sm">Recent splits from your trips</p>

        <div className="space-y-3">
          {recentSplits.map((split) => (
            <Link
              key={split.trip}
              to="/trips/tokyo-2024/split"
              className="shadow-ambient-soft hover:shadow-ambient-pop block rounded-2xl bg-white p-4 transition-all"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-nets-on-surface text-base font-bold">{split.trip}</h3>
                <span className="text-nets-on-surface-variant text-xs">{split.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {split.people.slice(0, 3).map((name) => (
                      <Avatar key={name} className="h-7 w-7 border-2 border-white">
                        <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-[10px] font-semibold">
                          {name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {split.people.length > 3 && (
                      <Avatar className="h-7 w-7 border-2 border-white">
                        <AvatarFallback className="bg-nets-surface-container text-nets-tertiary text-[10px]">
                          +{split.people.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <span className="text-nets-on-surface-variant text-xs">{split.items} items</span>
                </div>
                <span className="text-nets-on-surface text-lg font-extrabold">${split.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
