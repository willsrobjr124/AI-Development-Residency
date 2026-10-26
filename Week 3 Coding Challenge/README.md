# Week 3 Coding Challenge: ADHD Budgeting App MVP

A mobile budgeting app for adults with ADHD: one safe-to-spend number, 2-tap logging, and a guilt-free fresh start after any break.

This folder is set up for building the MVP with Claude Code. The app itself has not been scaffolded yet. Open this folder (not the repository root) in Claude Code so it picks up `CLAUDE.md` and the skills.

## What's here

- `CLAUDE.md`: project context and working rules Claude Code reads automatically
- `docs/`: PRD summary, the epics and features, the banking UX and security requirements (`BANKING_PRD_TECHNICAL_REQUIREMENTS.md`), and two plain-language documents for stakeholders and designers:
  - [`BUILD_PLAN.md`](docs/BUILD_PLAN.md): the MVP build plan (phases and timeline, feature priorities, design schedule, roles, pre-mortem risks, decisions needed)
  - [`TECHNICAL_REQUIREMENTS.md`](docs/TECHNICAL_REQUIREMENTS.md): the technical requirements document (system overview, technology choices, numbered requirements, data, testing, release)
- `.claude/skills/`: skills Claude Code loads while building

| Skill | Purpose | Source |
|---|---|---|
| `mvp-scope` | MVP features, acceptance criteria, out of scope | Written for this project |
| `adhd-ux-guidelines` | Design and copy rules for ADHD users | Written for this project from our UX research |
| `safe-to-spend-math` | Money, safe-to-spend and bill rules with required tests | Written for this project |
| `react-native-best-practices` | React Native performance guidance (MIT; screenshots omitted) | Callstack |
| `supabase` | Supabase auth, database and security guidance | Supabase |
| `systematic-debugging` | Root-cause debugging process | obra/superpowers |
| `verification-before-completion` | Check work before claiming it is done | obra/superpowers |
| `dev-workflow` | Vertical slices, commits, definition of done, code review, CI | Written for this project |
| `testing-react-native` | Jest and React Native Testing Library, test-first money logic | Written for this project |
| `local-data-and-state` | Local-first storage with expo-sqlite, repositories, state, sync | Written for this project |
| `mobile-accessibility` | Roles and labels, font scaling, reduced motion, screen reader checks | Written for this project |
| `banking-security` | Encrypted database, biometric and 5-minute lock, privacy blur, jailbreak check, pinning, idempotent and atomic writes | Written for this project from the banking requirements doc |
| `fintech-security-privacy` | Secrets, token storage, row-level security, Plaid flow, analytics rules | Written for this project |
| `reminders-and-notifications` | Bill reminders, check-in nudge and snooze with expo-notifications | Written for this project |
| `expo-overview`, `expo-project-structure`, `expo-router`, `expo-design-system`, `expo-native-ui`, `expo-animation`, `expo-data-fetching`, `expo-dev-client` | Official Expo guidance (MIT), installed with the `skills` CLI; versions pinned in `skills-lock.json` | [expo/skills](https://github.com/expo/skills) |

To update the Expo skills later, run `npx skills@latest update` from this folder.

## Proposed stack

Expo (React Native, TypeScript) as a development build, SQLCipher-encrypted local database, Supabase, Plaid sandbox (after manual mode), Jest.

## Getting started

1. Install Node.js 20+. The app needs a development build (`expo-dev-client`) because Expo Go cannot run the encrypted database or biometric lock; see the `expo-dev-client` skill.
2. Open this folder in Claude Code and ask it to scaffold the Expo app, following `CLAUDE.md`.
