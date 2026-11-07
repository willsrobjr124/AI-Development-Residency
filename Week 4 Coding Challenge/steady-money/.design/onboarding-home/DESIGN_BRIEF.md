# Design Brief: Onboarding and Home

Status: direction approved. Mockups are in the Figma file "ADHD Budgeting App: Onboarding and Home".

## Problem

Adults with ADHD often quit budgeting apps during long setups, or lose the thread on busy screens. Every extra choice or visual distraction is a chance to leave, and a screen full of numbers makes money feel harder.

## Solution

A short setup that gets someone to their safe-to-spend number in minutes, then a home screen that shows that number first, with very little else competing for attention.

## Experience Principles

1. Simplicity over richness -- If an element doesn't help the current task, it comes off the screen.
2. Value before explanation -- People type in their real numbers right away, with no feature tour first.
3. Reassurance over pressure -- Copy lowers the stakes: everything can be changed later or skipped for now.

## Aesthetic Direction

- **Philosophy:** Calm minimalism ("Calm harbor")
- **Tone:** Quiet and reassuring, like a kind friend
- **Reference points:** The simplicity of the Loowner onboarding (one idea per screen, big headline, one full-width button, segmented progress bar, generous white space). Reference for inspiration only; our screens are original.
- **Anti-references:** Dashboards, charts on the home screen, spotlight tours, gamified finance apps

## Color

- White is the base on every screen.
- Deep blue `#006E93` for all text and the primary button.
- Teal `#008F97` for shapes, icons and large numbers only. On white it reaches about 3.9:1, below the 4.5:1 needed for body text.
- Cream `#F8F2C8` is a small accent only, such as one highlighted card. It is never a page background.
- Never use red for money.

## Existing Patterns

The app is still the Expo starter template, so there are no design tokens or components to respect yet.

## Component Inventory

| Component | Status | Notes |
| --- | --- | --- |
| Primary button | New | Full width, bottom of screen, specific verb label |
| Segmented progress bar | New | Paired with "Step X of 4" text |
| Money input | New | Large amount, whole-cent values |
| Helper text | New | 16pt or larger, deep blue |
| Bill row | New | Name, amount, due date |
| Safe-to-spend sentence | New | The number is the largest thing on screen |
| Bucket | New | Word label plus fill level, never color alone |
| Add button | New | Thumb reach, opens quick add |

## Onboarding Flow (proposed)

1. Welcome: one line about the app, then "Get started"
2. Step 1 of 4: balance
3. Step 2 of 4: payday
4. Step 3 of 4: bills, with "Skip for now"
5. Step 4 of 4: savings, with "Skip for now"
6. "Your number is ready", then the home screen

## Key Interactions

- Progress saves after every step. Reopening returns to the same step.
- Buttons stay enabled. If something is missing, a gentle line says what is needed.
- The move from setup to home is one short, calm confirmation. With reduced motion on, it is static.
- Guidance is one helper line beside a control, never an overlay or spotlight.

## Responsive Behavior

Phone first at 375 wide. The web preview uses the same single-column layout.

## Accessibility Requirements

- Text contrast at least 4.5:1; 3:1 for large text, icons and control borders
- Body text 16pt or larger, scaling with system font size without being cut off
- Touch targets at least 44x44pt
- Screen reader labels on all controls, and reduced motion respected

## Decisions

- Font: Atkinson Hyperlegible for now. It may change later, so the font is set once in the theme and never named in individual screens.
- Voice: a kind friend. Warm and relaxed, and it never judges.
- Dark mode: included in this MVP, designed alongside light mode.

## Home Screen Layout

Everything fits on one screen with no scrolling and no tabs. Top to bottom:

1. The number in a sentence, such as "You can safely spend $245 until Friday", with a small "?" for how it was worked out
2. Three buckets in a row: Spending, Bills and Savings, each with a word label and an amount
3. One line for the next bill
4. Full-width "Add expense" button in thumb reach

Reference: the Copilot dashboard, for its plain "left" wording, round budget row and "?" help only. We leave out its chart, tabs, stacked sections and "unlock" messaging. Loowner stays the main visual reference.

## Out of Scope

Bank linking, goal picker, nickname, currency choice (defaults to USD), weekly check-in, reminders and Focus Mode.
