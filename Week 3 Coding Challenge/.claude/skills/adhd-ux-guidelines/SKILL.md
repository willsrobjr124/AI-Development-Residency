---
name: adhd-ux-guidelines
description: Design and copy rules for an app used by adults with ADHD. Use whenever you build or change any screen, component, flow, notification, empty state, error message or piece of UI copy in this app, and before marking UI work done.
---

# ADHD UX guidelines

Our users are adults with ADHD (diagnosed or self-identified). Planning, working memory, sense of time and impulse control are hard for them, and money needs all four. Every screen must lower effort and never shame the user.

## The rules

1. **One decision per screen.** No dashboards packed with charts. Lead with the most important thing; mask secondary numbers by default and reveal detail on tap (progressive disclosure).
2. **Money stays visible inside the app.** Once unlocked, the safe-to-spend number is the first thing on the home screen, never behind a tap. Outside the app (widget, notifications, app switcher) amounts are hidden by default for privacy (see `banking-security`); the widget shows "Tap to view" unless the user opts in.
3. **No shame, easy undo.** Neutral words only (see copy rules). No red alarms, no "over budget" warnings, no streaks that break. Every destructive action can be undone, and every error says what went wrong and how to fix it.
4. **Small wins count.** Confirm each action with a clear status message. Celebrate any check-in, not perfect weeks.
5. **Fast or it won't happen.** Core actions (check balance, quick add) take under 5 seconds. Use smart defaults so setup asks few questions.
6. **Never lose your place.** Save progress automatically. A user who leaves mid-task reopens at the same step. No modal pop-ups in the middle of a task.
7. **Calm by default, adjustable by choice.** No autoplay, flashing or busy backgrounds. Focus Mode hides everything but the current task. Users can turn off motion and sound and choose dark mode.
8. **Gentle, snoozable reminders.** The user picks the time and can snooze or mute any reminder. Never nag.
9. **Easy to read.** Readable font (Atkinson Hyperlegible or Lato), body text 16pt or larger, line height about 1.5, contrast above WCAG AA, touch targets at least 44x44pt, and specific button labels ("Add expense", not "Next").
10. **Four states on every screen and component that loads or saves data:** Initial (what to do first), Loading (low-contrast skeleton placeholders that pulse slowly, about once a second, and stay still with reduced motion; never fast spinners), Success (confirmation plus a small micro-interaction) and Error (soft sage or blue, shame-free recovery text that says the money is safe, one clear next step, no error codes or capitals, and nothing lost).
11. **Just-in-time coaching.** Put one short, plain helper sentence next to an interactive element the first times it matters ("Tap a bucket to move money between them."). Body size (16pt or larger), not italic, hideable once the user has used the feature.
12. **Money as visual buckets.** Show money as distinct, tactile units (Spending, Bills, Savings) that fill and empty, rather than lists of numbers. Each bucket uses its palette color (teal spending, indigo bills, savings in its own color) plus a word, never color alone.
13. **Micro-interactions that validate, gently.** A short Lottie animation (under about 1 second, low stimulation) confirms success: an expense added, a bucket filled, a check-in done. With reduced motion on, show a static confirmation instead. Never reward streaks.
14. **Support, never condition.** No reward-and-punishment mechanics: no points, badges, sad faces, warnings for "bad" spending or labels of spending as good or bad. The user sets their own goals, reminder times and limits, and can change or turn them off. Use respectful language that treats ADHD as a difference, not a defect, and design for interest-driven bursts of attention rather than daily discipline. Features that share data with anyone else (partners, coaches) are off by default and the user's choice. When testers use a feature in unexpected ways, treat it as design feedback, not user error.

## Copy rules

| Instead of | Write |
|---|---|
| "You're over budget" | "Here's where things landed this week" |
| "You missed 12 days" | "Welcome back. Want a fresh start?" |
| "Error: invalid input" | "That amount needs a number, like 12.50" |
| "Streak lost" | (no streaks at all) |
| "Next" / "Submit" | "Add expense", "Save bill", "See my number" |
| "Session expired" | "Locked to keep your money private. Unlock to pick up where you left off." |
| "Network error" | "We couldn't save that just now. Your entry is safe; we'll try again." |
| "Bad spending" / "Good job staying on budget!" | Neutral facts: "$12 added to Fun" |
| "People who suffer from ADHD" | "People with ADHD" |

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
- [ ] Are all four states (Initial, Loading, Success, Error) designed and built?
- [ ] Is there a one-line helper next to any control a new user might not understand?
- [ ] Are money amounts shown as buckets where it helps, with words as well as color?
- [ ] Do success animations stay short and switch off with reduced motion?
- [ ] Any points, badges, warnings or good/bad labels that reward or punish? Remove them.
- [ ] Can the user set, change or turn off every goal, reminder and limit themselves?

## Sources

Accessibility Checker, "The Principles of Neurodivergent UX Design" (2026); UXPA, "Designing for ADHD in UX" (2025); Din Studio, "UI/UX for ADHD" (2025); Design Monks, "UI/UX and ADHD" (2026); iFactory, "From Barrier to Gateway" (2025); Spiel, Hornecker, Williams and Good, "ADHD and Technology Research – Investigated by Neurodivergent Readers," CHI 2022 (rule 14); Bangma, Tucha, Fuermaier, Tucha and Koerts, "Financial decision-making in a community sample of adults with and without current symptoms of ADHD," PLOS ONE 2020 (adults with ADHD symptoms save less and avoid or rush money decisions, so keep choices small and keep a Savings bucket).
