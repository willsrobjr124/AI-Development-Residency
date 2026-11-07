# ADR 0006: Solid privacy cover, no Lottie, and a smaller MVP #1

- **Status:** Accepted
- **Date:** November 7, 2026

## Context

Three smaller choices changed the original plan while building.

## Decision

1. **Solid cover, not blur.** The design used a blur in the app switcher, but "$245" stayed readable under it. The app now uses a solid cover. On Android, a system setting also blanks the recent apps preview, which blocks screenshots unless the person turns on **Allow screenshots** in Settings.
2. **No Lottie.** The rules named Lottie for success moments, but a short fade gives the same calm result with one less dependency. All motion stops with Reduce motion on.
3. **Smaller MVP #1.** The goal picker, bank linking, bill detection, widget, transaction import, weekly check-in, reminders, pause before purchase, Focus Mode and advanced phone security moved to MVP #2. MVP #1 focuses on polishing what exists.

## Consequences

- Privacy is stronger, but screenshots need a setting.
- The written animation rule changed to match.
- Requirement 3 now refers to the reduced MVP #1 list. The original Week 2 scope is larger, and the instructor has been asked to confirm this.

## Alternatives considered

- **Build everything in the original scope:** bank linking and the widget need a backend or native builds that don't fit the time left.
