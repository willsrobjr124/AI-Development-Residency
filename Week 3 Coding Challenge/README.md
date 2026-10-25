# Week 3 Coding Challenge: ADHD Budgeting App MVP

A mobile budgeting app for adults with ADHD: one safe-to-spend number, 2-tap logging, and a guilt-free fresh start after any break.

This folder is set up for building the MVP with Claude Code. The app itself has not been scaffolded yet. Open this folder (not the repository root) in Claude Code so it picks up `CLAUDE.md` and the skills.

## What's here

- `CLAUDE.md`: project context and working rules Claude Code reads automatically
- `docs/`: PRD summary and the epics and features
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

## Proposed stack

Expo (React Native, TypeScript), Supabase, Plaid sandbox (after manual mode), Jest.

## Getting started

1. Install Node.js 20+ and the Expo Go app on your phone.
2. Open this folder in Claude Code and ask it to scaffold the Expo app, following `CLAUDE.md`.
