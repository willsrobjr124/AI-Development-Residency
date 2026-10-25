# ADHD Budgeting App: MVP

A mobile budgeting app for adults with ADHD. It shows what is safe to spend in one glance and welcomes users back after any break without guilt. This repo builds **MVP #1, the closed beta**.

## Read first

- `docs/PRD-summary.md`: problem, audiences, goals, key results
- `docs/epics-and-features.md`: every MVP feature with its user story
- Skills in `.claude/skills/` (load the matching one before working):

**Product and design**

| Skill | Use it when |
|---|---|
| `mvp-scope` | Planning or building any feature; deciding if something is in scope |
| `adhd-ux-guidelines` | Any screen, component, notification or UI copy |
| `mobile-accessibility` | Any component or screen: labels, font scaling, reduced motion |
| `safe-to-spend-math` | Money amounts, safe-to-spend, bills, recurring detection |

**Engineering**

| Skill | Use it when |
|---|---|
| `dev-workflow` | Starting a feature, committing, opening a PR, setting up CI |
| `expo-overview` | Any Expo task; it routes to the right Expo skill |
| `expo-project-structure` | Scaffolding the app or deciding where a file lives |
| `expo-router` | Screens, navigation, tabs, modals, sheets |
| `expo-design-system` | Theme tokens and reusable components |
| `expo-native-ui` | Making screens feel native |
| `expo-animation` | Bucket fills, celebrations, gestures (respect reduced motion) |
| `expo-data-fetching` | Network requests, caching, offline behavior |
| `expo-dev-client` | Building a development build to test on a phone |
| `local-data-and-state` | Tables, repositories, app state, migrations, sync |
| `reminders-and-notifications` | Bill reminders, weekly check-in, snooze |
| `fintech-security-privacy` | Auth, keys, bank linking, logging, analytics, data deletion |
| `supabase` | Auth, database schema, migrations, row-level security |
| `react-native-best-practices` | Performance, lists, animations, bundle size |
| `testing-react-native` | Writing or fixing tests; before calling a feature done |
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
