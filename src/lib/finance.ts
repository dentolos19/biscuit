import type { Expense, Member, Receipt, ReceiptItem, Settlement, SplitEntry } from "#/lib/types";

export function totalContributed(contributions: Record<string, number>): number {
  return Object.values(contributions).reduce((sum, value) => sum + value, 0);
}

export function memberContributions(contributions: Record<string, number>) {
  return Object.entries(contributions).map(([memberId, amount]) => ({ memberId, amount }));
}

export function goalProgress(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

export function tripExpenses(tripId: string, expenses: Expense[]): Expense[] {
  return expenses.filter((expense) => expense.tripId === tripId);
}

export function totalExpenses(tripId: string, expenses: Expense[]): number {
  return tripExpenses(tripId, expenses).reduce((sum, expense) => sum + expense.amount, 0);
}

export function receiptSubtotal(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function itemShare(item: ReceiptItem): number {
  if (item.claimedBy.length === 0) return 0;
  return (item.price * item.quantity) / item.claimedBy.length;
}

export function receiptSplit(
  receipt: Receipt,
): { memberId: string; subtotal: number; taxAndService: number; total: number }[] {
  const memberMap = new Map<string, { subtotal: number; taxAndService: number }>();

  for (const item of receipt.items) {
    const share = itemShare(item);
    for (const memberId of item.claimedBy) {
      const existing = memberMap.get(memberId) ?? { subtotal: 0, taxAndService: 0 };
      existing.subtotal += share;
      memberMap.set(memberId, existing);
    }
  }

  const extra = receipt.serviceCharge + receipt.tax;
  const claimedSubtotal = Array.from(memberMap.values()).reduce((sum, value) => sum + value.subtotal, 0);
  if (claimedSubtotal > 0) {
    for (const value of memberMap.values()) {
      value.taxAndService = (value.subtotal / claimedSubtotal) * extra;
    }
  }

  return Array.from(memberMap.entries()).map(([memberId, value]) => ({
    memberId,
    subtotal: value.subtotal,
    taxAndService: value.taxAndService,
    total: value.subtotal + value.taxAndService,
  }));
}

function expenseLiabilities(expense: Expense, receipt: Receipt | undefined, members: Member[]) {
  if (receipt?.items.some((item) => item.claimedBy.length > 0)) {
    const splits = receiptSplit(receipt);
    const allocated = splits.reduce((sum, split) => sum + split.total, 0);
    const scale = allocated > 0 ? expense.amount / allocated : 1;
    return splits.map(({ memberId, total }) => ({ memberId, amount: total * scale }));
  }
  const share = expense.amount / Math.max(members.length, 1);
  return members.map((member) => ({ memberId: member.id, amount: share }));
}

export function tripSplits(
  tripId: string,
  expenses: Expense[],
  receipts: Receipt[],
  members: Member[],
  contributions: Record<string, number>,
): SplitEntry[] {
  if (members.length === 0) return [];

  const memberIds = new Set(members.map((member) => member.id));
  const paid = new Map(members.map((member) => [member.id, contributions[member.id] ?? 0]));
  const liabilities = new Map(members.map((member) => [member.id, 0]));
  const receiptMap = new Map(receipts.map((receipt) => [receipt.id, receipt]));
  const tripExpenseList = tripExpenses(tripId, expenses);

  let walletSpent = 0;
  for (const expense of tripExpenseList) {
    const paidFrom = expense.paidFrom ?? "wallet";
    if (paidFrom === "wallet") {
      walletSpent += expense.amount;
    } else if (memberIds.has(expense.paidBy)) {
      paid.set(expense.paidBy, (paid.get(expense.paidBy) ?? 0) + expense.amount);
    }

    const receipt = expense.receiptId ? receiptMap.get(expense.receiptId) : undefined;
    for (const liability of expenseLiabilities(expense, receipt, members)) {
      if (memberIds.has(liability.memberId)) {
        liabilities.set(liability.memberId, (liabilities.get(liability.memberId) ?? 0) + liability.amount);
      }
    }
  }

  const contributed = totalContributed(contributions);
  const remainingWallet = contributed - walletSpent;
  for (const member of members) {
    const contribution = contributions[member.id] ?? 0;
    const refund =
      contributed > 0 ? remainingWallet * (contribution / contributed) : remainingWallet / Math.max(members.length, 1);
    paid.set(member.id, (paid.get(member.id) ?? 0) - refund);
  }

  return members.flatMap((member) => {
    const difference = (paid.get(member.id) ?? 0) - (liabilities.get(member.id) ?? 0);
    if (Math.abs(difference) < 0.01) return [];
    const amount = Math.abs(difference);
    return [
      {
        memberId: member.id,
        amount,
        direction: difference > 0 ? "gets_back" : "owes",
        description: difference > 0 ? `gets back $${amount.toFixed(2)}` : `owes $${amount.toFixed(2)}`,
      },
    ];
  });
}

export function computeSettlement(
  tripId: string,
  expenses: Expense[],
  receipts: Receipt[],
  members: Member[],
  contributions: Record<string, number>,
  settled = false,
): Settlement {
  const contributed = totalContributed(contributions);
  const spent = totalExpenses(tripId, expenses);
  const walletSpent = tripExpenses(tripId, expenses)
    .filter((expense) => (expense.paidFrom ?? "wallet") === "wallet")
    .reduce((sum, expense) => sum + expense.amount, 0);

  return {
    tripId,
    totalContributed: contributed,
    totalSpent: spent,
    remainingBalance: contributed - walletSpent,
    fairSharePerPerson: spent / Math.max(members.length, 1),
    splits: tripSplits(tripId, expenses, receipts, members, contributions),
    status: settled ? "settled" : "pending",
  };
}
