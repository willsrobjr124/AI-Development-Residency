---
name: mvp-scope
description: "The MVP #1 (closed beta) scope for the ADHD budgeting app: audiences, epics, features, acceptance criteria and what is out of scope. Use before planning or building any feature, when deciding whether something belongs in the MVP, and when writing acceptance tests."
---

# MVP #1 scope (closed beta)

Goal: about 100 beta testers, months 2 to 4. Full context: `docs/PRD-summary.md` and `docs/epics-and-features.md`.

## Audiences

- **A. Overwhelmed restarter:** has tried 2+ budgeting apps and quit each within weeks. Needs near-zero setup and a guilt-free way back after a gap.
- **B. Surprise-hit spender:** hit by forgotten bills, subscriptions and impulse buys. Needs bills and safe-to-spend always in view.

## In scope: Epics 1 to 3

| Epic | Feature | Done when |
|---|---|---|
| 0. Foundation | Security baseline | Encrypted database, biometric unlock, 5-minute lock, background blur, rooted/jailbroken check, pinned HTTPS, no production logs, idempotent and atomic writes (see `banking-security`) |
| 1. Easy Start | Goal picker | User picks 1 of 3 goals; the home screen order follows the goal |
| 1. Easy Start | Optional bank linking | User can skip linking and type a balance; linking can happen later from settings |
| 1. Easy Start | Bill detection | Likely recurring bills are listed; user confirms or removes each with one tap |
| 1. Easy Start | Default categories | 5 starter categories (bills, food, fun, transport, other); none required during setup |
| 1. Easy Start | Step progress and autosave | Each step shows "Step N of 4"; quitting and reopening resumes at the same step |
| 2. Money at a Glance | Safe-to-spend number | First thing on home; tap shows the breakdown (see `safe-to-spend-math` skill) |
| 2. Money at a Glance | Visual buckets | Money shown as three buckets (Spending = safe-to-spend, Bills, Savings) that fill and empty; tap a bucket to see detail or move money between Spending and Savings (see `safe-to-spend-math`) |
| 2. Money at a Glance | Home-screen widget | Shows "Tap to view" and a quick-add button by default; the amount appears only if the user opts in under settings |
| 2. Money at a Glance | Transaction import | Imported transactions are auto-categorized; a corrected category is remembered |
| 2. Money at a Glance | Quick add | Cash expense logged in 2 taps; category optional; undo available |
| 2. Money at a Glance | Bill countdown | Bills due in the next 7 days with days left; can mark as paid |
| 3. Calm Habits | Fresh start | After 7+ days away: one tap files old uncategorized items under "other" and restarts the week |
| 3. Calm Habits | Weekly check-in | User-chosen day and time; 60-second review; celebrated, no streaks |
| 3. Calm Habits | Snoozable reminders | Bill reminders at a user-chosen lead time; snooze and mute |
| 3. Calm Habits | Pause before purchase | Optional; user sets an amount; prompt offers a 24-hour wishlist |
| 3. Calm Habits | Focus Mode | Hides everything but safe-to-spend and quick add; motion and sound toggles |

**Build order suggestion:** security foundation first, then manual-mode core (balance, safe-to-spend, buckets, quick add, bills), then fresh start and check-in, then bank import. See `dev-workflow`.

## Out of scope for MVP #1

Investing, credit scores, detailed reports and charts, streaks or leaderboards, financial advice, couples mode, coach sharing, named savings goals with targets (the basic Savings bucket is in scope), milestone interventions (first paycheck, raise, emergency fund), body-doubling sessions (these are Epic 4 / MMP).

## Non-functional requirements

`docs/BANKING_PRD_TECHNICAL_REQUIREMENTS.md` applies to every feature: the four UI states and helper text (`adhd-ux-guidelines`) and all security controls (`banking-security`).

## Metrics to instrument

- Week-4 retention (target 40%+)
- Return after a lapse of 7+ days within 30 days (target 60%)
- Setup completion time (target 5 minutes or less)
- Weekly check-in rate, bank-link rate

Log events without storing transaction details in analytics.

## Rules

- If a request falls outside this table, say so and ask before building it.
- Every feature must pass the `adhd-ux-guidelines` checklist.
