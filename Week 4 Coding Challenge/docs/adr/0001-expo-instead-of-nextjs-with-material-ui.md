# ADR 0001: Expo instead of Next.js with Material UI

- **Status:** Accepted, pending instructor confirmation
- **Date:** November 7, 2026

## Context

The MVP #1 requirements ask for a Next.js app that uses the Material UI design system. Before that list arrived, the app had already been designed and built as a phone app with Expo, because the product is used in quick moments on a phone, such as logging an expense in two taps.

## Decision

Keep the Expo app (React Native, TypeScript, Expo Router) and its own design system in `ADHDbudget-App/src/theme.ts`. Do not rebuild it in Next.js with Material UI. Expo's web export still gives a public website from the same code.

## Consequences

- One codebase runs on Android and on the web.
- Requirements 4 and 5 (Next.js and Material UI) are not met. This is a known gap, and the instructor has been asked to confirm it is acceptable.
- The design system follows the Figma file and the ADHD rules, not Material Design.
- The money math is plain TypeScript, so it could move to a Next.js app later if needed.

## Alternatives considered

- **Rebuild in Next.js with Material UI:** meets the requirement, but it replaces every screen with about a week left.
- **Keep both:** two apps to maintain, with no benefit to the people using them.
