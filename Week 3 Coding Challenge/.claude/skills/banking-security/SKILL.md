---
name: banking-security
description: Required security controls from docs/BANKING_PRD_TECHNICAL_REQUIREMENTS.md - encrypted local storage, biometrics, 5-minute session lock, privacy blur, rooted/jailbroken device check, network pinning, log removal, obfuscation, idempotent writes and atomic transactions. Use before writing any storage, auth, networking, app-lifecycle, build-config or data-mutation code, and when reviewing code for release.
---

# Banking security controls

Baseline: `docs/BANKING_PRD_TECHNICAL_REQUIREMENTS.md`. These controls are **required for the MVP**, not later. Most need native modules, so develop with a development build (`expo-dev-client` skill), not Expo Go.

## 1. Data at rest

- **No plaintext financial or personal data on the device.** The local database is encrypted with SQLCipher (AES-256): enable it with the `expo-sqlite` config plugin option `useSQLCipher: true` and run `PRAGMA key` right after opening, before any other query.
- The database key is random (32 bytes), generated on first launch and stored only in `expo-secure-store` (iOS Keychain / Android Keystore). It is never logged, hard-coded or sent anywhere.
- AsyncStorage may hold only non-sensitive flags (theme, reduced motion). Never amounts, names, merchants, account details or tokens.
- Setup progress and drafts live in the encrypted database, so "never lose your place" still works after a lock.

## 2. Identity and session

- **Biometrics:** `expo-local-authentication` (Face ID / Touch ID / Android BiometricPrompt), with device passcode fallback. Check `hasHardwareAsync` and `isEnrolledAsync`; if neither is available, require the device passcode flow.
- **5-minute hard inactivity timeout:** track the last user interaction and time spent in the background. At 5 minutes, show the lock screen and immediately clear sensitive state from memory: reset the app store, call `queryClient.clear()`, and drop any decrypted values held in variables.
- After unlock, reopen the same screen and step (progress comes from the encrypted database, not memory).
- Lock screen copy is calm: "Locked to keep your money private. Unlock to pick up where you left off." Never "Session expired".

## 3. Privacy masking

- Listen to `AppState`. On `inactive` or `background`, render a full-screen `BlurView` from `expo-blur` (with a solid fallback color) over the app so balances are hidden in the app switcher. Keep it up through a phone lock and wake, and fade it out only once the app is `active` again (instant removal with reduced motion).
- Account numbers: store and use Plaid's `account_id` tokens, never full account numbers; display only the last 4 digits ("Checking ••1234").
- The home-screen widget and notifications must not show amounts by default (widget shows "Tap to view"; see `reminders-and-notifications`). Showing amounts is an explicit opt-in in settings, with a plain-language warning.

## 4. Runtime defenses

- **Rooted / jailbroken check** on startup, before unlocking any data (for example `jail-monkey`). If detected, show a calm blocking screen ("For your safety, this app can't run on a modified device") and do not open the database. No shame, no technical jargon.
- **Production logging:** no `console.log`, `console.debug` or trace output in production. Enforce with ESLint `no-console` (error) and `babel-plugin-transform-remove-console` in the production Babel environment. Use a small `logger` wrapper that is a no-op in production for development diagnostics.
- **Build hardening:** Hermes enabled (default); Android release builds with R8/ProGuard on (`expo-build-properties`: `enableProguardInReleaseBuilds`); no secrets, internal URLs or debug route names as string literals in the app bundle.

## 5. Network

- HTTPS only. Server endpoints (Supabase, Edge Functions) must accept TLS 1.3; the client never allows plain HTTP or user-installed certificates.
- **Certificate pinning** for our API hosts (for example `react-native-ssl-public-key-pinning`), with a primary and a backup public-key pin so a certificate rotation does not lock users out. Initialize pinning before the first request.
- Limitation to document: the client cannot force TLS 1.3 on every OS version; pinning plus a TLS 1.3 server is the control.

## 6. Transaction integrity

- **Idempotency:** every mutation (quick add, edit, delete, bucket move, sync push) gets a client-generated UUID v4 idempotency key at the moment the user acts. Local writes use it as the row id, so a double tap or retry cannot create two rows. Network writes send it as the `X-Idempotency-Key` header.
- Server writes go through Edge Functions or Postgres functions (RPC) that record processed keys in an `idempotency_keys` table and return the original result for repeats.
- Disable the submit button while a write is in flight as a second guard.
- **Atomicity:** local multi-row changes run inside `withTransactionAsync`; server multi-row changes run inside one Postgres function (one transaction). If a write fails or the network drops, roll back and restore the previous UI state, then show the shame-free error state.

## 7. Workflow rules (from the spec)

- **Unhappy paths first:** write the error, offline, timeout and invalid-input handling (and their tests) before the success path.
- Before finishing any change, check it against sections 1 to 6 and say which controls it touches.
- At every phase gate, a person runs the four manual checks in `docs/TECHNICAL_REQUIREMENTS.md` on a real phone: blur in the app switcher, blur on wake, triple-tap Confirm saves once, walk-away lock at 5 minutes.

## Review checklist

- [ ] No sensitive value written outside the encrypted database or secure store
- [ ] Sensitive state cleared on lock; lock triggers at 5 minutes
- [ ] Blur overlay on background; widget and notifications masked by default
- [ ] Rooted/jailbroken check runs before data access
- [ ] No `console.*` in production code paths
- [ ] Every mutation carries an idempotency key; multi-row writes are atomic
- [ ] Network calls go only to pinned HTTPS hosts
