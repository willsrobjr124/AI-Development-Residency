---
name: fintech-security-privacy
description: Security and privacy rules for a budgeting app that handles financial data - secrets, token storage, Supabase row-level security, bank linking with Plaid, logging, analytics and data deletion. Use before adding auth, bank linking, any API key, logging, analytics, or anything that stores or sends user financial data.
---

# Security and privacy

Users trust this app with their money data, and many are anxious about it already. A leak would end the product.

## Secrets

- No keys in source code or in git. Local values go in `.env` (git-ignored); commit `.env.example` with empty values.
- Anything in the app bundle is public, including `EXPO_PUBLIC_*` variables. Only the Supabase URL and anon key may go there. Plaid secrets, Supabase service-role keys and any other server keys live only in Supabase Edge Function secrets.
- Before every commit, check the diff for keys (`sk_`, `secret`, `service_role`, long random strings).

## On the device

Device, session, network and runtime controls are required and live in the `banking-security` skill (from `docs/BANKING_PRD_TECHNICAL_REQUIREMENTS.md`). In short:

- Auth sessions, tokens and the database key: `expo-secure-store` (Keychain / Keystore), never AsyncStorage or plain SQLite.
- Financial data lives only in the SQLCipher-encrypted (AES-256) database; nothing sensitive in plaintext anywhere.
- Biometric unlock, a 5-minute inactivity lock that clears sensitive memory, and a blur overlay when the app goes to the background.
- No `console.*` output at all in production builds.

## Supabase

- Row-level security on every table, with policies scoped to `auth.uid()`. A table without RLS must not ship. Use the `supabase` skill's security checks.
- The app uses the anon key only. Service-role access happens only in Edge Functions.
- Writes go through Edge Functions or Postgres functions that accept an `X-Idempotency-Key` and run in one transaction (see `banking-security` section 6).

## Bank linking (Plaid, after manual mode)

- Use Plaid **sandbox** until the beta is approved.
- Flow: the app asks an Edge Function for a `link_token`; the user links in Plaid Link; the app sends the `public_token` to the Edge Function, which exchanges it for an `access_token` and stores it server-side. The `access_token` never reaches the device.
- Request only the products the MVP needs (transactions and balances).
- Linking is always optional (see `mvp-scope`).

## Analytics and logs

- Track events, not money: `expense_added`, `fresh_start_used`, `check_in_completed`. Never send amounts, merchant names, balances or account details.
- Crash reports must scrub financial values.
- Ask for analytics consent during setup in plain words, and respect "no".

## User control

- Settings include "Delete my data": removes local data and, if signed in, server data.
- Plain-language privacy summary in the app: what we store, where, and what we never do (sell data, give financial advice).

## Not financial advice

The app shows the user's own numbers and lets them choose. Copy never tells a user what to invest in or how much to save; suggestions are user-adjustable defaults ("Set aside part of this raise? You choose how much").
