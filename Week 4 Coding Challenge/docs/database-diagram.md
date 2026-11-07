# Database Diagram

The ADHD Financial App stores its data in Supabase (Postgres). Every table is locked with row-level security, so each person can reach only their own rows. Money is stored as whole cents.

The SQL that builds this database is in [`steady-money/supabase/migrations`](../steady-money/supabase/migrations).

```mermaid
erDiagram
    AUTH_USERS ||--|| USER_SETTINGS : has
    AUTH_USERS ||--o{ BILLS : owns
    AUTH_USERS ||--o{ BILL_PAYMENTS : owns
    AUTH_USERS ||--o{ EXPENSES : owns
    AUTH_USERS ||--o{ SAVINGS_MOVES : owns
    BILLS ||--o{ BILL_PAYMENTS : "paid by"

    AUTH_USERS {
        uuid id PK
        text email
    }
    USER_SETTINGS {
        uuid user_id PK
        bigint balance_cents
        timestamptz balance_set_at
        date next_payday
        text setup_step
        date last_opened
        boolean reduce_motion
        boolean allow_screenshots
        boolean bucket_hint_seen
    }
    BILLS {
        uuid id PK
        uuid user_id FK
        text name
        bigint amount_cents
        date due_date
        boolean repeats_monthly
        timestamptz paid_at
        timestamptz deleted_at
    }
    BILL_PAYMENTS {
        uuid id PK
        uuid user_id FK
        uuid bill_id FK
        bigint amount_cents
        date due_date
        timestamptz deleted_at
    }
    EXPENSES {
        uuid id PK
        uuid user_id FK
        bigint amount_cents
        text category
        timestamptz created_at
        timestamptz deleted_at
    }
    SAVINGS_MOVES {
        uuid id PK
        uuid user_id FK
        bigint amount_cents
        timestamptz created_at
        timestamptz deleted_at
    }
```

## What each table holds

| Table | What it holds |
| --- | --- |
| `auth.users` | Accounts, managed by Supabase Auth |
| `user_settings` | One row per person: typed balance, next payday, setup step and preferences |
| `bills` | Each bill, with its next due date |
| `bill_payments` | A record each time a bill is marked paid, so Undo can reverse it |
| `expenses` | Each quick add. Removing one sets `deleted_at`, so Undo can bring it back |
| `savings_moves` | Money moved into Savings (positive) or back to Spending (negative) |

The tables also have `created_at` and `updated_at` columns, left out above to keep the diagram readable.

Prepared by Robert Wills · © 2026
