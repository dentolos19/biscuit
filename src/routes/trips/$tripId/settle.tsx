import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowUp, Banknote, CheckCircle, FileText, PieChart, Wallet } from "lucide-react";

import { useApp } from "#/components/demo-data-provider";
import { Button } from "#/components/ui/button";
import { computeSettlement } from "#/lib/finance";

export const Route = createFileRoute("/trips/$tripId/settle")({
  component: EndTripSettlement,
});

const confetti = Array.from({ length: 12 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${58 + ((index * 11) % 30)}%`,
  delay: `${(index % 5) * 0.25}s`,
  duration: `${2 + (index % 3) * 0.5}s`,
  color: ["#b5000b", "#1261a3", "#f59e0b", "#0b8a00"][index % 4],
}));

function EndTripSettlement() {
  const { tripId } = Route.useParams();
  const navigate = useNavigate();
  const {
    getTrip,
    getTripMembers,
    expenses,
    receipts,
    contributions,
    settledTripIds,
    refundedTripIds,
    settleTrip,
    refundTrip,
  } = useApp();
  const trip = getTrip(tripId);
  const members = getTripMembers(tripId);
  const alreadySettled = settledTripIds.includes(tripId);
  const refunded = refundedTripIds.includes(tripId);
  const unclaimedReceipt = receipts.find(
    (receipt) => receipt.tripId === tripId && receipt.items.some((item) => item.claimedBy.length === 0),
  );

  if (!trip) {
    return (
      <div className="bg-nets-surface mx-auto flex min-h-dvh max-w-lg items-center justify-center px-6 text-center">
        <p className="text-nets-on-surface-variant text-sm">Trip not found.</p>
      </div>
    );
  }

  const settlement = computeSettlement(
    tripId,
    expenses,
    receipts,
    members,
    contributions[tripId] ?? {},
    alreadySettled,
  );
  const isSettled = alreadySettled;
  const hasWalletShortfall = settlement.remainingBalance < 0;

  const handleSettle = () => {
    if (unclaimedReceipt) return;
    settleTrip(tripId);
  };

  return (
    <div className="bg-nets-surface relative mx-auto min-h-dvh max-w-lg overflow-hidden">
      {isSettled && (
        <div className="pointer-events-none absolute inset-0">
          {confetti.map((particle, index) => (
            <div
              key={index}
              className="animate-float-up absolute size-2 rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
                backgroundColor: particle.color,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative flex min-h-dvh flex-col items-center px-5 pt-16 pb-8">
        <button
          onClick={() => navigate({ to: "/trips/$tripId/split", params: { tripId } })}
          className="absolute top-4 left-4 rounded-full p-2"
          aria-label="Back to split"
        >
          <ArrowLeft className="text-nets-on-surface size-5" />
        </button>

        <div
          className={`mb-5 flex size-20 items-center justify-center rounded-full ${isSettled ? "bg-nets-primary-fixed" : "bg-nets-secondary/10"}`}
        >
          {isSettled ? (
            <CheckCircle className="text-nets-primary size-10" />
          ) : (
            <Wallet className="text-nets-secondary size-9" />
          )}
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-nets-on-surface text-3xl font-extrabold">
            {isSettled ? "Trip settled!" : "Ready to settle?"}
          </h1>
          <p className="text-nets-on-surface-variant mt-2 text-sm">
            {isSettled
              ? `${trip.name} is officially in the books.`
              : "Review the final wallet totals, then complete the transfers with NETS."}
          </p>
        </div>

        <div className="shadow-ambient-soft mb-4 w-full rounded-2xl bg-white p-5">
          <div className="mb-4 text-center">
            <p className="text-nets-on-surface-variant text-sm font-medium">
              {hasWalletShortfall ? "Wallet Shortfall" : "Remaining Wallet Balance"}
            </p>
            <p className="text-nets-primary mt-1 text-4xl font-extrabold">
              ${Math.abs(settlement.remainingBalance).toFixed(2)}
            </p>
            {hasWalletShortfall && (
              <p className="text-nets-on-surface-variant mt-2 text-xs">
                Member top-ups below cover this amount before final transfers.
              </p>
            )}
          </div>
          <div className="border-nets-outline-variant flex items-center border-t pt-4">
            <div className="flex-1 text-center">
              <div className="mb-1 flex items-center justify-center gap-1">
                <ArrowUp className="text-nets-primary size-4" />
                <span className="text-nets-on-surface-variant text-xs">Contributed</span>
              </div>
              <p className="text-nets-on-surface text-lg font-bold">${settlement.totalContributed.toFixed(2)}</p>
            </div>
            <div className="bg-nets-outline-variant h-10 w-px" />
            <div className="flex-1 text-center">
              <div className="mb-1 flex items-center justify-center gap-1">
                <ArrowDown className="text-nets-secondary size-4" />
                <span className="text-nets-on-surface-variant text-xs">Spent</span>
              </div>
              <p className="text-nets-on-surface text-lg font-bold">${settlement.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-nets-secondary-fixed/30 mb-6 w-full rounded-2xl p-5 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <PieChart className="text-nets-secondary size-5" />
            <span className="text-nets-on-surface-variant text-sm font-medium">Average fair share</span>
          </div>
          <p className="text-nets-secondary text-3xl font-extrabold">${settlement.fairSharePerPerson.toFixed(2)}</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {!isSettled && unclaimedReceipt && (
            <Link
              to="/trips/$tripId/claim"
              params={{ tripId }}
              search={{ receiptId: unclaimedReceipt.id }}
              className="border-nets-primary/20 bg-nets-primary/5 text-nets-primary rounded-2xl border px-4 py-3 text-center text-sm font-semibold"
            >
              Finish claiming {unclaimedReceipt.merchantName} before settlement
            </Link>
          )}
          {!isSettled ? (
            <Button
              onClick={handleSettle}
              disabled={Boolean(unclaimedReceipt)}
              className="bg-nets-primary h-14 w-full rounded-full text-base font-bold"
            >
              <Wallet data-icon="inline-start" />
              Settle with NETS
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => refundTrip(tripId)}
              disabled={refunded || settlement.remainingBalance <= 0}
              className="border-nets-secondary text-nets-secondary h-12 w-full rounded-full"
            >
              {refunded ? <CheckCircle data-icon="inline-start" /> : <Banknote data-icon="inline-start" />}
              {refunded ? "Refund distributed" : "Refund remaining balance"}
            </Button>
          )}
          <Link
            to="/trips/$tripId/report"
            params={{ tripId }}
            className="text-nets-tertiary flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold"
          >
            <FileText className="size-4" />
            Export trip report
          </Link>
        </div>
      </div>
    </div>
  );
}
