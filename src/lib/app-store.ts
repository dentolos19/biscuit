import { Store } from "@tanstack/store";

import {
  ACTIVITIES,
  CONTACTS,
  CONTRIBUTIONS,
  EXPENSES,
  MEMBERS,
  NOTIFICATIONS,
  RECEIPTS,
  TRIPS,
} from "#/lib/demo-data";
import type {
  Activity,
  Expense,
  Member,
  Notification,
  PlanType,
  PlannedExpense,
  Receipt,
  Trip,
  TripStatus,
} from "#/lib/types";

const STORAGE_KEY = "nets-biscuit-demo";
const STORAGE_VERSION = 3;

export type AppState = {
  version: number;
  hydrated: boolean;
  trips: Trip[];
  members: Member[];
  expenses: Expense[];
  receipts: Receipt[];
  notifications: Notification[];
  activities: Activity[];
  contributions: Record<string, Record<string, number>>;
  settledTripIds: string[];
  refundedTripIds: string[];
  autoContributionByTrip: Record<string, boolean>;
};

type CreateTripInput = {
  name: string;
  planType?: PlanType;
  destination: string;
  description?: string;
  dates: string;
  startDate?: string;
  goal: number;
  memberSavingsGoal?: Record<string, number>;
  plannedExpenses?: PlannedExpense[];
  purposes: string[];
  splitType: Trip["splitType"];
  memberIds: string[];
};

type AddReceiptInput = {
  tripId: string;
  merchantName: string;
  date: string;
  serviceCharge: number;
  tax: number;
  items: { name: string; price: number; quantity: number }[];
  paidBy: string;
  paidFrom: "wallet" | "personal";
};

const contactMembers: Member[] = CONTACTS.map((contact) => ({
  id: contact.id,
  name: contact.name,
}));

const initialMembers = [...MEMBERS];
for (const contact of contactMembers) {
  if (!initialMembers.some((member) => member.id === contact.id)) {
    initialMembers.push(contact);
  }
}

function freshState(): AppState {
  return structuredClone({
    version: STORAGE_VERSION,
    hydrated: false,
    trips: TRIPS,
    members: initialMembers,
    expenses: EXPENSES,
    receipts: RECEIPTS,
    notifications: NOTIFICATIONS,
    activities: ACTIVITIES,
    contributions: CONTRIBUTIONS,
    settledTripIds: ["bali-2024"],
    refundedTripIds: ["bali-2024"],
    autoContributionByTrip: {},
  });
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, hydrated: false }));
  } catch {
    // The proof-of-concept remains usable if storage is unavailable.
  }
}

function commit(setState: (updater: (previous: AppState) => AppState) => void, updater: (state: AppState) => AppState) {
  setState((state) => {
    const next = updater(state);
    saveState(next);
    return next;
  });
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function destinationImage(destination: string) {
  const value = destination.toLowerCase();
  if (value.includes("tokyo")) {
    return "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop";
  }
  if (value.includes("bali")) {
    return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=400&fit=crop";
  }
  return "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=400&fit=crop";
}

export const appStore = new Store(freshState(), ({ setState }) => ({
  hydrate() {
    if (typeof window === "undefined" || appStore.state.hydrated) return;
    let next = freshState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<AppState>;
        next = {
          ...next,
          ...saved,
          version: STORAGE_VERSION,
          hydrated: true,
          members: saved.members?.length ? saved.members : next.members,
          settledTripIds: saved.settledTripIds ?? next.settledTripIds,
          refundedTripIds: saved.refundedTripIds ?? [],
          autoContributionByTrip: saved.autoContributionByTrip ?? {},
        };
      } else {
        next.hydrated = true;
      }
    } catch {
      next.hydrated = true;
    }
    setState(() => next);
  },

  addExpense(expense: Omit<Expense, "id">) {
    const created: Expense = { ...expense, id: makeId("exp") };
    commit(setState, (state) => ({
      ...state,
      expenses: [...state.expenses, created],
    }));
    return created;
  },

  addReceipt(input: AddReceiptInput) {
    const receiptId = makeId("rec");
    const expenseId = makeId("exp");
    const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + input.serviceCharge + input.tax;
    const receipt: Receipt = {
      id: receiptId,
      tripId: input.tripId,
      merchantName: input.merchantName,
      date: input.date,
      subtotal,
      serviceCharge: input.serviceCharge,
      tax: input.tax,
      total,
      expenseId,
      locked: false,
      items: input.items.map((item) => ({
        ...item,
        id: makeId("item"),
        receiptId,
        claimedBy: [],
      })),
    };
    const expense: Expense = {
      id: expenseId,
      tripId: input.tripId,
      name: input.merchantName,
      amount: total,
      category: "food",
      paidBy: input.paidBy,
      paidFrom: input.paidFrom,
      status: "scanning",
      date: input.date,
      hasReceipt: true,
      receiptId,
    };
    commit(setState, (state) => ({
      ...state,
      receipts: [...state.receipts, receipt],
      expenses: [...state.expenses, expense],
      activities: [
        {
          id: makeId("act"),
          tripId: input.tripId,
          type: "receipt_scanned",
          memberId: input.paidBy,
          message: `${input.merchantName} receipt scanned ($${total.toFixed(2)})`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
    return receipt;
  },

  claimItem(receiptId: string, itemId: string, memberId: string) {
    commit(setState, (state) => {
      const receipt = state.receipts.find((entry) => entry.id === receiptId);
      const item = receipt?.items.find((entry) => entry.id === itemId);
      const wasClaimed = item?.claimedBy.includes(memberId) ?? false;
      return {
        ...state,
        receipts: state.receipts.map((entry) =>
          entry.id !== receiptId
            ? entry
            : {
                ...entry,
                items: entry.items.map((receiptItem) =>
                  receiptItem.id !== itemId
                    ? receiptItem
                    : {
                        ...receiptItem,
                        claimedBy: wasClaimed
                          ? receiptItem.claimedBy.filter((id) => id !== memberId)
                          : [...receiptItem.claimedBy, memberId],
                      },
                ),
              },
        ),
        activities:
          !wasClaimed && receipt && item
            ? [
                {
                  id: makeId("act"),
                  tripId: receipt.tripId,
                  type: "item_claimed" as const,
                  memberId,
                  message: `${state.members.find((member) => member.id === memberId)?.name ?? "Someone"} claimed ${item.name}`,
                  timestamp: "Just now",
                },
                ...state.activities,
              ]
            : state.activities,
      };
    });
  },

  lockReceipt(receiptId: string) {
    commit(setState, (state) => {
      const receipt = state.receipts.find((entry) => entry.id === receiptId);
      if (!receipt || receipt.items.some((item) => item.claimedBy.length === 0)) return state;
      return {
        ...state,
        receipts: state.receipts.map((entry) => (entry.id === receiptId ? { ...entry, locked: true } : entry)),
        expenses: state.expenses.map((expense) =>
          expense.receiptId === receiptId ? { ...expense, status: "paid" as const } : expense,
        ),
        activities: [
          {
            id: makeId("act"),
            tripId: receipt.tripId,
            type: "split_locked",
            memberId: "you",
            message: `${receipt.merchantName} split was locked`,
            timestamp: "Just now",
          },
          ...state.activities,
        ],
      };
    });
  },

  markNotificationRead(id: string) {
    commit(setState, (state) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    }));
  },

  markAllNotificationsRead() {
    commit(setState, (state) => ({
      ...state,
      notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
    }));
  },

  addActivity(activity: Omit<Activity, "id">) {
    commit(setState, (state) => ({
      ...state,
      activities: [{ ...activity, id: makeId("act") }, ...state.activities],
    }));
  },

  addReaction(activityId: string, emoji: string) {
    commit(setState, (state) => ({
      ...state,
      activities: state.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        const reactions = [...(activity.reactions ?? [])];
        const index = reactions.findIndex((reaction) => reaction.emoji === emoji);
        if (index >= 0) {
          reactions[index] = { ...reactions[index], count: reactions[index].count + 1 };
        } else {
          reactions.push({ emoji, count: 1 });
        }
        return { ...activity, reactions };
      }),
    }));
  },

  addContribution(tripId: string, memberId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    commit(setState, (state) => {
      const contributions = { ...state.contributions };
      const tripContributions = { ...(contributions[tripId] ?? {}) };
      tripContributions[memberId] = (tripContributions[memberId] ?? 0) + amount;
      contributions[tripId] = tripContributions;
      const trip = state.trips.find((entry) => entry.id === tripId);
      const member = state.members.find((entry) => entry.id === memberId);
      const total = Object.values(tripContributions).reduce((sum, value) => sum + value, 0);
      return {
        ...state,
        contributions,
        trips: state.trips.map((entry) => (entry.id === tripId ? { ...entry, contribution: total } : entry)),
        notifications: [
          {
            id: makeId("notification"),
            type: total >= (trip?.goal ?? Infinity) ? "milestone" : "contribution",
            title: total >= (trip?.goal ?? Infinity) ? "Savings goal reached!" : "Contribution added",
            message: `${member?.name ?? "A member"} contributed $${amount.toFixed(2)} to ${trip?.name ?? "the trip"}.`,
            tripId,
            timestamp: "Just now",
            read: false,
          },
          ...state.notifications,
        ],
        activities: [
          {
            id: makeId("act"),
            tripId,
            type: total >= (trip?.goal ?? Infinity) ? "milestone" : "contribution",
            memberId,
            message:
              total >= (trip?.goal ?? Infinity)
                ? `${trip?.name ?? "The trip"} reached its savings goal!`
                : `${member?.name ?? "A member"} contributed $${amount.toFixed(2)}`,
            timestamp: "Just now",
          },
          ...state.activities,
        ],
      };
    });
  },

  createTrip(input: CreateTripInput) {
    const id = `${input.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
    const newTrip: Trip = {
      id,
      name: input.name,
      planType: input.planType ?? "trip",
      destination: input.destination,
      description: input.description,
      imageUrl: destinationImage(input.destination),
      dates: input.dates,
      startDate: input.startDate,
      status: "upcoming",
      goal: input.goal,
      contribution: 0,
      memberIds: Array.from(new Set(["you", ...input.memberIds])),
      memberSavingsGoal: input.memberSavingsGoal,
      plannedExpenses: input.plannedExpenses,
      purposes: input.purposes,
      splitType: input.splitType,
    };
    commit(setState, (state) => ({
      ...state,
      trips: [newTrip, ...state.trips],
      contributions: {
        ...state.contributions,
        [id]: Object.fromEntries(newTrip.memberIds.map((memberId) => [memberId, 0])),
      },
      activities: [
        {
          id: makeId("act"),
          tripId: id,
          type: "milestone",
          memberId: "you",
          message: `${newTrip.name} wallet was created`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
    return newTrip;
  },

  addMembers(tripId: string, memberIds: string[]) {
    commit(setState, (state) => {
      const trip = state.trips.find((entry) => entry.id === tripId);
      if (!trip) return state;
      const nextIds = Array.from(new Set([...trip.memberIds, ...memberIds]));
      const contributions = {
        ...state.contributions,
        [tripId]: {
          ...(state.contributions[tripId] ?? {}),
          ...Object.fromEntries(memberIds.map((memberId) => [memberId, state.contributions[tripId]?.[memberId] ?? 0])),
        },
      };
      return {
        ...state,
        contributions,
        trips: state.trips.map((entry) => (entry.id === tripId ? { ...entry, memberIds: nextIds } : entry)),
      };
    });
  },

  setAutoContribution(tripId: string, enabled: boolean) {
    commit(setState, (state) => ({
      ...state,
      autoContributionByTrip: { ...state.autoContributionByTrip, [tripId]: enabled },
    }));
  },

  settleTrip(tripId: string) {
    commit(setState, (state) => {
      const settledTripIds = Array.from(new Set([...state.settledTripIds, tripId]));
      const trip = state.trips.find((entry) => entry.id === tripId);
      return {
        ...state,
        settledTripIds,
        trips: state.trips.map((entry) =>
          entry.id === tripId ? { ...entry, status: "completed" as TripStatus } : entry,
        ),
        notifications: [
          {
            id: makeId("notification"),
            type: "settlement",
            title: "Trip settled",
            message: `${trip?.name ?? "Your trip"} has been settled with NETS.`,
            tripId,
            timestamp: "Just now",
            read: false,
          },
          ...state.notifications,
        ],
      };
    });
  },

  refundTrip(tripId: string) {
    commit(setState, (state) => {
      if (!state.settledTripIds.includes(tripId)) return state;
      const trip = state.trips.find((entry) => entry.id === tripId);
      return {
        ...state,
        refundedTripIds: Array.from(new Set([...state.refundedTripIds, tripId])),
        notifications: [
          {
            id: makeId("notification"),
            type: "settlement",
            title: "Wallet balance refunded",
            message: `${trip?.name ?? "Your trip"} remaining balance was distributed to contributors.`,
            tripId,
            timestamp: "Just now",
            read: false,
          },
          ...state.notifications,
        ],
      };
    });
  },

  reset() {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    setState(() => ({ ...freshState(), hydrated: true }));
  },
}));
