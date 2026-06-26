import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MoreVertical, MousePointer, Lock } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "#/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Progress } from "#/components/ui/progress";

export const Route = createFileRoute("/trips/$tripId/claim")({
  component: ItemClaiming,
});

const friends = [
  { name: "You", isMe: true },
  { name: "Yu Xiang" },
  { name: "Miguel" },
  { name: "Zavic" },
  { name: "Sean" },
];

const items = [
  {
    name: "Mango Sticky Rice",
    price: 12.5,
    qty: 1,
    claimedBy: ["Yu Xiang", "Miguel"],
    status: "split" as const,
  },
  {
    name: "Thai Milk Tea",
    price: 9.0,
    qty: 2,
    claimedBy: ["Zavic"],
    status: "claimed" as const,
  },
  {
    name: "Shibuya Toast",
    price: 18.9,
    qty: 1,
    claimedBy: ["Sean", "Yu Xiang"],
    status: "split" as const,
  },
  {
    name: "Service Charge",
    price: 4.04,
    qty: 1,
    claimedBy: [],
    status: "unclaimed" as const,
  },
];

export default function ItemClaiming() {
  const [selectedFriend, setSelectedFriend] = useState(0);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/" className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-on-surface flex-1 text-center text-base font-bold">After You Dessert</h1>
        <button className="rounded-full p-2">
          <MoreVertical className="text-nets-on-surface h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-24">
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-nets-on-surface text-2xl font-extrabold">Who paid for what?</h2>
          <p className="text-nets-on-surface-variant text-sm">Tap friends below to claim items...</p>
        </div>

        {/* Claiming Status Banner */}
        <div className="shadow-ambient-soft mb-4 rounded-2xl bg-white p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-nets-secondary-container text-sm text-white">M</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-nets-on-surface text-sm font-semibold">Miguel still needs to claim items</span>
                <span className="text-nets-secondary text-xs font-bold">75%</span>
              </div>
              <Progress value={75} className="mt-1.5 h-1.5 rounded-full" />
            </div>
          </div>
        </div>

        {/* Friends Picker */}
        <div className="snap-x-mandatory mb-5 flex gap-3 overflow-x-auto pb-2">
          {friends.map((friend, i) => (
            <button
              key={friend.name}
              onClick={() => setSelectedFriend(i)}
              className={`flex flex-shrink-0 snap-start flex-col items-center gap-1.5 transition-all ${
                selectedFriend === i ? "opacity-100" : "opacity-60"
              }`}
            >
              <div className={`relative rounded-full p-0.5 ${selectedFriend === i ? "ring-nets-primary ring-2" : ""}`}>
                <Avatar className="h-14 w-14">
                  <AvatarFallback
                    className={`text-sm font-semibold ${
                      friend.isMe
                        ? "bg-nets-primary-container text-white"
                        : "bg-nets-surface-container text-nets-on-surface"
                    }`}
                  >
                    {friend.name[0]}
                  </AvatarFallback>
                </Avatar>
                {friend.isMe && (
                  <span className="bg-nets-primary absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                    Me
                  </span>
                )}
              </div>
              <span className="text-nets-on-surface-variant text-xs font-medium">{friend.name}</span>
            </button>
          ))}
        </div>

        {/* Receipt Items */}
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.name}
              className={`shadow-ambient-soft rounded-2xl bg-white p-4 ${
                item.status === "unclaimed" ? "border-nets-outline-variant border-2 border-dashed" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-nets-on-surface text-sm font-bold">{item.name}</h3>
                    {item.qty > 1 && <span className="text-nets-on-surface-variant text-xs">{item.qty}x</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {item.status === "unclaimed" ? (
                      <span className="text-nets-primary flex items-center gap-1 text-xs font-medium">
                        <MousePointer className="h-3.5 w-3.5" />
                        Tap to claim
                      </span>
                    ) : (
                      <>
                        <div className="flex -space-x-1.5">
                          {item.claimedBy.map((name) => (
                            <Avatar key={name} className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-[10px] font-semibold">
                                {name[0]}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            item.status === "split"
                              ? "bg-nets-secondary/10 text-nets-secondary"
                              : "bg-nets-surface-container-high text-nets-tertiary"
                          }`}
                        >
                          {item.status === "split" ? `Split (${item.claimedBy.length})` : "Claimed"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-nets-on-surface text-base font-bold">${item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="shadow-ambient-soft mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <span className="text-nets-on-surface text-base font-bold">Total</span>
          <span className="text-nets-on-surface text-xl font-extrabold">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold">
            <Lock className="mr-2 h-5 w-5" />
            Lock Split
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
