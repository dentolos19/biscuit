import { expect, test } from "bun:test";

import { EXPENSES, RECEIPTS } from "./demo-data";
import { prepareReceiptDraft } from "./finance";

test("receipt totals use the items that will be saved and reject invalid fees", () => {
  const items = [
    { name: "Meal", price: "10", quantity: 2 },
    { name: "  ", price: "50", quantity: 1 },
    { name: "Invalid", price: "1.2.3", quantity: 1 },
  ];
  const draft = prepareReceiptDraft(items, "2", "1");
  expect(draft.items).toEqual([{ name: "Meal", price: 10, quantity: 2 }]);
  expect(draft.total).toBe(23);
  expect(draft.validFees).toBe(true);
  expect(prepareReceiptDraft(items, "-1", "0").validFees).toBe(false);
  expect(prepareReceiptDraft(items, "Infinity", "0").validFees).toBe(false);
});

test("demo receipt totals agree with their items and expenses", () => {
  for (const receipt of RECEIPTS) {
    const subtotal = receipt.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const expense = EXPENSES.find((entry) => entry.id === receipt.expenseId);
    expect(receipt.subtotal).toBeCloseTo(subtotal);
    expect(receipt.total).toBeCloseTo(subtotal + receipt.serviceCharge + receipt.tax);
    expect(expense?.amount).toBeCloseTo(receipt.total);
    expect(expense?.hasReceipt).toBe(true);
  }
});
