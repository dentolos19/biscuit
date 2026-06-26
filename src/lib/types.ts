// ── Shared types for NETS Biscuit ──

export type Member = {
  id: string;
  name: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
};

export type TripStatus = "upcoming" | "active" | "completed";

export type Trip = {
  id: string;
  name: string;
  destination: string;
  imageUrl: string;
  dates: string;
  status: TripStatus;
  goal: number;
  contribution: number;
  memberIds: string[];
  purposes: string[];
  splitType: "equal" | "flexible" | "custom";
};

export type ExpenseStatus = "paid" | "scanning" | "pending" | "disputed";

export type ExpenseCategory = "accommodation" | "airfare" | "food" | "transport" | "shopping" | "activity" | "other";

export type Expense = {
  id: string;
  tripId: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: Member["id"];
  status: ExpenseStatus;
  date: string;
  hasReceipt: boolean;
  receiptId?: string;
};

export type ReceiptItem = {
  id: string;
  receiptId: string;
  name: string;
  price: number;
  quantity: number;
  claimedBy: Member["id"][];
};

export type Receipt = {
  id: string;
  tripId: string;
  merchantName: string;
  date: string;
  subtotal: number;
  serviceCharge: number;
  tax: number;
  total: number;
  items: ReceiptItem[];
  expenseId?: string;
};

export type SplitDirection = "gets_back" | "owes";

export type SplitEntry = {
  memberId: string;
  amount: number;
  direction: SplitDirection;
  description: string;
};

export type SettlementStatus = "pending" | "settled";

export type Settlement = {
  tripId: string;
  totalContributed: number;
  totalSpent: number;
  remainingBalance: number;
  fairSharePerPerson: number;
  splits: SplitEntry[];
  status: SettlementStatus;
};

export type NotificationType = "contribution" | "expense" | "reminder" | "milestone" | "split" | "settlement";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  tripId?: string;
  timestamp: string;
  read: boolean;
};

export type BadgeType = "budget_hero" | "foodie" | "transport_saver" | "early_bird" | "settler";

export type UserBadge = {
  type: BadgeType;
  label: string;
  earnedAt: string;
  tripId?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone: string;
  badges: UserBadge[];
  joinDate: string;
};

export type ActivityType =
  | "contribution"
  | "expense_added"
  | "receipt_scanned"
  | "item_claimed"
  | "split_locked"
  | "milestone"
  | "reaction";

export type Activity = {
  id: string;
  tripId: string;
  type: ActivityType;
  memberId: string;
  message: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
};
