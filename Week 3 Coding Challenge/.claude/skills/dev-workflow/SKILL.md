---
name: dev-workflow
description: How work moves from idea to merged code in this project - vertical slices, branches, commits, the definition of done, code review and CI. Use when starting a feature, before committing, when opening a pull request, or when setting up CI.
---

# Development workflow

## Work in vertical slices

Build one thin, working path end to end before widening it. Suggested order (from `mvp-scope`):

1. Scaffold the app (Expo Router, TypeScript strict, Jest) following `expo-project-structure`
2. Manual balance + safe-to-spend number (logic test-first, then screen)
3. Quick add with undo
4. Bills + bill countdown
5. Setup flow with step progress and autosave
6. Fresh start, weekly check-in, reminders
7. Focus Mode and calm display settings
8. Supabase auth and sync, then Plaid sandbox import

Each slice ends usable on a phone, even if rough.

## Before starting a slice

- Load `mvp-scope` and confirm the feature's "done when".
- Write down the test cases first (`testing-react-native`).

## Commits

- Small and focused, present tense: "Add bill countdown list", "Fix safe-to-spend rounding".
- Never commit `.env`, keys, `node_modules`, or build output (see `.gitignore`).
- The Week 3 app lives in `Week 3 Coding Challenge/`; keep all its files inside that folder.

## Definition of done (every slice)

- [ ] `npx tsc --noEmit` passes
- [ ] `npm test` passes, with tests for new logic
- [ ] Lint passes (`npx expo lint` once set up)
- [ ] `adhd-ux-guidelines` checklist passes
- [ ] `mobile-accessibility` checks done (screen reader, large text, reduced motion)
- [ ] `fintech-security-privacy` rules respected (no keys, no money in logs)
- [ ] Tried on a phone with Expo Go or a dev build
- [ ] Evidence shown, per `verification-before-completion`

## Code review

Before merging, run a review of the diff (`/code-review`) and fix real issues. For bugs, follow `systematic-debugging` before changing code.

## CI (add once the app exists)

A GitHub Actions workflow in the repository root `.github/workflows/week3-app.yml` that runs only when `Week 3 Coding Challenge/**` changes, with `working-directory` set to that folder: `npm ci`, `npx tsc --noEmit`, `npm test -- --ci`. Keep CI fast; no device builds in CI for the MVP.
