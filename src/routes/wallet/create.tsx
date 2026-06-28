import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Plane,
  Calendar,
  ChevronDown,
  Plus,
  UserSearch,
  User,
  Info,
  Hotel,
  UtensilsCrossed,
  Car,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

export const Route = createFileRoute("/wallet/create")({
  component: CreateGroupWallet,
});

const destinations = ["Bangkok", "Taipei", "Seoul", "Tokyo", "Bali"];

const purposeOptions = [
  { name: "Airfare", icon: Plane, active: true },
  { name: "Hotel", icon: Hotel, active: false },
  { name: "Food", icon: UtensilsCrossed, active: false },
  { name: "Transport", icon: Car, active: false },
  { name: "Shopping", icon: ShoppingBag, active: false },
];

const friends = [
  { id: "yu-xiang", name: "Yu Xiang", avatar: "" },
  { id: "miguel", name: "Miguel", avatar: "" },
  { id: "zavic", name: "Zavic", avatar: "" },
];

function CreateGroupWallet() {
  const navigate = useNavigate();
  const { createTrip } = useApp();
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [goal, setGoal] = useState("2000");
  const [showDestinations, setShowDestinations] = useState(false);
  const [splitType, setSplitType] = useState<"equal" | "flexible" | "custom">("equal");
  const [purposes, setPurposes] = useState(purposeOptions.map((p) => p.active));
  const [selectedFriends, setSelectedFriends] = useState(["yu-xiang", "miguel", "zavic"]);
  const [error, setError] = useState("");

  const formatGoal = (value: string) => {
    const num = value.replace(/[^0-9]/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCreate = () => {
    const amount = Number(goal.replace(/,/g, ""));
    if (!tripName.trim() || !destination || !dates.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("Add a trip name, destination, dates, and savings goal.");
      return;
    }
    const trip = createTrip({
      name: tripName.trim(),
      destination,
      dates: dates.trim(),
      goal: amount,
      purposes: purposeOptions.filter((_, index) => purposes[index]).map((purpose) => purpose.name),
      splitType,
      memberIds: selectedFriends,
    });
    navigate({ to: "/trips/$tripId", params: { tripId: trip.id } });
  };

  return (
    <div className="bg-nets-surface mx-auto min-h-dvh max-w-lg">
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate({ to: "/" })} className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </button>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">New Wallet</h1>
        <div className="w-9" />
      </div>

      <div className="space-y-5 px-5 pb-24">
        {/* Trip Name */}
        <div className="space-y-2">
          <label className="text-nets-on-surface text-sm font-semibold">Trip Name</label>
          <Input
            placeholder="e.g. Bangkok Grad Trip"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="border-nets-outline-variant focus:border-nets-secondary focus:ring-nets-secondary rounded-xl bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.04)]"
          />
        </div>

        {/* Destination & Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-nets-on-surface text-sm font-semibold">Destination</label>
            <div className="relative">
              <button
                onClick={() => setShowDestinations(!showDestinations)}
                className="border-nets-outline-variant flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left shadow-[0px_2px_12px_rgba(0,0,0,0.04)]"
              >
                <Plane className="text-nets-secondary h-4 w-4" />
                <span className={`flex-1 text-sm ${destination ? "text-nets-on-surface" : "text-nets-tertiary"}`}>
                  {destination || "Select"}
                </span>
                <ChevronDown className="text-nets-tertiary h-4 w-4" />
              </button>
              {showDestinations && (
                <div className="border-nets-outline-variant shadow-ambient-pop absolute top-full right-0 left-0 z-10 mt-1 rounded-xl border bg-white">
                  {destinations.map((dest) => (
                    <button
                      key={dest}
                      onClick={() => {
                        setDestination(dest);
                        setShowDestinations(false);
                      }}
                      className="text-nets-on-surface hover:bg-nets-surface-container-low flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-nets-on-surface text-sm font-semibold">Travel Dates</label>
            <div className="border-nets-outline-variant flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 shadow-[0px_2px_12px_rgba(0,0,0,0.04)]">
              <Calendar className="text-nets-tertiary h-4 w-4" />
              <input
                type="text"
                placeholder="Add dates"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="text-nets-on-surface placeholder:text-nets-tertiary flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Target Savings Goal */}
        <div className="shadow-ambient-soft relative overflow-hidden rounded-2xl bg-white p-5">
          <div className="bg-nets-primary/5 absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl" />
          <label className="text-nets-on-surface mb-2 block text-sm font-semibold">Target Savings Goal</label>
          <div className="flex items-baseline gap-1">
            <span className="text-nets-primary text-4xl font-extrabold">$</span>
            <input
              type="text"
              value={formatGoal(goal)}
              onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, ""))}
              className="text-nets-on-surface flex-1 bg-transparent text-4xl font-extrabold focus:outline-none"
            />
          </div>
          <p className="text-nets-on-surface-variant mt-2 text-xs">Per person share will be calculated later</p>
        </div>

        {/* Invite Friends */}
        <div>
          <label className="text-nets-on-surface mb-3 block text-sm font-semibold">Invite Friends</label>
          <div className="snap-x-mandatory flex gap-3 overflow-x-auto pb-2">
            <button className="border-nets-outline-variant text-nets-tertiary flex h-16 w-16 flex-shrink-0 snap-start items-center justify-center rounded-full border-2 border-dashed">
              <Plus className="h-5 w-5" />
            </button>
            {friends.map((friend) => {
              const selected = selectedFriends.includes(friend.id);
              return (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() =>
                    setSelectedFriends((current) =>
                      current.includes(friend.id) ? current.filter((id) => id !== friend.id) : [...current, friend.id],
                    )
                  }
                  className="flex flex-shrink-0 snap-start flex-col items-center gap-1"
                >
                  <Avatar
                    className={`h-14 w-14 ${selected ? "ring-nets-secondary ring-2 ring-offset-2" : "opacity-60"}`}
                  >
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                      {friend.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-nets-on-surface-variant text-[10px] font-medium">{friend.name}</span>
                </button>
              );
            })}
            <div className="flex flex-shrink-0 snap-start flex-col items-center gap-1">
              <div className="bg-nets-surface-container flex h-14 w-14 items-center justify-center rounded-full">
                <User className="text-nets-tertiary h-5 w-5" />
              </div>
              <span className="text-nets-on-surface-variant text-[10px] font-medium">?</span>
            </div>
          </div>
          <button className="text-nets-secondary mt-2 flex items-center gap-1 text-sm font-semibold">
            <UserSearch className="h-4 w-4" />
            Find Contacts
          </button>
        </div>

        {/* Contribution Rules */}
        <div>
          <label className="text-nets-on-surface mb-3 block text-sm font-semibold">Contribution Rules</label>
          <div className="bg-nets-surface-container-low flex rounded-xl p-1 shadow-inner">
            {(["equal", "flexible", "custom"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSplitType(type)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
                  splitType === type ? "text-nets-on-surface shadow-ambient-soft bg-white" : "text-nets-tertiary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="bg-nets-secondary-fixed/30 mt-3 flex items-start gap-2 rounded-xl p-3">
            <Info className="text-nets-secondary mt-0.5 h-4 w-4 flex-shrink-0" />
            <p className="text-nets-on-secondary-container text-xs">
              Each member contributes an equal share of the total savings goal.
            </p>
          </div>
        </div>

        {/* Wallet Purpose */}
        <div>
          <label className="text-nets-on-surface mb-3 block text-sm font-semibold">Wallet Purpose</label>
          <div className="flex flex-wrap gap-2">
            {purposeOptions.map((purpose, i) => {
              const Icon = purpose.icon;
              return (
                <button
                  key={purpose.name}
                  onClick={() => {
                    const newPurposes = [...purposes];
                    newPurposes[i] = !newPurposes[i];
                    setPurposes(newPurposes);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    purposes[i]
                      ? "bg-nets-secondary text-white"
                      : "border-nets-outline-variant text-nets-tertiary border bg-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {purpose.name}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-nets-error rounded-xl bg-red-50 px-4 py-3 text-sm">{error}</p>}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={handleCreate}
            className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold"
          >
            Create Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
