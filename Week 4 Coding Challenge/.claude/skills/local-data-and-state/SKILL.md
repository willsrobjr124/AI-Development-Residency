---
name: local-data-and-state
description: Architecture for storing and syncing app data - local-first storage in an encrypted (SQLCipher) expo-sqlite database, a repository layer, idempotent and atomic writes, UI state, migrations and later Supabase sync. Use when creating tables, saving or reading balances, expenses, bills, buckets or settings, adding app state, or connecting to the backend.
---

# Local data and state

## Principle: local-first, encrypted

Manual mode must work with no account and no network. A user who opens the app offline still sees safe-to-spend and can quick-add. Supabase sync comes after manual mode works (see `CLAUDE.md`).

All local data is encrypted at rest. Follow `banking-security` sections 1 and 6; the essentials are repeated here.

## Layers

```
screens/components  ->  hooks (useBills, useSafeToSpend)  ->  repositories  ->  expo-sqlite (SQLCipher)
                                                             \-> sync (later) -> Edge Functions -> Supabase
```

- **Screens never touch the database directly.** They call hooks.
- **Repositories** (`data/billsRepo.ts`) are the only code that runs SQL. Each function is small and typed: `listUnpaidBills(until: string): Promise<Bill[]>`.
- **Domain logic** (safe-to-spend math) takes plain data in and returns plain data out, so it can be tested without a database.
- **One place opens the database** (`data/db.ts`): it reads the key from `expo-secure-store`, opens the database, runs `PRAGMA key` before anything else, then runs migrations.

## Storage choices

| Data | Where |
|---|---|
| Balances, expenses, bills, buckets, categories, check-ins | Encrypted `expo-sqlite` (SQLCipher, AES-256) |
| Setup step, drafts, reminder times | Encrypted `expo-sqlite` settings table |
| Non-sensitive flags only (theme, reduced motion) | AsyncStorage allowed |
| Database key, auth tokens | `expo-secure-store` only (Keychain / Keystore) |
| Server data after sync | React Query cache in memory (see `expo-data-fetching`); cleared on lock |

Never put amounts, names, merchants or account details in AsyncStorage, files, logs or the widget's shared storage.

## Schema rules

- Amounts are `INTEGER` cents. Currency is a text code. Never `REAL` for money.
- Every table has `id TEXT PRIMARY KEY` (UUID), `created_at`, `updated_at`, and `deleted_at` for soft delete, so undo and later sync are possible.
- Dates for bills are ISO date strings (`2026-11-01`); timestamps are ISO strings in UTC.
- Migrations are numbered files run in order at startup, tracked with `PRAGMA user_version`. Never edit a migration that has shipped; add a new one.

## Writes: idempotent and atomic

- Generate the row's UUID when the user acts (the tap), and use it as the idempotency key. Inserts use `INSERT ... ON CONFLICT(id) DO NOTHING`, so a double tap or retry never creates a duplicate.
- Any change touching more than one row (moving money between buckets, fresh start, marking a bill paid and rolling it forward) runs inside `withTransactionAsync`. On error, the transaction rolls back and the UI returns to its previous state with the shame-free error state.
- Sync pushes each mutation with its key in the `X-Idempotency-Key` header (see `banking-security` section 6).

## State

- Data that lives in the database: read through hooks, refresh after writes.
- Short-lived UI state (an open sheet, a form draft): `useState` in the component; drafts worth keeping are saved to the encrypted settings table.
- App-wide UI state (Focus Mode, reduced motion, current setup step): a small store such as Zustand, persisted to the encrypted settings table so it survives a restart and a lock. This is how "never lose your place" works.
- On the 5-minute lock, reset in-memory stores and caches that hold financial values; reload them from the database after unlock.
- Do not put the same data in two stores.

## Undo

Deletes are soft (`deleted_at`), so the undo toast just clears `deleted_at`. Purge soft-deleted rows later.
