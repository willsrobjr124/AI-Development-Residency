---
name: testing-react-native
description: How to test this Expo app with Jest and React Native Testing Library. Use when writing or changing any logic, hook or screen, when a test fails, and before calling a feature done. Covers what to test, test-first for money logic, queries, mocks and commands.
---

# Testing the app

## Setup (once, when the app is scaffolded)

- Install: `npx expo install jest-expo jest @testing-library/react-native @types/jest --dev`
- `package.json`: `"jest": { "preset": "jest-expo" }` and a script `"test": "jest"`
- Tests live next to the code: `features/bills/billCountdown.ts` and `features/bills/billCountdown.test.ts`

## What to test, in priority order

1. **Money logic, test first.** Safe-to-spend, bill rollover, recurring detection, cents formatting. Write the failing test from the `safe-to-spend-math` skill's required cases, then the code. These must be pure functions with no React or storage inside.
2. **Data layer.** Repository functions that read and write local data (use an in-memory database or a fake repository).
3. **Screens, by behavior.** What the user sees and does: "after adding $12, safe-to-spend shows $108.00". Not implementation details.
4. **ADHD rules that can regress.** No negative safe-to-spend shown, undo appears after delete, setup resumes at the saved step.

Skip snapshot tests: they break on every style change and catch nothing users care about.

## Writing screen tests

- Query the way a user or screen reader finds things: `getByRole('button', { name: 'Add expense' })`, then `getByLabelText`, then `getByText`. Avoid `testID` unless nothing else works. If a role query cannot find an element, the element probably lacks an accessibility role or label, so fix the component.
- Use `userEvent` (`const user = userEvent.setup(); await user.press(button)`) over `fireEvent`.
- Await async UI with `findBy...` queries, not timers.
- Freeze time for anything date-based (bill countdowns, fresh start after 7 days): `jest.useFakeTimers().setSystemTime(new Date('2026-11-01'))`.

## Mocks

- Mock native modules at the boundary only: notifications, secure store, network. Keep the logic under test real.
- Never call real Supabase or Plaid from tests.

## Commands

- `npm test`: all tests
- `npm test -- billCountdown`: one file
- `npx tsc --noEmit`: type check (run with tests before finishing)

## Done means

All tests pass, the type check passes, and every new money function has tests covering its edge cases. Show the command output; see the `verification-before-completion` skill.
