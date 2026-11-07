# ADR 0004: Sign up without email confirmation for now

- **Status:** Accepted
- **Date:** November 7, 2026

## Context

Supabase's built-in email service sends only a few messages an hour, which would block sign-ups during a demo. Links in emails are also unreliable inside Expo Go.

## Decision

Turn off "Confirm email", so people can sign up and start right away. Password reset uses a 6-digit code typed into the app, not a link. The app still supports a confirmation code, so turning confirmation back on needs no new screens.

## Consequences

- Sign-up is fast, which suits people who drop off during long setups.
- Emails aren't verified, so someone could sign up with a mistyped address and be unable to reset their password.
- Before a real beta, add a custom email provider and turn confirmation back on.

## Alternatives considered

- **Keep confirmation on:** safer, but the email limit could stop people signing up.
- **Passwordless email codes only:** every login would need an email, which hits the same limit.
