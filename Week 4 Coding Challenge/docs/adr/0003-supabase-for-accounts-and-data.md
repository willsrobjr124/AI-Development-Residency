# ADR 0003: Supabase for accounts and data

- **Status:** Accepted
- **Date:** November 7, 2026

## Context

The requirements need sign up and log in, data that survives logging out and back in, and each person seeing only their own information. The first build saved everything to a SQLite file on the phone, and the Week 3 plan treated the cloud as an optional backup.

## Decision

Use Supabase for accounts and as the main database. The app reads and writes Supabase directly, and the phone database is removed. Every table has row-level security tied to the signed-in person.

## Consequences

- Login is now required. This changes the earlier decision that accounts were optional.
- Data follows the person across devices, and the same code works on the web.
- The app needs a connection. Offline use, which the Week 3 plan promised, moves to a later release.
- Data no longer sits in an unencrypted file on the phone. A sign-in session is kept in the phone's secure vault.
- Only the public key is in the app. Safety comes from the row-level security rules, which a two-person test confirmed.

## Alternatives considered

- **Keep SQLite and sync to Supabase:** keeps offline use, but syncing is the riskiest work and could lose or duplicate money records.
- **Firebase:** the Week 3 plan and the requirements name Supabase, and money data suits a relational database.
