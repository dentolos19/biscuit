import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  Clock3,
  Coins,
  Copy,
  ImagePlus,
  MapPin,
  Plane,
  Plus,
  Sparkles,
  Target,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Progress } from "#/components/ui/progress";
import { goalProgress } from "#/lib/finance";
import type { Member, PlanType, PlannedExpense, Trip } from "#/lib/types";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/")({
  component: CreateTripHome,
});

const planTypes: { value: PlanType; label: string }[] = [
  { value: "trip", label: "Trip" },
  { value: "event", label: "Event" },
  { value: "concert", label: "Concert" },
  { value: "gathering", label: "Gathering" },
  { value: "activity", label: "Activity" },
];

type BudgetDraftItem = {
  id: string;
  name: string;
  description: string;
  estimatedCost: string;
};

const dayMs = 24 * 60 * 60 * 1000;

function CreateTripHome() {
  const location = useLocation();
  const { trips, members, notifications, contributions, createTrip } = useApp();
  const contacts = members.filter((member) => !member.isCurrentUser).slice(0, 7);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const [planType, setPlanType] = useState<PlanType>("trip");
  const [tripName, setTripName] = useState("Year-end Grad Trip");
  const [destination, setDestination] = useState("Bangkok, Thailand");
  const [startDate, setStartDate] = useState(nextMonthDate());
  const [description, setDescription] = useState("A shared savings goal for flights, stay, food, and activities.");
  const [imageFileName, setImageFileName] = useState("");
  const [budgetItems, setBudgetItems] = useState<BudgetDraftItem[]>([]);
  const [goalOverride, setGoalOverride] = useState("");
  const [showAiBudget, setShowAiBudget] = useState(false);
  const [aiDuration, setAiDuration] = useState("5");
  const [aiStyle, setAiStyle] = useState("Balanced");
  const [aiFocus, setAiFocus] = useState("Food and activities");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(["yu-xiang", "miguel", "zavic"]);
  const [savingsMode, setSavingsMode] = useState<"equal" | "custom">("equal");
  const [memberTargets, setMemberTargets] = useState<Record<string, string>>({});
  const [inviteText, setInviteText] = useState("");
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [createdTripId, setCreatedTripId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(location.hash !== "home" && location.hash !== "#home");
  const [step, setStep] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  const plannedExpenses = normalizeBudgetItems(budgetItems);
  const budgetTotal = plannedExpenses.reduce((sum, item) => sum + item.estimatedCost, 0);
  const overrideGoal = parseMoney(goalOverride);
  const cost = overrideGoal > 0 ? overrideGoal : budgetTotal;
  const selectedMembers = useMemo(() => memberListForTrip(members, selectedMemberIds), [members, selectedMemberIds]);
  const daysLeft = countdownDays(startDate);
  const equalShare = selectedMembers.length > 0 ? Math.ceil(cost / selectedMembers.length) : cost;
  const previewTargets = buildMemberTargets(selectedMembers, equalShare, savingsMode, memberTargets);
  const targetTotal = Object.values(previewTargets).reduce((sum, value) => sum + value, 0);
  const previewSaved = Math.min(Math.round(cost * 0.22), cost);
  const previewRemaining = Math.max(cost - previewSaved, 0);
  const previewProgress = goalProgress(previewSaved, cost);
  const planLabel = planTypeLabel(planType);
  const goalWasAdjusted = overrideGoal > 0 && overrideGoal !== budgetTotal;
  const placeholderShareLink = `https://nets-biscuit.app/invite/${slugify(tripName || "new-plan")}`;

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    );
  };

  const addPendingInvite = () => {
    const value = inviteText.trim();
    if (!value) return;
    setPendingInvites((current) => Array.from(new Set([...current, value])));
    setInviteText("");
  };

  const updatePlanType = (type: PlanType) => {
    setPlanType(type);
    setGoalOverride("");
  };

  const addBudgetItem = () => {
    setBudgetItems((current) => [
      ...current,
      {
        id: makeBudgetItemId(),
        name: "",
        description: "",
        estimatedCost: "",
      },
    ]);
  };

  const updateBudgetItem = (id: string, patch: Partial<BudgetDraftItem>) => {
    setBudgetItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems((current) => current.filter((item) => item.id !== id));
  };

  const generateAiBudget = () => {
    setBudgetItems(generatePlaceholderBudgetItems(planType, aiDuration, aiStyle, aiFocus));
    setGoalOverride("");
    setShowAiBudget(false);
  };

  const validateTripDetails = () => {
    if (!tripName.trim()) {
      setError("Enter a plan name to continue.");
      return false;
    }
    if (!destination.trim()) {
      setError("Enter a location for this plan.");
      return false;
    }
    if (!startDate) {
      setError("Set the plan date so everyone can track the countdown.");
      return false;
    }
    setError("");
    return true;
  };

  const validateSavings = () => {
    if (!Number.isFinite(cost) || cost <= 0) {
      setError("Add at least one planned expense or enter a manual savings goal.");
      return false;
    }
    setError("");
    return true;
  };

  const goNext = () => {
    if (step === 0 && !validateTripDetails()) return;
    if (step === 1 && !validateSavings()) return;
    setStep((current) => Math.min(current + 1, 2));
  };

  const goBack = () => {
    if (step === 0) {
      setIsCreating(false);
      setError("");
      return;
    }
    setStep((current) => Math.max(current - 1, 0));
    setError("");
  };

  const startCreating = () => {
    setCreatedTripId(null);
    setError("");
    setStep(0);
    setIsCreating(true);
  };

  const handleCreate = () => {
    if (!validateTripDetails()) return;
    if (!Number.isFinite(cost) || cost <= 0) {
      setError("Add at least one planned expense or enter a manual savings goal.");
      return;
    }

    const trip = createTrip({
      name: tripName.trim(),
      planType,
      destination: destination.trim(),
      description: description.trim() || undefined,
      dates: formatTripDate(startDate),
      startDate,
      goal: cost,
      memberSavingsGoal: previewTargets,
      plannedExpenses,
      purposes: plannedExpenses.length ? plannedExpenses.map((item) => item.name) : defaultPurposes(planType),
      splitType: savingsMode === "equal" ? "equal" : "custom",
      memberIds: selectedMemberIds,
    });
    setCreatedTripId(trip.id);
    setIsCreating(false);
    setStep(0);
    setError("");
  };

  if (isCreating) {
    return (
      <AppLayout hideNav>
        <div className="bg-nets-surface flex min-h-dvh flex-col">
          <div className="bg-nets-surface/95 sticky top-0 z-40 px-5 py-3 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="text-nets-on-surface rounded-full bg-white px-4 py-2 text-sm font-extrabold shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
              >
                {step === 0 ? "Cancel" : "Back"}
              </button>
              <div className="text-center">
                <p className="text-nets-on-surface-variant text-xs font-bold">Step {step + 1} of 3</p>
                <h1 className="text-nets-on-surface text-lg font-extrabold">Create Trip/Event</h1>
              </div>
              <div className="w-18" />
            </div>
            <WizardProgress step={step} />
          </div>

          <div className="flex-1 px-5 py-5">
            {step === 0 && (
              <WizardPanel
                eyebrow="Plan details"
                title="What are you planning?"
                description="Choose the plan type, add a location, and set the date everyone is saving toward."
                icon={Plane}
              >
                <div className="space-y-5">
                  <div>
                    <p className="text-nets-on-surface mb-2 text-sm font-extrabold">Plan type</p>
                    <label className="border-nets-outline-variant flex h-12 items-center rounded-2xl border bg-white px-4">
                      <select
                        value={planType}
                        onChange={(event) => updatePlanType(event.target.value as PlanType)}
                        className="text-nets-on-surface w-full bg-transparent text-sm font-bold outline-none"
                      >
                        {planTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="border-nets-outline-variant/60 space-y-4 rounded-3xl border bg-white p-4">
                    <div>
                      <label className="text-nets-on-surface mb-2 block text-xs font-extrabold tracking-wide uppercase">
                        {planLabel} name
                      </label>
                      <Input
                        value={tripName}
                        onChange={(event) => {
                          setTripName(event.target.value);
                          setShareCopied(false);
                        }}
                        placeholder={`${planLabel} name`}
                        className="border-nets-outline-variant h-12 rounded-2xl bg-white text-base font-bold shadow-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-nets-on-surface mb-2 block text-xs font-extrabold tracking-wide uppercase">
                          Location
                        </label>
                        <div className="border-nets-outline-variant flex h-12 items-center gap-3 rounded-2xl border bg-white px-4">
                          <MapPin className="text-nets-secondary h-5 w-5 shrink-0" />
                          <input
                            type="text"
                            value={destination}
                            onChange={(event) => setDestination(event.target.value)}
                            placeholder="Any location, venue, or online link"
                            className="text-nets-on-surface placeholder:text-nets-tertiary w-full bg-transparent text-sm font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-nets-on-surface mb-2 block text-xs font-extrabold tracking-wide uppercase">
                          Date
                        </label>
                        <div className="border-nets-outline-variant flex h-12 items-center gap-3 rounded-2xl border bg-white px-4">
                          <CalendarDays className="text-nets-secondary h-5 w-5 shrink-0" />
                          <input
                            type="date"
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                            className="text-nets-on-surface w-full bg-transparent text-sm font-bold outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-nets-on-surface mb-2 block text-xs font-extrabold tracking-wide uppercase">
                        Notes
                      </label>
                      <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="What should the group know?"
                        rows={4}
                        className="border-nets-outline-variant text-nets-on-surface placeholder:text-nets-tertiary focus:border-nets-secondary min-h-28 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <label className="border-nets-outline-variant bg-nets-surface-container-low flex min-h-32 cursor-pointer items-center gap-4 rounded-3xl border border-dashed px-4 py-5">
                    <span className="text-nets-secondary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                      <ImagePlus className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-nets-on-surface block truncate text-sm font-extrabold">
                        {imageFileName || `Upload ${planLabel.toLowerCase()} image`}
                      </span>
                      <span className="text-nets-on-surface-variant mt-1 block text-xs font-semibold">
                        Placeholder area for now. Storage can be wired later.
                      </span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => setImageFileName(event.target.files?.[0]?.name ?? "")}
                    />
                  </label>
                </div>
              </WizardPanel>
            )}

            {step === 1 && (
              <WizardPanel
                eyebrow="Budget builder"
                title="Plan the expected costs"
                description="Add estimated expenses and Biscuit will calculate the savings goal for your group."
                icon={Target}
              >
                <div className="space-y-4">
                  <div className="bg-nets-primary rounded-3xl p-5 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold tracking-wide text-white/75 uppercase">
                          Auto-calculated estimate
                        </p>
                        <p className="mt-2 text-4xl font-extrabold">${budgetTotal.toLocaleString()}</p>
                      </div>
                      <div className="rounded-2xl bg-white/15 px-3 py-2 text-right">
                        <p className="text-lg font-extrabold">{plannedExpenses.length}</p>
                        <p className="text-[10px] font-bold text-white/75">items</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-white/75">
                      {goalWasAdjusted
                        ? `Manual goal set to $${cost.toLocaleString()}.`
                        : "This total becomes the savings goal unless you adjust it below."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <SectionLabel icon={Coins} title="Planned expenses" />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAiBudget((current) => !current)}
                          className="bg-nets-primary-fixed text-nets-primary rounded-full px-3 py-1.5 text-xs font-extrabold"
                        >
                          AI generate
                        </button>
                        <button
                          type="button"
                          onClick={addBudgetItem}
                          className="bg-nets-secondary-fixed text-nets-secondary rounded-full px-3 py-1.5 text-xs font-extrabold"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {showAiBudget && (
                      <div className="border-nets-primary/20 bg-nets-primary-fixed/30 space-y-3 rounded-3xl border p-4">
                        <div className="flex items-start gap-3">
                          <span className="bg-nets-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white">
                            <Sparkles className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-nets-on-surface text-sm font-extrabold">Generate expenses with AI</p>
                            <p className="text-nets-on-surface-variant mt-1 text-xs font-semibold">
                              Placeholder for now. Answer a few questions and Biscuit will fill sample expense items.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <label>
                            <span className="text-nets-on-surface mb-1 block text-xs font-extrabold">Days</span>
                            <Input
                              value={aiDuration}
                              onChange={(event) => setAiDuration(event.target.value.replace(/[^0-9]/g, ""))}
                              className="border-nets-outline-variant h-11 rounded-2xl bg-white text-sm font-bold shadow-none"
                            />
                          </label>
                          <label>
                            <span className="text-nets-on-surface mb-1 block text-xs font-extrabold">Style</span>
                            <select
                              value={aiStyle}
                              onChange={(event) => setAiStyle(event.target.value)}
                              className="border-nets-outline-variant text-nets-on-surface h-11 w-full rounded-2xl border bg-white px-3 text-sm font-bold outline-none"
                            >
                              <option>Budget</option>
                              <option>Balanced</option>
                              <option>Comfort</option>
                            </select>
                          </label>
                        </div>

                        <label>
                          <span className="text-nets-on-surface mb-1 block text-xs font-extrabold">Main focus</span>
                          <Input
                            value={aiFocus}
                            onChange={(event) => setAiFocus(event.target.value)}
                            placeholder="e.g. food, shopping, activities"
                            className="border-nets-outline-variant h-11 rounded-2xl bg-white text-sm shadow-none"
                          />
                        </label>

                        <Button
                          type="button"
                          onClick={generateAiBudget}
                          className="bg-nets-primary h-12 w-full rounded-full text-sm font-extrabold"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate sample expenses
                        </Button>
                      </div>
                    )}

                    {budgetItems.length === 0 ? (
                      <div className="border-nets-outline-variant/70 bg-nets-surface-container-low rounded-3xl border border-dashed px-5 py-8 text-center">
                        <p className="text-nets-on-surface text-sm font-extrabold">No expenses added yet</p>
                        <p className="text-nets-on-surface-variant mt-1 text-xs font-semibold">
                          Add items manually or use the placeholder AI generator to start a budget.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {budgetItems.map((item, index) => (
                          <BudgetItemCard
                            key={item.id}
                            item={item}
                            index={index}
                            removable
                            onChange={(patch) => updateBudgetItem(item.id, patch)}
                            onRemove={() => removeBudgetItem(item.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-nets-outline-variant/60 rounded-2xl border bg-white p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-nets-on-surface text-sm font-extrabold">Savings goal</p>
                        <p className="text-nets-on-surface-variant mt-1 text-xs font-semibold">
                          Defaults to your expense total. Adjust only if you want a buffer.
                        </p>
                      </div>
                      {goalOverride && (
                        <button
                          type="button"
                          onClick={() => setGoalOverride("")}
                          className="text-nets-secondary shrink-0 text-xs font-extrabold"
                        >
                          Use total
                        </button>
                      )}
                    </div>
                    <label className="border-nets-outline-variant flex h-13 items-center gap-2 rounded-2xl border px-4">
                      <span className="text-nets-primary text-lg font-extrabold">$</span>
                      <input
                        inputMode="numeric"
                        value={
                          goalOverride
                            ? formatInputMoney(goalOverride)
                            : budgetTotal > 0
                              ? formatInputMoney(String(budgetTotal))
                              : ""
                        }
                        onChange={(event) => setGoalOverride(event.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="Add expenses or enter goal"
                        className="text-nets-on-surface min-w-0 flex-1 bg-transparent text-2xl font-extrabold outline-none"
                      />
                    </label>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Metric icon={Clock3} label="Countdown" value={`${daysLeft}d`} />
                      <Metric icon={Coins} label="Needed" value={`$${previewRemaining.toLocaleString()}`} />
                      <Metric icon={Users} label="Members" value={String(selectedMembers.length)} />
                    </div>
                  </div>

                  <div className="border-nets-outline-variant/60 rounded-2xl border bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-nets-on-surface text-sm font-bold">Goal preview</p>
                      <p className="text-nets-primary text-sm font-extrabold">{previewProgress}%</p>
                    </div>
                    <Progress value={previewProgress} className="h-2.5 rounded-full" />
                  </div>
                </div>
              </WizardPanel>
            )}

            {step === 2 && (
              <WizardPanel
                eyebrow="Invite members"
                title="Bring your group in"
                description="Pick members, share a placeholder invite link, and decide whether each person saves the same amount."
                icon={UserPlus}
              >
                <div className="space-y-4">
                  <div className="border-nets-outline-variant/60 rounded-3xl border bg-white p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-nets-on-surface text-sm font-extrabold">Share invite link</p>
                        <p className="text-nets-on-surface-variant truncate text-xs font-semibold">
                          {placeholderShareLink}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          setShareCopied(true);
                          void navigator.clipboard?.writeText(placeholderShareLink);
                        }}
                        className="bg-nets-primary h-10 shrink-0 rounded-full px-4 text-xs font-extrabold"
                      >
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        {shareCopied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-nets-on-surface-variant text-xs font-semibold">
                      This placeholder can be replaced by the generated invite link later.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={inviteText}
                      onChange={(event) => setInviteText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addPendingInvite();
                        }
                      }}
                      placeholder="Email, phone, or name"
                      className="border-nets-outline-variant h-12 rounded-2xl bg-white"
                    />
                    <Button
                      type="button"
                      onClick={addPendingInvite}
                      className="bg-nets-secondary h-12 rounded-2xl px-4"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {contacts.map((member) => {
                      const selected = selectedMemberIds.includes(member.id);
                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => toggleMember(member.id)}
                          className="flex min-w-0 flex-col items-center gap-1"
                        >
                          <span className="relative">
                            <Avatar
                              className={
                                selected ? "ring-nets-secondary h-14 w-14 ring-2 ring-offset-2" : "h-14 w-14 opacity-60"
                              }
                            >
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-bold">
                                {member.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {selected && (
                              <span className="bg-nets-secondary absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-white">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </span>
                          <span className="text-nets-on-surface-variant w-full truncate text-center text-[10px] font-semibold">
                            {member.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {pendingInvites.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pendingInvites.map((invite) => (
                        <span
                          key={invite}
                          className="bg-nets-secondary-fixed text-nets-on-secondary-container rounded-full px-3 py-1 text-xs font-bold"
                        >
                          Invite pending: {invite}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <SectionLabel icon={Coins} title="Member savings" />
                    <div className="bg-nets-surface-container-low flex rounded-full p-1">
                      {(["equal", "custom"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSavingsMode(mode)}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                            savingsMode === mode
                              ? "text-nets-primary bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
                              : "text-nets-tertiary"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-[36dvh] space-y-2 overflow-y-auto pr-1">
                    {selectedMembers.map((member) => (
                      <MemberSavingsRow
                        key={member.id}
                        member={member}
                        amount={previewTargets[member.id] ?? equalShare}
                        editable={savingsMode === "custom"}
                        value={memberTargets[member.id] ?? ""}
                        onChange={(value) => setMemberTargets((current) => ({ ...current, [member.id]: value }))}
                      />
                    ))}
                  </div>
                  {savingsMode === "custom" && targetTotal !== cost && (
                    <p className="text-nets-warning text-xs font-semibold">
                      Custom member targets add up to ${targetTotal.toLocaleString()}, while the plan goal is $
                      {cost.toLocaleString()}.
                    </p>
                  )}
                </div>
              </WizardPanel>
            )}

            {error && (
              <p className="text-nets-error mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold">{error}</p>
            )}
          </div>

          <div className="border-nets-outline-variant/30 sticky bottom-0 bg-white/95 p-4 backdrop-blur-lg">
            <div className="mx-auto max-w-lg">
              <Button
                onClick={step === 2 ? handleCreate : goNext}
                className="bg-nets-primary h-14 w-full rounded-full text-base font-extrabold"
              >
                {step === 2 ? `Create ${planLabel} Group` : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-nets-surface/95 sticky top-0 z-40 flex items-center justify-between px-5 py-3 backdrop-blur-md">
        <div>
          <p className="text-nets-on-surface-variant text-xs font-semibold">NETS Biscuit</p>
          <h1 className="text-nets-on-surface text-lg font-extrabold">Trip & Event Groups</h1>
        </div>
        <Link to="/notifications" className="relative rounded-full bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
          <Bell className="text-nets-on-surface h-5 w-5" />
          {unreadCount > 0 && <span className="bg-nets-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />}
        </Link>
      </div>

      <div className="space-y-6 px-5 pb-6">
        <section className="shadow-ambient-soft rounded-3xl bg-white p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="bg-nets-primary-fixed text-nets-primary mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold">
                <Plane className="h-3.5 w-3.5" />
                Plan together
              </div>
              <h2 className="text-nets-on-surface text-2xl leading-tight font-extrabold">Start a group savings plan</h2>
              <p className="text-nets-on-surface-variant mt-2 text-sm leading-6">
                Create trips, events, concerts, gatherings, and activities one step at a time.
              </p>
            </div>
            <button
              type="button"
              onClick={startCreating}
              className="bg-nets-primary shadow-ambient-pop flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white active:scale-95"
              aria-label="Create trip or event group"
            >
              <Plus className="h-7 w-7" />
            </button>
          </div>

          {createdTripId ? (
            <Link
              to="/trips/$tripId"
              params={{ tripId: createdTripId }}
              className="bg-nets-success-container text-nets-on-surface flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold"
            >
              Plan created. Open details
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Button
              onClick={startCreating}
              className="bg-nets-primary h-13 w-full rounded-full text-base font-extrabold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Trip/Event
            </Button>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-nets-on-surface text-xl font-extrabold">Your trip and event groups</h2>
              <p className="text-nets-on-surface-variant text-sm">Track every group you are part of.</p>
            </div>
            <Link to="/trips" className="text-nets-secondary text-sm font-bold">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {trips.map((trip) => (
              <TripGroupCard
                key={trip.id}
                trip={trip}
                members={members}
                saved={contributionTotal(contributions[trip.id], trip.contribution)}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function WizardProgress({ step }: { step: number }) {
  const steps = ["Details", "Goal", "Invite"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((label, index) => (
        <div key={label}>
          <div
            className={cn("h-2 rounded-full", index <= step ? "bg-nets-primary" : "bg-nets-surface-container-high")}
          />
          <p
            className={cn(
              "mt-1 text-center text-[10px] font-extrabold",
              index <= step ? "text-nets-primary" : "text-nets-tertiary",
            )}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function WizardPanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Plane;
  children: ReactNode;
}) {
  return (
    <section className="shadow-ambient-soft rounded-3xl bg-white p-5">
      <div className="mb-5">
        <div className="bg-nets-secondary-fixed text-nets-secondary mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold">
          <Icon className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2 className="text-nets-on-surface text-2xl leading-tight font-extrabold">{title}</h2>
        <p className="text-nets-on-surface-variant mt-2 text-sm leading-6">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SectionLabel({ icon: Icon, title }: { icon: typeof Plane; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-nets-secondary-fixed flex h-8 w-8 items-center justify-center rounded-full">
        <Icon className="text-nets-secondary h-4 w-4" />
      </span>
      <h3 className="text-nets-on-surface text-sm font-extrabold">{title}</h3>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Plane; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
      <Icon className="text-nets-secondary mx-auto mb-1 h-4 w-4" />
      <p className="text-nets-on-surface text-base font-extrabold">{value}</p>
      <p className="text-nets-on-surface-variant text-[10px] font-bold">{label}</p>
    </div>
  );
}

function BudgetItemCard({
  item,
  index,
  removable,
  onChange,
  onRemove,
}: {
  item: BudgetDraftItem;
  index: number;
  removable: boolean;
  onChange: (patch: Partial<BudgetDraftItem>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border-nets-outline-variant/60 space-y-3 rounded-3xl border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-nets-on-surface text-sm font-extrabold">Expense {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          disabled={!removable}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            removable
              ? "bg-nets-surface-container-low text-nets-tertiary"
              : "bg-nets-surface-container-low text-nets-tertiary/40",
          )}
          aria-label="Remove expense"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <Input
          value={item.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="Expense name, e.g. Flights"
          className="border-nets-outline-variant h-12 rounded-2xl bg-white text-sm font-bold shadow-none"
        />
        <Input
          value={item.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Optional description"
          className="border-nets-outline-variant h-12 rounded-2xl bg-white text-sm shadow-none"
        />
        <label className="border-nets-outline-variant flex h-12 items-center gap-2 rounded-2xl border px-4">
          <span className="text-nets-primary text-sm font-extrabold">$</span>
          <input
            inputMode="numeric"
            value={formatInputMoney(item.estimatedCost)}
            onChange={(event) => onChange({ estimatedCost: event.target.value.replace(/[^0-9]/g, "") })}
            placeholder="Estimated cost"
            className="text-nets-on-surface placeholder:text-nets-tertiary min-w-0 flex-1 bg-transparent text-sm font-extrabold outline-none"
          />
        </label>
      </div>
    </div>
  );
}

function MemberSavingsRow({
  member,
  amount,
  editable,
  value,
  onChange,
}: {
  member: Member;
  amount: number;
  editable: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-nets-outline-variant/50 flex items-center gap-3 rounded-2xl border bg-white px-3 py-2.5">
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.avatarUrl} />
        <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-bold">
          {member.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-nets-on-surface truncate text-sm font-bold">{member.name}</p>
        <p className="text-nets-on-surface-variant text-xs">{member.isCurrentUser ? "You" : "Plan member"}</p>
      </div>
      {editable ? (
        <label className="border-nets-outline-variant flex h-10 w-28 items-center gap-1 rounded-xl border px-2">
          <span className="text-nets-primary text-sm font-bold">$</span>
          <input
            inputMode="numeric"
            value={formatInputMoney(value)}
            onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
            placeholder={String(amount)}
            className="text-nets-on-surface min-w-0 flex-1 bg-transparent text-right text-sm font-extrabold outline-none"
          />
        </label>
      ) : (
        <p className="text-nets-primary text-sm font-extrabold">${amount.toLocaleString()}</p>
      )}
    </div>
  );
}

function TripGroupCard({ trip, members, saved }: { trip: Trip; members: Member[]; saved: number }) {
  const progress = goalProgress(saved, trip.goal);
  const remaining = Math.max(trip.goal - saved, 0);
  const tripMembers = memberListForTrip(
    members,
    trip.memberIds.filter((memberId) => memberId !== "you"),
  );
  const daysLeft = countdownDays(trip.startDate);

  return (
    <Link
      to="/trips/$tripId"
      params={{ tripId: trip.id }}
      className="shadow-ambient-soft block overflow-hidden rounded-3xl bg-white transition-transform active:scale-[0.99]"
    >
      <div className="relative h-28 overflow-hidden">
        <img src={trip.imageUrl} alt={trip.destination} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-white">{trip.name}</h3>
            <p className="flex items-center gap-1 text-xs font-semibold text-white/85">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{trip.destination}</span>
            </p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/95 px-3 py-2 text-center">
            <p className="text-nets-primary text-lg font-extrabold">{daysLeft}</p>
            <p className="text-nets-on-surface-variant text-[10px] font-bold">days</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid grid-cols-3 gap-2">
          <DashboardStat label="Goal" value={`$${trip.goal.toLocaleString()}`} />
          <DashboardStat label="Saved" value={`$${saved.toLocaleString()}`} />
          <DashboardStat label="Members" value={String(trip.memberIds.length)} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-nets-on-surface text-sm font-extrabold">Savings progress</p>
            <p className="text-nets-primary text-sm font-extrabold">{progress}%</p>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
          <div className="mt-2 flex items-center justify-between text-xs font-semibold">
            <span className="text-nets-on-surface-variant">${remaining.toLocaleString()} still needed</span>
            <span className="text-nets-secondary">{trip.dates}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {tripMembers.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-white">
                <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-[10px] font-bold">
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-nets-secondary inline-flex items-center gap-1 text-xs font-extrabold">
            Open group
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-nets-surface-container-low rounded-2xl px-3 py-2">
      <p className="text-nets-on-surface truncate text-sm font-extrabold">{value}</p>
      <p className="text-nets-on-surface-variant text-[10px] font-bold">{label}</p>
    </div>
  );
}

function memberListForTrip(members: Member[], memberIds: string[]) {
  const ids = Array.from(new Set(["you", ...memberIds]));
  return ids.map((id) => members.find((member) => member.id === id)).filter((member) => member !== undefined);
}

function buildMemberTargets(
  selectedMembers: Member[],
  equalShare: number,
  savingsMode: "equal" | "custom",
  memberTargets: Record<string, string>,
) {
  return Object.fromEntries(
    selectedMembers.map((member) => [
      member.id,
      savingsMode === "equal" ? equalShare : parseMoney(memberTargets[member.id]) || equalShare,
    ]),
  );
}

function normalizeBudgetItems(items: BudgetDraftItem[]): PlannedExpense[] {
  return items
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
      description: item.description.trim() || undefined,
      estimatedCost: parseMoney(item.estimatedCost),
    }))
    .filter((item) => item.name && item.estimatedCost > 0);
}

function parseMoney(value: string) {
  return Number(value.replace(/,/g, "")) || 0;
}

function formatInputMoney(value: string) {
  const raw = value.replace(/[^0-9]/g, "");
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function contributionTotal(contributions: Record<string, number> | undefined, fallback: number) {
  if (!contributions) return fallback;
  return Object.values(contributions).reduce((sum, value) => sum + value, 0);
}

function nextMonthDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
}

function countdownDays(startDate: string | undefined) {
  if (!startDate) return 0;
  const target = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(Math.ceil((target.getTime() - today.getTime()) / dayMs), 0);
}

function formatTripDate(startDate: string) {
  const date = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return startDate;
  return new Intl.DateTimeFormat("en-SG", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function planTypeLabel(planType: PlanType) {
  return planTypes.find((type) => type.value === planType)?.label ?? "Plan";
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "new-plan";
}

function makeBudgetItemId() {
  return `budget-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function defaultPurposes(planType: PlanType) {
  if (planType === "concert") return ["Tickets", "Transport", "Food", "Merch"];
  if (planType === "event") return ["Tickets", "Venue", "Food", "Transport"];
  if (planType === "gathering") return ["Venue", "Food", "Drinks", "Activities"];
  if (planType === "activity") return ["Tickets", "Gear", "Food", "Transport"];
  return ["Flights", "Stay", "Food", "Activities"];
}

function generatePlaceholderBudgetItems(
  planType: PlanType,
  duration: string,
  style: string,
  focus: string,
): BudgetDraftItem[] {
  const days = Math.max(Number(duration) || 1, 1);
  const multiplier = style === "Budget" ? 0.75 : style === "Comfort" ? 1.35 : 1;
  const dailyFood = Math.round(days * 55 * multiplier);
  const focusLabel = focus.trim() || "Activities";

  const templates: Record<PlanType, Omit<BudgetDraftItem, "id">[]> = {
    trip: [
      { name: "Flights", description: "Estimated return tickets", estimatedCost: String(Math.round(650 * multiplier)) },
      {
        name: "Accommodation",
        description: `${days} nights stay`,
        estimatedCost: String(Math.round(days * 180 * multiplier)),
      },
      { name: "Food", description: `${days} days of meals`, estimatedCost: String(dailyFood) },
      {
        name: focusLabel,
        description: "Main experiences and extras",
        estimatedCost: String(Math.round(280 * multiplier)),
      },
      {
        name: "Transport",
        description: "Airport rides and local travel",
        estimatedCost: String(Math.round(160 * multiplier)),
      },
    ],
    event: [
      {
        name: "Venue",
        description: "Event space or booking fees",
        estimatedCost: String(Math.round(600 * multiplier)),
      },
      {
        name: "Food",
        description: "Snacks, catering, or shared meal",
        estimatedCost: String(Math.round(300 * multiplier)),
      },
      { name: focusLabel, description: "Main event costs", estimatedCost: String(Math.round(250 * multiplier)) },
      { name: "Transport", description: "Group transport buffer", estimatedCost: String(Math.round(120 * multiplier)) },
    ],
    concert: [
      { name: "Tickets", description: "Concert tickets", estimatedCost: String(Math.round(380 * multiplier)) },
      {
        name: "Transport",
        description: "Travel to and from venue",
        estimatedCost: String(Math.round(120 * multiplier)),
      },
      { name: "Food", description: "Food and drinks", estimatedCost: String(Math.round(90 * multiplier)) },
      { name: "Merch", description: "Optional merchandise", estimatedCost: String(Math.round(100 * multiplier)) },
    ],
    gathering: [
      { name: "Food", description: "Shared meal or catering", estimatedCost: String(Math.round(320 * multiplier)) },
      { name: "Drinks", description: "Drinks for the group", estimatedCost: String(Math.round(180 * multiplier)) },
      {
        name: focusLabel,
        description: "Games, decor, or activities",
        estimatedCost: String(Math.round(180 * multiplier)),
      },
      { name: "Venue", description: "Optional space booking", estimatedCost: String(Math.round(250 * multiplier)) },
    ],
    activity: [
      { name: "Tickets", description: "Entry or booking fees", estimatedCost: String(Math.round(180 * multiplier)) },
      { name: "Gear", description: "Rental or equipment", estimatedCost: String(Math.round(120 * multiplier)) },
      { name: "Food", description: "Meal or snacks", estimatedCost: String(Math.round(80 * multiplier)) },
      { name: "Transport", description: "Travel to activity", estimatedCost: String(Math.round(80 * multiplier)) },
    ],
  };

  return templates[planType].map((item, index) => ({
    ...item,
    id: `ai-${planType}-${slugify(item.name)}-${index}`,
  }));
}
