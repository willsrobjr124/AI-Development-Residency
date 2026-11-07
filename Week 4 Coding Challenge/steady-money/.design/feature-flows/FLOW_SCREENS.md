# Feature Flow Screens

Status: built. These are on the "Feature flows" page of the Figma file "ADHD Budgeting App: Onboarding and Home", one section per feature, reusing that file's components, colors and text styles.

Example numbers match the onboarding mockups: balance $1,240, bills $945 (Rent $900, Phone $45), savings $50, safe to spend $245.

New components needed: Confirmation (message plus Undo), Chip, Field, Bill countdown row.

## Quick add

1. Type an amount: "How much did you spend?", $12, optional category chips (Bills, Food, Fun, Transport, Other), "Add expense"
2. Saved: home shows $233, with "$12 added to Food" and Undo
3. Undone: home shows $245, with "Removed. Your number is back."
4. Needs fixing: "That amount needs a number, like 12.50", shown under a thicker field line, with the category chips kept
5. Keyboard open: the button sits directly above the keyboard. Other input screens follow this pattern.

## Safe-to-spend number

1. Tap the "?": "How we worked out your number": balance $1,240, Rent - $900, Phone - $45, Savings - $50, Safe to spend $245, "Back to my number"
2. Bills use everything: home shows $0 with "Bills coming up use all of this period's money." and the tappable next-bill row

## Money buckets

1. Tap a bucket: "Move money to Savings", $20, "Move $20 to Savings"
2. Moved: home shows Spending $225, Bills $945, Savings $70, with "$20 moved to Savings" and Undo

## Bill countdown

1. "Bills coming up": Phone, $45, 3 days left; Rent, $900, 4 days left; each with "Mark paid"; "Add a bill"
2. Marked paid: Phone leaves the list, with "Phone bill marked paid" and Undo
3. Add a bill: name, amount, due date, "Save bill"
4. Nothing due: "No bills in the next 7 days"

## Fresh start

1. After 7 or more days away: "Welcome back. Want a fresh start?", "Items without a category move to Other, and you'll check your balance is right.", "Start fresh", "Not now"
2. "Is this still your balance?", pre-filled, "Use this balance"
3. Done: check mark, "You're all set", "Go to my number"
4. Home: safe-to-spend number, with no catch-up task, and "Your balance is up to date" with Undo

## Privacy

1. Switch apps: a solid cover with the lock icon hides the home screen (a blur left "$245" readable)
2. After 5 idle minutes: "Locked to keep your money private", "Unlock to pick up where you left off.", "Unlock"

## Questions to settle

- After a bill is marked paid, the money rules remove it from the number, but a typed balance still includes that money, so the number rises by the bill amount and may overstate what is safe. Option: also take the bill out of the balance when it is marked paid.
- After a long break, a typed balance is probably out of date. Option: add one "Is this still your balance?" screen to Fresh start.

## Epics 1 and 2: remaining features

Also built on the "Feature flows" page, in sections named "Epic 1: ..." and "Epic 2: ...". These are designs only and sit outside this week's build scope.

- Goal picker (3 screens): pick a goal, home with bills up high, change it in settings
- Optional bank linking (5 screens): choose, before linking, linked, could not link, unlink
- Automatic bill detection (3 screens): suggestions, one added, common bills without a bank
- Smart default categories (2 screens): list, rename
- Home-screen widget (4 screens): amount hidden, amount shown, setting off, setting on
- Automatic transaction import (3 screens): recent spending, fix a category, could not update

Questions to settle:

- The goal picker sits outside "Step X of 4". Decide whether it comes before Step 1 or becomes a fifth step.
- The backlog says the "Stop surprise bills" goal shows the bill countdown first on home, but the ADHD rules say safe-to-spend is always first. The design keeps the number first and moves bills directly under it.
