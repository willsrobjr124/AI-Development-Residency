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

- Auth sessions and tokens: `expo-secure-store`, never AsyncStorage or SQLite.
- Financial data in local SQLite is acceptable for the MVP; offer an optional app lock (device biometrics) in settings.
- Never write amounts, merchants or account numbers to `console.log` in release builds.

## Supabase

- Row-level security on every table, with policies scoped to `auth.uid()`. A table without RLS must not ship. Use the `supabase` skill's security checks.
- The app uses the anon key only. Service-role access happens only in Edge Functions.

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
