import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calculator, Info, Send, TrendingDown, TrendingUp } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { computeSettlement } from "#/lib/finance";

export const Route = createFileRoute("/trips/$tripId/split")({
  component: SmartSplitSummary,
});

function SmartSplitSummary() {
  const { tripId } = Route.useParams();
  const navigate = useNavigate();
  const { getTrip, getTripMembers, expenses, receipts, contributions, settledTripIds } = useApp();
  const trip = getTrip(tripId);
  const members = getTripMembers(tripId);

  if (!trip) {
    return (
      <AppLayout>
        <div className="flex min-h-dvh items-center justify-center px-6 text-center">
          <p className="text-nets-on-surface-variant text-sm">Trip not found.</p>
        </div>
      </AppLayout>
    );
  }

  const tripReceipts = receipts.filter((receipt) => receipt.tripId === tripId);
  const unclaimedReceipt = tripReceipts.find((receipt) => receipt.items.some((item) => item.claimedBy.length === 0));
  const settlement = computeSettlement(
    tripId,
    expenses,
    receipts,
    members,
    contributions[tripId] ?? {},
    settledTripIds.includes(tripId),
  );
  const receiving = settlement.splits.filter((entry) => entry.direction === "gets_back");
  const paying = settlement.splits.filter((entry) => entry.direction === "owes");

  return (
    <AppLayout hideNav>
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/trips/$tripId" params={{ tripId }} className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface size-5" />
        </Link>
        <h1 className="text-nets-primary flex-1 text-center text-lg font-bold">Smart Split</h1>
        <Info className="text-nets-secondary size-5" />
      </div>

      <div className="px-5 pb-28">
        <div className="mb-4">
          <h2 className="text-nets-on-surface text-2xl font-extrabold">{trip.name}</h2>
          <p className="text-nets-on-surface-variant text-sm">${settlement.totalSpent.toFixed(2)} across the group</p>
        </div>

        <div className="bg-nets-surface-container-low mb-5 flex items-center gap-2 rounded-xl p-3">
          <Calculator className="text-nets-secondary size-4 flex-shrink-0" />
          <p className="text-nets-on-surface-variant text-xs">
            Item claims + proportional fees + personal payments − wallet contributions
          </p>
        </div>

        {unclaimedReceipt && (
          <Link
            to="/trips/$tripId/claim"
            params={{ tripId }}
            search={{ receiptId: unclaimedReceipt.id }}
            className="border-nets-primary/20 bg-nets-primary/5 text-nets-primary mb-5 block rounded-2xl border p-4 text-sm font-semibold"
          >
            Finish claiming items from {unclaimedReceipt.merchantName} →
          </Link>
        )}

        {settlement.splits.length === 0 ? (
          <div className="shadow-ambient-soft rounded-2xl bg-white px-6 py-10 text-center">
            <h3 className="text-nets-on-surface font-bold">Everyone is even</h3>
            <p className="text-nets-on-surface-variant mt-1 text-sm">There are no outstanding balances right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <BalanceSection title="Receiving" entries={receiving} members={members} receiving />
            <BalanceSection title="Paying" entries={paying} members={members} />
          </div>
        )}
      </div>

      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={() => navigate({ to: "/trips/$tripId/settle", params: { tripId } })}
            disabled={Boolean(unclaimedReceipt)}
            className="bg-nets-primary h-14 w-full rounded-full text-base font-bold"
          >
            <Send data-icon="inline-start" />
            {settlement.status === "settled" ? "View settlement" : "Review settlement"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function BalanceSection({
  title,
  entries,
  members,
  receiving = false,
}: {
  title: string;
  entries: ReturnType<typeof computeSettlement>["splits"];
  members: ReturnType<ReturnType<typeof useApp>["getTripMembers"]>;
  receiving?: boolean;
}) {
  if (entries.length === 0) return null;
  const Icon = receiving ? TrendingUp : TrendingDown;
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={receiving ? "text-nets-success size-4" : "text-nets-error size-4"} />
        <h3 className={receiving ? "text-nets-success text-sm font-bold" : "text-nets-error text-sm font-bold"}>
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        {entries.map((entry) => {
          const member = members.find((candidate) => candidate.id === entry.memberId);
          return (
            <div
              key={entry.memberId}
              className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback>{member?.name[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-nets-on-surface font-bold">{member?.name ?? entry.memberId}</p>
                  <p className={receiving ? "text-nets-success text-xs" : "text-nets-error text-xs"}>
                    {receiving ? "Gets back" : "Needs to top up"}
                  </p>
                </div>
              </div>
              <span
                className={
                  receiving ? "text-nets-success text-lg font-extrabold" : "text-nets-error text-lg font-extrabold"
                }
              >
                {receiving ? "+" : "−"}${entry.amount.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
