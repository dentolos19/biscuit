// ── Hook for managing demo data with local persistence ──

import { useState, useCallback } from "react";

import {
  TRIPS as INITIAL_TRIPS,
  MEMBERS,
  EXPENSES as INITIAL_EXPENSES,
  RECEIPTS as INITIAL_RECEIPTS,
  NOTIFICATIONS as INITIAL_NOTIFICATIONS,
  ACTIVITIES as INITIAL_ACTIVITIES,
  CONTRIBUTIONS as INITIAL_CONTRIBUTIONS,
} from "#/lib/demo-data";
import type { Expense, Receipt, Notification, Activity, Member } from "#/lib/types";

const STORAGE_KEY = "nets-biscuit-demo";

type DemoState = {
  trips: typeof INITIAL_TRIPS;
  expenses: Expense[];
  receipts: Receipt[];
  notifications: Notification[];
  activities: Activity[];
  contributions: Record<string, Record<string, number>>;
};

function loadState(): DemoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: DemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail
  }
}

const DEFAULT_STATE: DemoState = {
  trips: INITIAL_TRIPS,
  expenses: INITIAL_EXPENSES,
  receipts: INITIAL_RECEIPTS,
  notifications: INITIAL_NOTIFICATIONS,
  activities: INITIAL_ACTIVITIES,
  contributions: INITIAL_CONTRIBUTIONS,
};

let nextId = 100;
function genId(prefix: string) {
  return `${prefix}-${++nextId}`;
}

export function useDemoData() {
  const [state, setState] = useState<DemoState>(() => loadState() ?? DEFAULT_STATE);

  const persist = useCallback((next: DemoState) => {
    setState(next);
    saveState(next);
  }, []);

  const addExpense = useCallback(
    (expense: Omit<Expense, "id">) => {
      const newExpense: Expense = { ...expense, id: genId("exp") };
      persist({
        ...state,
        expenses: [...state.expenses, newExpense],
      });
      return newExpense;
    },
    [state, persist],
  );

  const addReceipt = useCallback(
    (receipt: Omit<Receipt, "id">) => {
      const newReceipt: Receipt = { ...receipt, id: genId("rec") };
      persist({
        ...state,
        receipts: [...state.receipts, newReceipt],
      });
      return newReceipt;
    },
    [state, persist],
  );

  const claimItem = useCallback(
    (receiptId: string, itemId: string, memberId: string) => {
      const receipts = state.receipts.map((r) => {
        if (r.id !== receiptId) return r;
        return {
          ...r,
          items: r.items.map((item) => {
            if (item.id !== itemId) return item;
            const claimedBy = item.claimedBy.includes(memberId)
              ? item.claimedBy.filter((id) => id !== memberId)
              : [...item.claimedBy, memberId];
            return { ...item, claimedBy };
          }),
        };
      });
      persist({ ...state, receipts });
    },
    [state, persist],
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      const notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist({ ...state, notifications });
    },
    [state, persist],
  );

  const markAllNotificationsRead = useCallback(() => {
    const notifications = state.notifications.map((n) => ({ ...n, read: true }));
    persist({ ...state, notifications });
  }, [state, persist]);

  const addActivity = useCallback(
    (activity: Omit<Activity, "id">) => {
      const newActivity: Activity = { ...activity, id: genId("act") };
      persist({
        ...state,
        activities: [newActivity, ...state.activities],
      });
    },
    [state, persist],
  );

  const addContribution = useCallback(
    (tripId: string, memberId: string, amount: number) => {
      const contributions = { ...state.contributions };
      const tripContribs = { ...(contributions[tripId] ?? {}) };
      tripContribs[memberId] = (tripContribs[memberId] ?? 0) + amount;
      contributions[tripId] = tripContribs;

      // Update trip contribution total
      const trips = state.trips.map((t) => {
        if (t.id !== tripId) return t;
        return { ...t, contribution: Object.values(tripContribs).reduce((s, v) => s + v, 0) };
      });

      persist({ ...state, contributions, trips });
    },
    [state, persist],
  );

  const createTrip = useCallback(
    (trip: {
      name: string;
      destination: string;
      dates: string;
      goal: number;
      purposes: string[];
      splitType: "equal" | "flexible" | "custom";
    }) => {
      const id =
        trip.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") +
        "-" +
        Date.now();
      const newTrip = {
        id,
        name: trip.name,
        destination: trip.destination,
        imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=200&fit=crop",
        dates: trip.dates,
        status: "upcoming" as const,
        goal: trip.goal,
        contribution: 0,
        memberIds: ["you"],
        purposes: trip.purposes,
        splitType: trip.splitType,
      };
      persist({
        ...state,
        trips: [...state.trips, newTrip],
        contributions: { ...state.contributions, [id]: { you: 0 } },
      });
      return newTrip;
    },
    [state, persist],
  );

  const getTrip = useCallback((tripId: string) => state.trips.find((t) => t.id === tripId), [state.trips]);

  const getTripExpenses = useCallback(
    (tripId: string) => state.expenses.filter((e) => e.tripId === tripId),
    [state.expenses],
  );

  const getTripReceipts = useCallback(
    (tripId: string) => state.receipts.filter((r) => r.tripId === tripId),
    [state.receipts],
  );

  const getTripMembers = useCallback(
    (tripId: string) => {
      const trip = state.trips.find((t) => t.id === tripId);
      if (!trip) return [];
      return trip.memberIds.map((id) => MEMBERS.find((m) => m.id === id)).filter(Boolean) as Member[];
    },
    [state.trips],
  );

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  }, []);

  return {
    trips: state.trips,
    expenses: state.expenses,
    receipts: state.receipts,
    notifications: state.notifications,
    activities: state.activities,
    contributions: state.contributions,
    members: MEMBERS,
    addExpense,
    addReceipt,
    claimItem,
    markNotificationRead,
    markAllNotificationsRead,
    addActivity,
    addContribution,
    createTrip,
    getTrip,
    getTripExpenses,
    getTripReceipts,
    getTripMembers,
    reset,
  };
}
