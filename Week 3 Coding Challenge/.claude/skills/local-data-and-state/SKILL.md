---
name: local-data-and-state
description: Architecture for storing and syncing app data - local-first storage with expo-sqlite, a repository layer, UI state, migrations and later Supabase sync. Use when creating tables, saving or reading balances, expenses, bills or settings, adding app state, or connecting to the backend.
---

# Local data and state

## Principle: local-first

Manual mode must work with no account and no network. A user who opens the app offline still sees safe-to-spend and can quick-add. Supabase sync comes after manual mode works (see `CLAUDE.md`).

## Layers

```
screens/components  ->  hooks (useBills, useSafeToSpend)  ->  repositories  ->  expo-sqlite
                                                             \-> sync (later) -> Supabase
```

- **Screens never touch the database directly.** They call hooks.
- **Repositories** (`data/billsRepo.ts`) are the only code that runs SQL. Each function is small and typed: `listUnpaidBills(until: string): Promise<Bill[]>`.
- **Domain logic** (safe-to-spend math) takes plain data in and returns plain data out, so it can be tested without a database.

## Storage choices

| Data | Where |
|---|---|
| Balances, expenses, bills, categories, check-ins | `expo-sqlite` |
| Small preferences (theme, Focus Mode, reminder times, setup step) | `expo-sqlite` settings table, or AsyncStorage for simple flags |
| Tokens and secrets | `expo-secure-store` only (see `fintech-security-privacy`) |
| Server data after sync | React Query cache (see `expo-data-fetching`) |

## Schema rules

- Amounts are `INTEGER` cents. Currency is a text code. Never `REAL` for money.
- Every table has `id TEXT PRIMARY KEY` (UUID), `created_at`, `updated_at`, and `deleted_at` for soft delete, so undo and later sync are possible.
- Dates for bills are ISO date strings (`2026-11-01`); timestamps are ISO strings in UTC.
- Migrations are numbered files run in order at startup, tracked with `PRAGMA user_version`. Never edit a migration that has shipped; add a new one.

## State

- Data that lives in the database: read through hooks, refresh after writes.
- Short-lived UI state (an open sheet, a form draft): `useState` in the component.
- App-wide UI state (Focus Mode on, reduced motion, current setup step): a small store such as Zustand, persisted to the settings table so it survives a restart. This is how "never lose your place" works.
- Do not put the same data in two stores.

## Undo

Deletes are soft (`deleted_at`), so the undo toast just clears `deleted_at`. Purge soft-deleted rows later.
