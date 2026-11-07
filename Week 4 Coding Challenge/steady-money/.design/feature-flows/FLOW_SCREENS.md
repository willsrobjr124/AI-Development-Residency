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
6. Bills picked: helper line, "If this pays a bill on your list, use Mark paid there instead."

## Safe-to-spend number

1. Tap the "?": "How we worked out your number": balance $1,240, Rent - $900, Phone - $45, Savings - $50, Safe to spend $245, "Back to my number"
2. Bills use everything: home shows $0 with "Bills coming up use all of this period's money." and the tappable next-bill row
3. After spending: the breakdown adds "Spent since then", which opens Recent spending
4. After payday passes: "Payday has passed. Let's update your number." with Update

## Money buckets

1. Tap a bucket: "Move money to Savings", $20, "Move $20 to Savings"
2. Moved: home shows Spending $225, Bills $945, Savings $70, with "$20 moved to Savings" and Undo
3. Tap Savings: "Move money to Spending", the same screen in reverse
4. Too much: "Your Spending bucket has $245"

## Bill countdown

1. "Bills coming up": Phone, $45, 3 days left; Rent, $900, 4 days left; each with "Mark paid"; "Add a bill"
2. Marked paid: Phone leaves the list, with "Phone bill marked paid" and Undo
3. Add a bill: name, amount, calendar for the due date, "Every month" switch, "Save bill"
4. Nothing due: "No bills in the next 7 days"
5. Paid monthly bill: moves to "Later on" with its next date, with Undo

## Fresh start

1. After 7 or more days away: "Welcome back. Want a fresh start?", "Items without a category move to Other, and you'll check your balance is right.", "Start fresh", "Not now"
2. "Is this still your balance?", pre-filled, "Use this balance"
3. Done: check mark, "You're all set", "Go to my number"
4. Home: safe-to-spend number, with no catch-up task, and "Your balance is up to date" with Undo

## Privacy

1. Switch apps: a solid cover with the lock icon hides the home screen (a blur left "$245" readable)
2. After 5 idle minutes: "Locked to keep your money private", "Unlock to pick up where you left off.", "Unlock"
3. Could not unlock: "That didn't unlock. Your money is safe, so try again."

## Recent spending

1. List: each expense with its category, amount, date and "Remove"
2. Removed: "Expense removed" with Undo
3. Empty: "Nothing added yet."

## Settings

Opens from the gear on Home.

1. List: Balance, Next payday, Savings, Reduce motion, Allow screenshots
2. Edit balance
3. Edit savings

Editing the payday reuses the setup Payday screen, including "Pick a date" with the calendar.

## Accounts

Login is required, because every feature saves to Supabase. Resetting a password uses a 6-digit code, because email links are unreliable in Expo Go.

Create an account:

1. Welcome: "Get started" and "I already have an account"
2. Create account: email, password with Show, "Create my account", then setup
3. Needs fixing: a plain line under each field
4. Email already used: "That email already has an account. You can log in instead."
5. Enter code: only if email confirmation is turned on in Supabase

Log in:

1. Log in: email, password, "Forgot my password"
2. Does not match: "That email and password don't match."
3. Forgot password: "Send my code"
4. New password: code and new password

Manage your account:

1. Settings: "Account"
2. Your account: email, "Log out", "Delete my account and data"
3. Log out: "Log out on this device?"
4. Delete: "Delete your account and data?" It can't be undone, so it asks first.
5. No connection: "We couldn't connect just now. Your money is safe, so try again."

## Settled

- Marking a bill paid also takes it out of the balance, so the number stays the same. Undo puts it back.
- Fresh start asks "Is this still your balance?", because a typed balance is probably out of date after a break.

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
