---
name: adhd-ux-guidelines
description: Design and copy rules for an app used by adults with ADHD. Use whenever you build or change any screen, component, flow, notification, empty state, error message or piece of UI copy in this app, and before marking UI work done.
---

# ADHD UX guidelines

Our users are adults with ADHD (diagnosed or self-identified). Planning, working memory, sense of time and impulse control are hard for them, and money needs all four. Every screen must lower effort and never shame the user.

## The nine rules

1. **One decision per screen.** No dashboards packed with charts. Lead with the most important thing; reveal detail on tap (progressive disclosure).
2. **Money stays visible.** The safe-to-spend number is the first thing on the home screen and in the widget. Never hide it behind a tap.
3. **No shame, easy undo.** Neutral words only (see copy rules). No red alarms, no "over budget" warnings, no streaks that break. Every destructive action can be undone, and every error says what went wrong and how to fix it.
4. **Small wins count.** Confirm each action with a clear status message. Celebrate any check-in, not perfect weeks.
5. **Fast or it won't happen.** Core actions (check balance, quick add) take under 5 seconds. Use smart defaults so setup asks few questions.
6. **Never lose your place.** Save progress automatically. A user who leaves mid-task reopens at the same step. No modal pop-ups in the middle of a task.
7. **Calm by default, adjustable by choice.** No autoplay, flashing or busy backgrounds. Focus Mode hides everything but the current task. Users can turn off motion and sound and choose dark mode.
8. **Gentle, snoozable reminders.** The user picks the time and can snooze or mute any reminder. Never nag.
9. **Easy to read.** Readable font (Atkinson Hyperlegible or Lato), body text 16pt or larger, line height about 1.5, contrast above WCAG AA, touch targets at least 44x44pt, and specific button labels ("Add expense", not "Next").

## Copy rules

| Instead of | Write |
|---|---|
| "You're over budget" | "Here's where things landed this week" |
| "You missed 12 days" | "Welcome back. Want a fresh start?" |
| "Error: invalid input" | "That amount needs a number, like 12.50" |
| "Streak lost" | (no streaks at all) |
| "Next" / "Submit" | "Add expense", "Save bill", "See my number" |

- Short sentences. Second person ("you"). No exclamation-mark pressure.
- Multi-step flows show progress: "Step 2 of 4".
- Never mention how long the user was away.

## Review checklist (run before calling UI work done)

- [ ] Does the screen ask for one decision only?
- [ ] Is safe-to-spend visible where the user expects it?
- [ ] Any red, alarm or shame wording? Remove it.
- [ ] Can every destructive action be undone?
- [ ] If the user leaves now, is their progress saved?
- [ ] Any pop-up interrupting a task? Remove it.
- [ ] Does it respect reduced motion, sound off and dark mode settings?
- [ ] Body text at least 16pt, touch targets at least 44pt, contrast at least AA?
- [ ] Are button labels specific verbs?

## Sources

Accessibility Checker, "The Principles of Neurodivergent UX Design" (2026); UXPA, "Designing for ADHD in UX" (2025); Din Studio, "UI/UX for ADHD" (2025); Design Monks, "UI/UX and ADHD" (2026); iFactory, "From Barrier to Gateway" (2025).
