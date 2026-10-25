# ADHD Budgeting App: MVP

A mobile budgeting app for adults with ADHD. It shows what is safe to spend in one glance and welcomes users back after any break without guilt. This repo builds **MVP #1, the closed beta**.

## Read first

- `docs/PRD-summary.md`: problem, audiences, goals, key results
- `docs/epics-and-features.md`: every MVP feature with its user story
- Skills in `.claude/skills/` (load the matching one before working):

| Skill | Use it when |
|---|---|
| `mvp-scope` | Planning or building any feature; deciding if something is in scope |
| `adhd-ux-guidelines` | Any screen, component, notification or UI copy |
| `safe-to-spend-math` | Money amounts, safe-to-spend, bills, recurring detection |
| `react-native-best-practices` | Performance, lists, animations, bundle size |
| `supabase` | Auth, database schema, migrations, row-level security |
| `systematic-debugging` | Any bug or failing test, before proposing a fix |
| `verification-before-completion` | Before saying work is done, committing or opening a PR |

## Proposed stack

Not yet set up. Confirm with the team before scaffolding.

- **App:** Expo (React Native) with TypeScript and Expo Router
- **Backend:** Supabase (Auth, Postgres with row-level security)
- **Bank data:** Plaid in sandbox mode, added after manual mode works
- **Tests:** Jest and React Native Testing Library

## Working rules

- Build manual mode first (typed balance, quick add, bills, safe-to-spend), then bank import.
- Money is integer cents, never floats.
- Every user-facing change passes the `adhd-ux-guidelines` checklist.
- Never commit secrets. Keys go in `.env` (git-ignored); commit `.env.example` only.
- Never log or send transaction details to analytics.
- The app gives budgeting tools only, never financial advice.
