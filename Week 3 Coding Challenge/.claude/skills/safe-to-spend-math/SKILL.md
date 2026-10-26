---
name: safe-to-spend-math
description: Rules for money values, the safe-to-spend calculation, bill countdowns and recurring-bill detection. Use whenever you write or change code that stores amounts, computes safe-to-spend, schedules bills or detects recurring charges, and when writing tests for them.
---

# Safe-to-spend math

These are the working rules for the MVP. They are product decisions, not settled facts: if a rule seems wrong for a case, flag it instead of silently changing it.

## Money values

- Store every amount as an **integer number of cents** with an ISO currency code (`USD`). Never use floating point for money.
- Format only at the UI edge (`Intl.NumberFormat`).
- Dates are stored as ISO dates in the user's time zone for bills (a bill is due on a calendar day, not an instant).

## Safe-to-spend

```
safe_to_spend = available_balance
              - sum(unpaid bills due on or before the end of the period)
              - savings set-asides for the period
```

- **Period end:** the user's next payday if they set one; otherwise today + 30 days.
- **Available balance:** linked account balances (checking only) or the balance the user typed in manual mode, minus quick-add expenses logged since that balance was entered.
- **Bills marked paid** are excluded.
- **If the result is below zero:** show $0 with neutral copy ("Bills coming up use all of this period's money") and the breakdown. Never show a red negative number.
- The breakdown screen lists each line so users can see how the number was made.

## Buckets

The three visual buckets are a view of the same numbers, so they always add up:

- **Bills bucket** = sum of unpaid bills due on or before the period end.
- **Savings bucket** = savings set-asides for the period.
- **Spending bucket** = safe-to-spend (floored at $0 for display).
- Spending + Bills + Savings = available balance whenever safe-to-spend is not negative; when it is negative, show the shortfall copy, never a negative bucket.
- **Moving money** between Spending and Savings changes the set-aside amount. It is one atomic, idempotent write (see `banking-security` section 6), and the move can be undone.

## Bill countdown

- Show unpaid bills due in the next 7 days, soonest first, with "N days left" ("Due today" for 0).
- A recurring bill's next due date rolls forward after it is marked paid.

## Recurring-bill detection (bank-linked users)

Treat a charge as a likely recurring bill when all of these hold:

- Same normalized merchant name
- At least 2 occurrences
- Amounts within 10% of each other
- Interval of about 7, 14, 30 or 365 days (within 3 days)

Always ask the user to confirm; never add a bill silently.

## Tests required

Write unit tests for the calculation before wiring UI. Cover at least:

- No bills, no savings: result equals balance
- Bill due after period end is excluded
- Paid bill is excluded
- Result below zero shows $0 and the shortfall copy
- No payday set uses a 30-day period
- Cents rounding: 3 items of $0.10 sum to exactly 30 cents
- Buckets add up to the available balance
- Moving $20 from Spending to Savings twice with the same idempotency key moves it only once
