import { useSelector } from "@tanstack/react-store";
import { useEffect } from "react";

import { appStore } from "#/lib/app-store";

export function useDemoData() {
  const state = useSelector(appStore, (snapshot) => snapshot);

  useEffect(() => {
    appStore.actions.hydrate();
  }, []);

  return {
    ...state,
    ...appStore.actions,
    getTrip: (tripId: string) => state.trips.find((trip) => trip.id === tripId),
    getTripExpenses: (tripId: string) => state.expenses.filter((expense) => expense.tripId === tripId),
    getTripReceipts: (tripId: string) => state.receipts.filter((receipt) => receipt.tripId === tripId),
    getTripMembers: (tripId: string) => {
      const trip = state.trips.find((entry) => entry.id === tripId);
      if (!trip) return [];
      return trip.memberIds
        .map((memberId) => state.members.find((member) => member.id === memberId))
        .filter((member) => member !== undefined);
    },
  };
}
