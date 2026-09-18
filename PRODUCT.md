# Product Specifications

## 1. Project Overview

**NETS Biscuit** is a social trip wallet and shared expense management product built for young Singapore users.

It helps groups of friends:

- save up together for a trip,
- contribute money into a shared wallet,
- pay for shared trip expenses,
- scan receipts using OCR,
- claim ordered items individually,
- split costs fairly,
- and settle balances easily at the end of the trip using NETS.

NETS Biscuit is designed to make NETS more than just a payment tool. It transforms NETS into a **social, lifestyle-focused, group finance companion** that supports real-life shared experiences such as graduation trips, friend vacations, concerts, staycations, and group outings.

---

## 2. Problem Statement

Young users today often travel and spend in groups, but managing money together is still messy.

Common pain points include:

- collecting money from friends before a trip,
- tracking who has contributed and who has not,
- paying for shared expenses during the trip,
- splitting receipts fairly when different people ordered different items,
- accounting for taxes and service charges,
- and calculating final settlements at the end.

Existing payment apps are often good at **individual transactions**, but they do not fully support **group-based spending journeys** from savings to settlement.

The NETS challenge asks how NETS can become a preferred everyday payment companion for Gen Z and Millennials. NETS Biscuit answers this by focusing on one of the most relatable group use cases: **shared travel spending**.

---

## 3. Solution Summary

NETS Biscuit is a **Group Wallet** feature inside the NETS ecosystem.

Users can create a shared trip wallet, invite friends, define contribution rules, save toward a group goal, and use the wallet to pay shared expenses throughout the trip.

To reduce friction, the app supports:

- **shared contribution tracking,**
- **receipt OCR scanning,**
- **tap-to-claim ordered items,**
- **automatic split logic for taxes and service charge,**
- **smart settlement summaries,**
- **NETS payment integration,**
- and **social reminders, milestones, and group interactions.**

This creates a full end-to-end experience:
**Plan → Save → Spend → Split → Settle**

---

## 4. Product Vision

To make NETS the most trusted and social group payment companion for young users by helping friends manage shared money experiences simply, fairly, and enjoyably.

---

## 5. Target Users

### Primary Target Users

- Polytechnic and university students
- Young adults aged 18–30
- Friend groups planning trips together
- Budget-conscious Gen Z and Millennial users
- Social users who often split food, transport, accommodation, and activity costs

### Example Use Cases

- Graduation trips
- Short overseas trips
- Staycations
- Concert or festival travel
- Group outings and weekend getaways

---

## 6. Value Proposition

### For Users

- Easy group savings for shared goals
- Transparent contribution tracking
- Less awkwardness when chasing friends for money
- Fairer receipt splitting based on claimed items
- Simpler end-of-trip settlement
- More fun and social money management

### For NETS

- Increases user engagement beyond one-time payments
- Creates repeat use across the full spending lifecycle
- Positions NETS as a lifestyle and travel companion
- Strengthens relevance among younger users
- Opens opportunities for ecosystem partnerships, rewards, and travel-related services

---

## 7. Key Features

## 7.1 Group Wallet Creation

Users can create a new shared wallet for a trip or group event.

Fields include:

- Trip name
- Destination
- Travel dates
- Savings goal
- Invite friends
- Contribution rules:
  - Equal contribution
  - Flexible contribution
  - Custom amount per person
- Wallet purpose:
  - Airfare
  - Hotel
  - Food
  - Transport
  - Shopping
  - Activities

### Example

**Trip Name:** Bangkok Grad Trip
**Destination:** Bangkok
**Dates:** 10 Jun – 15 Jun
**Savings Goal:** $2,000

---

## 7.2 Shared Contribution Tracker

Friends can contribute to the wallet progressively before the trip.

Features:

- total goal progress bar,
- member-by-member contribution breakdown,
- remaining amount to hit target,
- weekly/monthly reminder setup,
- contribution streaks,
- friendly nudges and milestone prompts.

### Example Nudge

> Only $350 left to unlock your hotel booking goal.

---

## 7.3 Wallet Overview Dashboard

A clean home screen showing:

- active trip wallet,
- group wallet balance,
- total goal,
- amount saved,
- destination and dates,
- member contribution status,
- quick action buttons:
  - Contribute
  - Add Expense
  - Scan Receipt
  - View Split

This acts as the control center for the group.

---

## 7.4 Trip Expense Feed

All expenses made during the trip are tracked in one shared feed.

Each expense card shows:

- expense name,
- category,
- amount,
- payer or wallet source,
- transaction date,
- receipt status,
- split status,
- category icon,
- color-coded status chip.

### Example Expenses

- Hotel booking
- Airfare
- Lunch
- Dinner
- Grab transport
- Museum tickets

---

## 7.5 OCR Receipt Scanning

Users can scan physical receipts using OCR.

The app extracts:

- merchant name,
- date,
- total amount,
- item list,
- taxes,
- service charges.

Users can review and correct OCR results before saving.

### Example Receipt

**Restaurant:** After You Dessert Cafe
**Date:** 12 June
**Total:** $86.40

**Items:**

- Mango Sticky Rice — $12.90
- Thai Milk Tea — $5.50
- Shibuya Toast — $18.90
- Pad Thai — $14.00
- Service Charge — $8.00
- GST — $7.10

---

## 7.6 Item Claiming

After OCR extraction, group members can claim the items they ordered.

This makes splitting more accurate than equal splitting.

### Example

- Mango Sticky Rice: Yu Xiang, Miguel
- Thai Milk Tea: Zavic
- Shibuya Toast: Sean, Yu Xiang
- Pad Thai: Miguel

The system then:

- splits shared items proportionally,
- allocates tax and service charge fairly,
- shows who has not claimed yet,
- lets the group lock the split once complete.

### CTA

**Lock Split**

---

## 7.7 Smart Split Engine

NETS Biscuit calculates who owes what using:

- personal item claims,
- shared items,
- taxes and service charges,
- prior group wallet contribution,
- and wallet usage.

The result is a clean, understandable breakdown.

### Example Output

- Yu Xiang gets back $12.40
- Miguel owes $8.20
- Zavic gets back $3.10
- Sean owes $7.30

This reduces confusion and improves trust.

---

## 7.8 End Trip Settlement

At the end of the trip, the app automatically produces a final group settlement summary.

It shows:

- total contributed,
- total spent,
- remaining wallet balance,
- fair share per person,
- refunds needed,
- top-ups needed.

### CTA Buttons

- Settle with NETS
- Refund remaining balance
- Export trip report

This gives closure to the full group journey.

---

## 7.9 Social Layer

To make the experience feel more engaging and Gen Z-friendly, NETS Biscuit includes lightweight social features.

Examples:

- savings milestones,
- celebration moments,
- reminders,
- group reactions,
- comments on expenses,
- spending badges.

### Example Social Moments

- Hotel goal reached
- First meal paid
- Sean still needs to claim 2 receipt items

### Example Badges

- Budget Hero
- Foodie
- Transport Saver

These features make financial coordination feel less stressful and more collaborative.

---

## 8. Design Principles

NETS Biscuit uses a modern fintech mobile UI style.

### Visual Direction

- NETS-inspired bold red and deep blue
- white and light grey for cleanliness
- rounded cards
- soft shadows
- friendly icons
- simple and intuitive navigation
- trustworthy but social tone
- mobile-first experience

### Brand Personality

- Friendly
- Social
- Helpful
- Modern
- Clear
- Reliable

---

## 9. Core Screens

1. **Home / Wallet Overview**
2. **Create Group Wallet**
3. **Group Contribution Screen**
4. **Trip Expense Feed**
5. **OCR Receipt Scan**
6. **Item Claiming Screen**
7. **Smart Split Summary**
8. **End Trip Settlement**
9. **Social Layer / Group Activity**

### Bottom Navigation

- Wallet
- Expenses
- Scan
- Split
- Group

---

## 10. User Journey

### Stage 1: Plan

A user creates a group wallet for an upcoming trip and invites friends.

### Stage 2: Save

Each member contributes toward the shared target over time. The group sees progress and receives milestone nudges.

### Stage 3: Spend

During the trip, users pay for shared expenses through the wallet or record external payments.

### Stage 4: Scan

Receipts are scanned using OCR so items can be extracted and reviewed.

### Stage 5: Claim

Each friend claims what they ordered. Taxes and service charges are split automatically.

### Stage 6: Split

The app calculates who owes what with a transparent summary.

### Stage 7: Settle

At the end of the trip, balances are settled with NETS and a final report can be exported.

---

## 11. Why This Is Good for NETS

NETS Biscuit helps NETS move from being seen as just a payment rail to being seen as a **daily-use social finance companion**.

It aligns well with the NETS challenge because it:

- targets young users directly,
- solves a real and common pain point,
- encourages repeated app engagement,
- creates strong stickiness through shared experiences,
- makes payments more social and contextual,
- and differentiates NETS from standard wallet apps.

Unlike generic e-wallets that focus only on checkout or peer transfers, NETS Biscuit supports the full group expense lifecycle.

---

## 12. Competitive Differentiation

### Typical Payment Apps

- Good for individual transfers
- Limited shared wallet functionality
- Weak receipt-based splitting
- Little social coordination support

### NETS Biscuit

- Group-first design
- Shared trip wallet
- Goal-based contribution tracking
- OCR receipt extraction
- Tap-to-claim item splitting
- End-to-end trip settlement
- Social nudges and milestones
- NETS-powered payment and settlement

This makes the experience more complete, useful, and memorable.

---

## 13. MVP Scope

The minimum viable product includes:

### Must-Have

- Create group wallet
- Invite members
- Contribution tracking
- Wallet dashboard
- Add shared expenses
- OCR receipt upload
- Item claiming
- Smart split calculation
- End trip settlement summary

### Nice-to-Have

- Social badges
- Reactions and comments
- Auto-reminders
- Exportable trip report
- Merchant/travel partner integrations

---

## 14. Proposed Technical Components

### Frontend

- Mobile app UI prototype
- Clean card-based fintech interface
- Bottom tab navigation

### Backend Logic

- Group wallet management
- Member contribution tracking
- Expense ledger
- OCR data processing
- Split calculation engine
- Settlement engine

### Integrations

- NETS payment / transfer flow
- OCR receipt recognition
- Notification reminders
- Exportable PDF or summary report

---

## 15. Success Metrics

Potential product success metrics:

- number of group wallets created,
- contribution completion rate,
- receipt scans per trip,
- split completion rate,
- frequency of user return during trip lifecycle,
- settlement completion rate,
- user satisfaction with fairness and ease of use.

---

## 16. Example Scenario

### Bangkok Grad Trip

Four friends create a wallet for their graduation trip:

- Yu Xiang
- Miguel
- Zavic
- Sean

They set a shared goal of $1,000 for hotel and travel costs.

Before the trip:

- Yu Xiang contributes $250
- Miguel contributes $250
- Zavic contributes $200
- Sean contributes $150

During the trip:

- the wallet pays for hotel and transport,
- they scan meal receipts,
- each person claims their food items,
- the app automatically calculates taxes and split amounts.

At the end:

- the app shows total spent,
- remaining wallet balance,
- who should be refunded,
- and who needs to top up.

Settlement is completed through NETS.

---

## 17. Future Roadmap

Future extensions for NETS Biscuit could include:

- multi-currency trip wallets,
- overseas merchant integration,
- AI travel budgeting assistant,
- shared itinerary spending forecasts,
- travel deal partnerships,
- group savings challenges,
- campus event wallets,
- birthday or chalet wallets,
- family trip mode,
- automatic budget alerts.

This allows NETS Biscuit to expand from a trip feature into a broader **group money coordination platform**.

---

## 18. One-Line Pitch

**NETS Biscuit is a social Group Wallet that helps friends save, spend, split, and settle trip expenses fairly through a fun, seamless, NETS-powered experience.**

---

## 19. Elevator Pitch

Young people often travel in groups, but managing shared money is still frustrating. NETS Biscuit solves this by giving friend groups a shared trip wallet where they can contribute funds, track expenses, scan receipts, claim items, and settle balances fairly. By combining payments, OCR, smart splitting, and social engagement, NETS Biscuit helps NETS become more than a payment app — it becomes a trusted lifestyle companion for Gen Z and Millennials.

---

## 20. Tagline

**Save together. Spend together. Split smarter.**
