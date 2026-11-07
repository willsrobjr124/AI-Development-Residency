# ADR 0005: Money changes run as one server step

- **Status:** Accepted
- **Date:** November 7, 2026

## Context

Some actions change more than one row. Marking a bill paid adds a payment and moves the bill to its next date. If only half of that saved, the number would be wrong. A double tap must also never count twice.

## Decision

Every record's id is made at the tap, and repeats are ignored. Actions that touch more than one row run as Postgres functions, so they finish together or not at all. These functions run as the signed-in person, so row-level security still applies. Marking a bill paid also takes the amount out of the balance, so the safe-to-spend number doesn't change.

Deleting an account is the one exception that needs more power. That step sits in a private schema the API can't reach, and it only ever acts on the caller.

## Consequences

- Double taps and retries are safe.
- A failed save leaves numbers unchanged.
- Deleted items are marked, not erased, so Undo can restore them.
- Some logic now lives in SQL as well as TypeScript.

## Alternatives considered

- **Several separate calls from the app:** simpler, but a dropped connection could leave half a change.
- **Edge Functions:** also work, but add a service to deploy and aren't needed yet.
