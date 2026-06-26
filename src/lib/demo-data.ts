// ── Mock data for NETS Biscuit demo ──

import type { Member, Trip, Expense, Receipt, Notification, Activity, UserProfile, BadgeType } from "#/lib/types";

// ── Members ──
export const MEMBERS: Member[] = [
  { id: "you", name: "You", avatarUrl: "", isCurrentUser: true },
  { id: "yu-xiang", name: "Yu Xiang", avatarUrl: "" },
  { id: "miguel", name: "Miguel", avatarUrl: "" },
  { id: "zavic", name: "Zavic", avatarUrl: "" },
  { id: "sean", name: "Sean", avatarUrl: "" },
  { id: "jason", name: "Jason Tan", avatarUrl: "" },
  { id: "sarah", name: "Sarah Lim", avatarUrl: "" },
];

export const CONTACTS = [
  { id: "jason", name: "Jason Tan" },
  { id: "sarah", name: "Sarah Lim" },
  { id: "rachel", name: "Rachel Ng" },
  { id: "daryl", name: "Daryl Wong" },
  { id: "wei", name: "Wei Jie" },
  { id: "amanda", name: "Amanda Teo" },
  { id: "ben", name: "Ben Chua" },
  { id: "clara", name: "Clara Ho" },
];

// ── Trips ──
export const TRIPS: Trip[] = [
  {
    id: "bangkok-2024",
    name: "Bangkok Grad Trip",
    destination: "Bangkok, Thailand",
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=200&fit=crop",
    dates: "Jun 10 – Jun 15",
    status: "active",
    goal: 2000,
    contribution: 850,
    memberIds: ["you", "yu-xiang", "miguel", "zavic", "sean"],
    purposes: ["Hotel", "Food", "Transport", "Shopping"],
    splitType: "equal",
  },
  {
    id: "tokyo-2024",
    name: "Tokyo Trip 2024",
    destination: "Tokyo, Japan",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop",
    dates: "Dec 15 – Dec 22",
    status: "upcoming",
    goal: 3000,
    contribution: 1200,
    memberIds: ["you", "yu-xiang", "miguel", "zavic"],
    purposes: ["Airfare", "Hotel", "Food"],
    splitType: "equal",
  },
  {
    id: "bali-2024",
    name: "Bali Trip 2024",
    destination: "Bali, Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop",
    dates: "Aug 5 – Aug 10",
    status: "completed",
    goal: 1500,
    contribution: 1500,
    memberIds: ["you", "jason", "sarah"],
    purposes: ["Hotel", "Food", "Transport"],
    splitType: "flexible",
  },
];

// ── Contribution amounts per member ──
export const CONTRIBUTIONS: Record<string, Record<string, number>> = {
  "bangkok-2024": {
    you: 200,
    "yu-xiang": 250,
    miguel: 200,
    zavic: 120,
    sean: 80,
  },
  "tokyo-2024": {
    you: 400,
    "yu-xiang": 300,
    miguel: 300,
    zavic: 200,
  },
  "bali-2024": {
    you: 600,
    jason: 500,
    sarah: 400,
  },
};

// ── Expenses ──
export const EXPENSES: Expense[] = [
  {
    id: "exp-1",
    tripId: "bangkok-2024",
    name: "Hotel Booking",
    amount: 500.0,
    category: "accommodation",
    paidBy: "you",
    status: "paid",
    date: "2024-06-10",
    hasReceipt: true,
    receiptId: "rec-1",
  },
  {
    id: "exp-2",
    tripId: "bangkok-2024",
    name: "Airfare",
    amount: 300.0,
    category: "airfare",
    paidBy: "you",
    status: "paid",
    date: "2024-06-10",
    hasReceipt: false,
  },
  {
    id: "exp-3",
    tripId: "bangkok-2024",
    name: "Lunch at After You",
    amount: 86.4,
    category: "food",
    paidBy: "yu-xiang",
    status: "scanning",
    date: "2024-06-12",
    hasReceipt: false,
    receiptId: "rec-2",
  },
  {
    id: "exp-4",
    tripId: "bangkok-2024",
    name: "Grab to Airport",
    amount: 25.0,
    category: "transport",
    paidBy: "you",
    status: "pending",
    date: "2024-06-15",
    hasReceipt: false,
  },
  {
    id: "exp-5",
    tripId: "bangkok-2024",
    name: "Night Market Shopping",
    amount: 45.5,
    category: "shopping",
    paidBy: "zavic",
    status: "pending",
    date: "2024-06-13",
    hasReceipt: false,
  },
  {
    id: "exp-6",
    tripId: "bangkok-2024",
    name: "Temple Entrance Fees",
    amount: 32.0,
    category: "activity",
    paidBy: "miguel",
    status: "paid",
    date: "2024-06-11",
    hasReceipt: true,
    receiptId: "rec-3",
  },
];

// ── Receipts ──
export const RECEIPTS: Receipt[] = [
  {
    id: "rec-1",
    tripId: "bangkok-2024",
    merchantName: "Grand Palace Hotel",
    date: "2024-06-10",
    subtotal: 450.0,
    serviceCharge: 31.5,
    tax: 31.5,
    total: 500.0,
    items: [
      {
        id: "item-1",
        receiptId: "rec-1",
        name: "Deluxe Room (2 nights)",
        price: 450.0,
        quantity: 1,
        claimedBy: ["you", "yu-xiang"],
      },
    ],
    expenseId: "exp-1",
  },
  {
    id: "rec-2",
    tripId: "bangkok-2024",
    merchantName: "After You Dessert Cafe",
    date: "2024-06-12",
    subtotal: 68.0,
    serviceCharge: 4.76,
    tax: 4.76,
    total: 86.4,
    items: [
      {
        id: "item-2",
        receiptId: "rec-2",
        name: "Mango Sticky Rice",
        price: 12.9,
        quantity: 1,
        claimedBy: ["yu-xiang", "miguel"],
      },
      { id: "item-3", receiptId: "rec-2", name: "Thai Milk Tea", price: 5.5, quantity: 1, claimedBy: ["zavic"] },
      {
        id: "item-4",
        receiptId: "rec-2",
        name: "Shibuya Toast",
        price: 18.9,
        quantity: 1,
        claimedBy: ["sean", "yu-xiang"],
      },
      { id: "item-5", receiptId: "rec-2", name: "Pad Thai", price: 14.0, quantity: 1, claimedBy: ["miguel"] },
    ],
    expenseId: "exp-3",
  },
  {
    id: "rec-3",
    tripId: "bangkok-2024",
    merchantName: "Grand Palace Ticket Office",
    date: "2024-06-11",
    subtotal: 30.0,
    serviceCharge: 0,
    tax: 2.0,
    total: 32.0,
    items: [
      {
        id: "item-6",
        receiptId: "rec-3",
        name: "Entry Ticket",
        price: 8.0,
        quantity: 4,
        claimedBy: ["you", "yu-xiang", "miguel", "zavic"],
      },
    ],
    expenseId: "exp-6",
  },
];

// ── Notifications ──
export const NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    type: "contribution",
    title: "New contribution",
    message: "Sean contributed $80 to Bangkok Grad Trip",
    tripId: "bangkok-2024",
    timestamp: "2h ago",
    read: false,
  },
  {
    id: "n-2",
    type: "milestone",
    title: "Hotel goal reached!",
    message: "You've saved enough to book the hotel for Bangkok Grad Trip.",
    tripId: "bangkok-2024",
    timestamp: "1d ago",
    read: false,
  },
  {
    id: "n-3",
    type: "reminder",
    title: "Contribution reminder",
    message: "Your friends are waiting for your contribution to Tokyo Trip 2024.",
    tripId: "tokyo-2024",
    timestamp: "2d ago",
    read: true,
  },
  {
    id: "n-4",
    type: "expense",
    title: "Expense added",
    message: 'Yu Xiang added "Lunch at After You" ($86.40) to Bangkok Grad Trip.',
    tripId: "bangkok-2024",
    timestamp: "3d ago",
    read: true,
  },
  {
    id: "n-5",
    type: "split",
    title: "Split pending",
    message: "2 items on the After You receipt still need to be claimed.",
    tripId: "bangkok-2024",
    timestamp: "3d ago",
    read: true,
  },
  {
    id: "n-6",
    type: "contribution",
    title: "Goal almost there",
    message: "Only $350 left to unlock the hotel booking goal for Bangkok Grad Trip.",
    tripId: "bangkok-2024",
    timestamp: "5d ago",
    read: true,
  },
];

// ── Activities ──
export const ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    tripId: "bangkok-2024",
    type: "milestone",
    memberId: "system",
    message: "Hotel goal reached!",
    timestamp: "1d ago",
    reactions: [{ emoji: "🎉", count: 3 }],
  },
  {
    id: "act-2",
    tripId: "bangkok-2024",
    type: "contribution",
    memberId: "sean",
    message: "Sean contributed $80",
    timestamp: "2d ago",
  },
  {
    id: "act-3",
    tripId: "bangkok-2024",
    type: "expense_added",
    memberId: "yu-xiang",
    message: 'Yu Xiang added "Lunch at After You" ($86.40)',
    timestamp: "3d ago",
    reactions: [{ emoji: "😋", count: 2 }],
  },
  {
    id: "act-4",
    tripId: "bangkok-2024",
    type: "item_claimed",
    memberId: "zavic",
    message: "Zavic claimed Thai Milk Tea",
    timestamp: "3d ago",
  },
  {
    id: "act-5",
    tripId: "bangkok-2024",
    type: "contribution",
    memberId: "miguel",
    message: "Miguel contributed $200",
    timestamp: "5d ago",
    reactions: [{ emoji: "💪", count: 4 }],
  },
];

// ── User Profile ──
export const CURRENT_USER: UserProfile = {
  id: "you",
  name: "Dennis",
  email: "dennis@example.com",
  phone: "+65 9123 4567",
  avatarUrl: "",
  joinDate: "Jan 2024",
  badges: [
    { type: "budget_hero", label: "Budget Hero", earnedAt: "Jun 2024", tripId: "bangkok-2024" },
    { type: "foodie", label: "Foodie", earnedAt: "May 2024", tripId: "bali-2024" },
    { type: "early_bird", label: "Early Bird", earnedAt: "Apr 2024" },
  ],
};

// ── Badge definitions ──
export const BADGE_DEFS: Record<BadgeType, { label: string; description: string; icon: string }> = {
  budget_hero: { label: "Budget Hero", description: "Stayed under budget on a trip", icon: "💰" },
  foodie: { label: "Foodie", description: "Scanned 5+ receipts on a trip", icon: "🍜" },
  transport_saver: { label: "Transport Saver", description: "Minimized transport costs", icon: "🚌" },
  early_bird: { label: "Early Bird", description: "Contributed before the trip started", icon: "🐦" },
  settler: { label: "Settler", description: "Settled all balances on time", icon: "✅" },
};
