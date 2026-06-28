import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, MousePointer } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Progress } from "#/components/ui/progress";

export const Route = createFileRoute("/trips/$tripId/claim")({
  validateSearch: (search: Record<string, unknown>) => ({
    receiptId: typeof search.receiptId === "string" ? search.receiptId : undefined,
  }),
  component: ItemClaiming,
});

function ItemClaiming() {
  const { tripId } = Route.useParams();
  const { receiptId } = Route.useSearch();
  const navigate = useNavigate();
  const { getTrip, getTripMembers, getTripReceipts, claimItem, lockReceipt } = useApp();
  const trip = getTrip(tripId);
  const members = getTripMembers(tripId);
  const receipts = getTripReceipts(tripId);
  const receipt =
    receipts.find((entry) => entry.id === receiptId) ??
    [...receipts].reverse().find((entry) => !entry.locked) ??
    receipts.at(-1);
  const [selectedMemberId, setSelectedMemberId] = useState("you");

  if (!trip || !receipt) {
    return (
      <AppLayout>
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
          <p className="text-nets-on-surface-variant text-sm">No scanned receipt was found for this trip.</p>
          <Link to="/scan" search={{ tripId }} className="text-nets-secondary mt-3 text-sm font-semibold">
            Scan a receipt
          </Link>
        </div>
      </AppLayout>
    );
  }

  const claimedCount = receipt.items.filter((item) => item.claimedBy.length > 0).length;
  const progress = Math.round((claimedCount / Math.max(receipt.items.length, 1)) * 100);
  const canLock = claimedCount === receipt.items.length;
  const selectedMember = members.find((member) => member.id === selectedMemberId);

  const handleLock = () => {
    if (!canLock) return;
    lockReceipt(receipt.id);
    navigate({ to: "/trips/$tripId/split", params: { tripId } });
  };

  return (
    <AppLayout hideNav>
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/trips/$tripId/expenses" params={{ tripId }} className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface size-5" />
        </Link>
        <h1 className="text-nets-on-surface flex-1 text-center text-base font-bold">{receipt.merchantName}</h1>
        <div className="size-9" />
      </div>

      <div className="px-5 pb-28">
        <div className="mb-4">
          <h2 className="text-nets-on-surface text-2xl font-extrabold">Who had what?</h2>
          <p className="text-nets-on-surface-variant text-sm">Choose a friend, then tap each item they shared.</p>
        </div>

        <div className="shadow-ambient-soft mb-4 rounded-2xl bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nets-on-surface text-sm font-semibold">
                {canLock ? "Every item is claimed" : `${receipt.items.length - claimedCount} items still need a claim`}
              </p>
              <p className="text-nets-on-surface-variant text-xs">Taxes and service are allocated proportionally.</p>
            </div>
            <span className="text-nets-secondary text-xs font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-1.5 rounded-full" />
        </div>

        <div className="snap-x-mandatory mb-5 flex gap-3 overflow-x-auto pb-2">
          {members.map((member) => {
            const selected = member.id === selectedMemberId;
            return (
              <button
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={`flex flex-shrink-0 snap-start flex-col items-center gap-1.5 ${selected ? "" : "opacity-55"}`}
              >
                <Avatar className={`size-14 ${selected ? "ring-nets-primary ring-2 ring-offset-2" : ""}`}>
                  <AvatarFallback className={member.isCurrentUser ? "bg-nets-primary text-white" : ""}>
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-nets-on-surface-variant text-xs font-medium">{member.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          {receipt.items.map((item) => {
            const selectedClaim = item.claimedBy.includes(selectedMemberId);
            return (
              <button
                key={item.id}
                onClick={() => claimItem(receipt.id, item.id, selectedMemberId)}
                className={`shadow-ambient-soft rounded-2xl bg-white p-4 text-left transition-all ${
                  selectedClaim ? "ring-nets-secondary ring-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-nets-on-surface text-sm font-bold">{item.name}</h3>
                      {item.quantity > 1 && (
                        <span className="text-nets-on-surface-variant text-xs">{item.quantity}×</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {item.claimedBy.length === 0 ? (
                        <span className="text-nets-primary flex items-center gap-1 text-xs font-medium">
                          <MousePointer className="size-3.5" />
                          Tap to claim for {selectedMember?.name}
                        </span>
                      ) : (
                        <>
                          <div className="flex -space-x-1.5">
                            {item.claimedBy.map((memberId) => {
                              const member = members.find((entry) => entry.id === memberId);
                              return (
                                <Avatar key={memberId} className="size-6 border-2 border-white">
                                  <AvatarFallback className="text-[10px]">{member?.name[0] ?? "?"}</AvatarFallback>
                                </Avatar>
                              );
                            })}
                          </div>
                          <span className="bg-nets-secondary/10 text-nets-secondary rounded-full px-2 py-0.5 text-xs font-semibold">
                            {item.claimedBy.length === 1 ? "Claimed" : `Shared by ${item.claimedBy.length}`}
                          </span>
                          {selectedClaim && <Check className="text-nets-secondary size-4" />}
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-nets-on-surface text-base font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="shadow-ambient-soft mt-4 rounded-2xl bg-white p-4">
          <div className="text-nets-on-surface-variant flex justify-between text-xs">
            <span>Service + tax</span>
            <span>${(receipt.serviceCharge + receipt.tax).toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-nets-on-surface font-bold">Total</span>
            <span className="text-nets-on-surface text-xl font-extrabold">${receipt.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={handleLock}
            disabled={!canLock}
            className="bg-nets-primary h-14 w-full rounded-full text-base font-bold"
          >
            <Lock data-icon="inline-start" />
            {canLock
              ? "Lock split"
              : `Claim ${receipt.items.length - claimedCount} more item${receipt.items.length - claimedCount === 1 ? "" : "s"}`}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
