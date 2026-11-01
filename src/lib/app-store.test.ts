import { afterEach, expect, test } from "bun:test";

import { appStore } from "./app-store";

afterEach(() => appStore.actions.reset());

test("locking a receipt prevents further claim changes and duplicate lock activity", () => {
  appStore.actions.reset();
  appStore.actions.lockReceipt("rec-1");
  const lockedReceipt = structuredClone(appStore.state.receipts.find((receipt) => receipt.id === "rec-1"));
  const activityCount = appStore.state.activities.length;

  appStore.actions.claimItem("rec-1", "item-1", "you");
  appStore.actions.lockReceipt("rec-1");

  expect(lockedReceipt?.locked).toBe(true);
  expect(appStore.state.receipts.find((receipt) => receipt.id === "rec-1")).toEqual(lockedReceipt);
  expect(appStore.state.activities).toHaveLength(activityCount);
});
