---
name: dev-workflow
description: How work moves from idea to merged code in this project - vertical slices, branches, commits, the definition of done, code review and CI. Use when starting a feature, before committing, when opening a pull request, or when setting up CI.
---

# Development workflow

## Work in vertical slices

Build one thin, working path end to end before widening it. Suggested order (from `mvp-scope`):

1. Scaffold the app (Expo Router, TypeScript strict, Jest, ESLint with `no-console`) following `expo-project-structure`, and make a development build (`expo-dev-client`). Expo Go cannot run the encrypted database, biometrics, pinning or the jailbreak check.
2. Security foundation (`banking-security`): encrypted database and key, rooted/jailbroken check, biometric unlock, 5-minute lock, background blur, production log removal, idempotent write helper
3. Manual balance + safe-to-spend number + the three buckets (logic test-first, then screen)
4. Quick add with undo
5. Bills + bill countdown
6. Setup flow with step progress and autosave
7. Fresh start, weekly check-in, reminders (masked by default)
8. Focus Mode and calm display settings
9. Supabase auth and sync through idempotent Edge Functions, certificate pinning, then Plaid sandbox import

Each slice ends usable on a phone, even if rough.

## Before starting a slice

- Load `mvp-scope` and confirm the feature's "done when".
- Write down the test cases first, unhappy paths before the happy path (`testing-react-native`).
- Note which `banking-security` controls the slice touches.

## Commits

- Small and focused, present tense: "Add bill countdown list", "Fix safe-to-spend rounding".
- Never commit `.env`, keys, `node_modules`, or build output (see `.gitignore`).
- The Week 3 app lives in `Week 3 Coding Challenge/`; keep all its files inside that folder.

## Definition of done (every slice)

- [ ] `npx tsc --noEmit` passes
- [ ] `npm test` passes, with tests for new logic
- [ ] Lint passes (`npx expo lint` once set up)
- [ ] `adhd-ux-guidelines` checklist passes, including the four states and helper text
- [ ] `mobile-accessibility` checks done (screen reader, large text, reduced motion)
- [ ] `banking-security` review checklist passes, and `fintech-security-privacy` rules respected (no keys, no `console.*`, nothing sensitive outside the encrypted database)
- [ ] Tried on a phone with the development build
- [ ] Evidence shown, per `verification-before-completion`

## Code review

Before merging, run a review of the diff (`/code-review`) and fix real issues. For bugs, follow `systematic-debugging` before changing code.

## CI (add once the app exists)

A GitHub Actions workflow in the repository root `.github/workflows/week3-app.yml` that runs only when `Week 3 Coding Challenge/**` changes, with `working-directory` set to that folder: `npm ci`, `npx tsc --noEmit`, `npx expo lint` (fails on any `console.*`), `npm test -- --ci`. Keep CI fast; no device builds in CI for the MVP.

## Spec audit

To audit against `docs/BANKING_PRD_TECHNICAL_REQUIREMENTS.md`, ask Claude Code in this folder: "Review the components directory for UX progressive disclosure compliance and session lifecycle security against docs/BANKING_PRD_TECHNICAL_REQUIREMENTS.md", or run `/code-review`.
