// ── Finance calculation utilities ──

import { CONTRIBUTIONS } from "#/lib/demo-data";
import type { Expense, Receipt, ReceiptItem, Member, SplitEntry, Settlement } from "#/lib/types";

/** Total contributions for a trip */
export function totalContributed(tripId: string): number {
  const contribs = CONTRIBUTIONS[tripId] ?? {};
  return Object.values(contribs).reduce((sum, v) => sum + v, 0);
}

/** Per-member contribution for a trip */
export function memberContributions(tripId: string): { memberId: string; amount: number }[] {
  const contribs = CONTRIBUTIONS[tripId] ?? {};
  return Object.entries(contribs).map(([memberId, amount]) => ({ memberId, amount }));
}

/** Progress percentage toward goal (0–100) */
export function goalProgress(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

/** Filter expenses by trip */
export function tripExpenses(tripId: string, expenses: Expense[]): Expense[] {
  return expenses.filter((e) => e.tripId === tripId);
}

/** Total expenses for a trip */
export function totalExpenses(tripId: string, expenses: Expense[]): number {
  return tripExpenses(tripId, expenses).reduce((sum, e) => sum + e.amount, 0);
}

/** Subtotal of receipt items */
export function receiptSubtotal(items: ReceiptItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/** Proportional share for a receipt item based on claimers */
export function itemShare(item: ReceiptItem): number {
  if (item.claimedBy.length === 0) return 0;
  return (item.price * item.quantity) / item.claimedBy.length;
}

/** Calculate per-member split for a receipt */
export function receiptSplit(
  receipt: Receipt,
): { memberId: string; subtotal: number; taxAndService: number; total: number }[] {
  const memberMap = new Map<string, { subtotal: number; taxAndService: number }>();

  for (const item of receipt.items) {
    const share = itemShare(item);
    const claimedBy = item.claimedBy.length > 0 ? item.claimedBy : [item.claimedBy[0]];
    for (const memberId of claimedBy) {
      const existing = memberMap.get(memberId) ?? { subtotal: 0, taxAndService: 0 };
      existing.subtotal += share;
      memberMap.set(memberId, existing);
    }
  }

  // Distribute service charge + tax proportionally
  const extra = receipt.serviceCharge + receipt.tax;
  const totalSub = Array.from(memberMap.values()).reduce((s, v) => s + v.subtotal, 0);

  if (totalSub > 0) {
    for (const [, val] of memberMap) {
      val.taxAndService = (val.subtotal / totalSub) * extra;
    }
  }

  return Array.from(memberMap.entries()).map(([memberId, v]) => ({
    memberId,
    subtotal: v.subtotal,
    taxAndService: v.taxAndService,
    total: v.subtotal + v.taxAndService,
  }));
}

/** Compute net splits across all expenses in a trip */
export function tripSplits(tripId: string, expenses: Expense[], receipts: Receipt[], members: Member[]): SplitEntry[] {
  const memberTotals = new Map<string, number>();

  for (const m of members) {
    memberTotals.set(m.id, 0);
  }

  // Add up what each person paid
  const tripReceipts = receipts.filter((r) => r.tripId === tripId);
  for (const receipt of tripReceipts) {
    for (const split of receiptSplit(receipt)) {
      const prev = memberTotals.get(split.memberId) ?? 0;
      memberTotals.set(split.memberId, prev + split.total);
    }
  }

  // For expenses without receipts, add the full amount to payer
  const expensesWithReceipt = expenses.filter((e) => e.receiptId);
  for (const exp of expensesWithReceipt) {
    const prev = memberTotals.get(exp.paidBy) ?? 0;
    memberTotals.set(exp.paidBy, prev + exp.amount);
  }

  // Fair share = total / members
  const total = Array.from(memberTotals.values()).reduce((s, v) => s + v, 0);
  const fairShare = total / Math.max(memberTotals.size, 1);

  const splits: SplitEntry[] = [];
  for (const [memberId, paid] of memberTotals) {
    const diff = paid - fairShare;
    if (Math.abs(diff) < 0.01) continue;
    if (diff > 0) {
      splits.push({ memberId, amount: diff, direction: "gets_back", description: `gets back $${diff.toFixed(2)}` });
    } else {
      splits.push({
        memberId,
        amount: Math.abs(diff),
        direction: "owes",
        description: `owes $${Math.abs(diff).toFixed(2)}`,
      });
    }
  }

  return splits;
}

/** Compute settlement summary for a trip */
export function computeSettlement(
  tripId: string,
  goal: number,
  expenses: Expense[],
  receipts: Receipt[],
  members: Member[],
): Settlement {
  const contributed = totalContributed(tripId);
  const spent = totalExpenses(tripId, expenses);
  const balance = contributed - spent;
  const fairShare = spent / Math.max(members.length, 1);
  const splits = tripSplits(tripId, expenses, receipts, members);

  return {
    tripId,
    totalContributed: contributed,
    totalSpent: spent,
    remainingBalance: balance,
    fairSharePerPerson: fairShare,
    splits,
    status: balance === 0 ? "settled" : "pending",
  };
}
