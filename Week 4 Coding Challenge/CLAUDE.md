# ADHD Budgeting App: Week 4 MVP

A mobile budgeting app for adults with ADHD. It shows what is safe to spend in one glance and welcomes users back after any break without guilt. This week we **build the MVP**, with a focus on **UI and UX design**.

- **App code:** `ADHDbudget-App/` (Expo, TypeScript, Expo Router; routes in `ADHDbudget-App/src/app/`). The product name is "ADHD Financial App".
- **Product docs:** `../Week 3 Coding Challenge/docs/` (PRD summary, epics and features, build plan, technical requirements, banking requirements).
- **Backlog:** the Notion board "Product Backlog: ADHD Budgeting App" holds every story with its acceptance criteria.

## This week's scope

Core Must-haves, all typed in by hand (no bank link):

1. Quick setup (5 minutes or less, saves your place)
2. Safe-to-spend number
3. Spending, Bills and Savings buckets
4. Quick add with undo
5. Bill countdown
6. Fresh start after a break
7. Privacy: a solid cover in the app switcher and a 5-minute lock

**How we run it:** Expo Go on a phone plus the web preview. Expo Go cannot load SQLCipher or other custom native code, so the encrypted database and the biometric lock are stand-ins this week. Keep them behind one storage module and one lock module so the real versions can be swapped in with a development build later. Never describe the stand-ins as encrypted.

## Design workflow

Run these in order for each feature. Design files live in `ADHDbudget-App/.design/<feature-slug>/`.

1. `design-brief`: interview, then write `DESIGN_BRIEF.md`
2. `information-architecture`: screens, navigation, flows and the words we use
3. `design-tokens` + `expo-design-system`: tokens in `ADHDbudget-App/src/theme.ts`, reusable components in `src/components/`
4. Build the screen
5. `design-review`: screenshots at phone width (375) in the browser preview, then `DESIGN_REVIEW.md`

## Subagents

- **`engineer`** ((@_@) Engineer): ask it for a technical review before building a feature or when a spec changes. It checks feasibility, effort, challenges, performance and open questions. It reads and runs commands but does not write code.
- **`executive`** ((ಠ_ಠ) Executive, Strategic Communication Specialist): ask it to turn technical updates into executive summaries, frame work for the instructor and stakeholders, write business cases, or advise on stakeholder alignment. It reads and runs commands but does not write code.
- **`a11y-reviewer`**: ask it to critique mockups and screens against WCAG 2.2 AA before a design is approved, and to audit UI components after they are built. It reports issues and fixes but does not change files.

## When design skills disagree

Our research-based rules come first. In order of priority:

1. **`adhd-ux-guidelines` and `mobile-accessibility` always win.** No streaks, levels, points, badges or leaderboards. No red numbers or alarm wording for money. One main action per screen. Calm motion that respects reduced motion. Tap targets of at least 44pt. Text that scales.
2. **`expo-design-system` decides where design values live and how components are shaped** (a TypeScript theme, not CSS files). `design-tokens` decides which values to use, derived from the brief.
3. **`mobile-app-ui-design`:** use its hierarchy, spacing (8-point grid), thumb-zone and empty-state advice. Ignore its "sparkles, badges, glow, bounce" and "streaks and levels" suggestions, and its web-only build notes (Tailwind, Lucide, Recharts, backdrop blur). A completed action gets a small, calm acknowledgement at most.
4. **`design-review`:** take screenshots with the built-in browser (there is no Playwright or Cursor browser here). Phone width matters most; tablet and desktop are a quick check only.

## Brand

- Creative direction: calm minimalism in the iOS 26 style (Apple's iOS UI kit, November 2026 redesign in Figma). White is the base on every screen, and anything that doesn't help the current task comes off the screen.
- Font: the system font (SF Pro on iPhone, Roboto on Android). Text sizes follow the iOS text styles in `src/theme.ts`.
- Colors live in `src/theme.ts`. Black text with gray secondary text, a blue accent for buttons and links, and gray rounded lists and fields. Two iOS kit colors are darkened to pass WCAG AA: the accent is `#0066CC` (not `#0088FF`) and secondary text is `#6D6D72`.
- Brand colors stay for the money shapes: deep blue `#006E93` for progress, the check circle and jar outlines, teal `#008F97` for the Spending jar, and cream `#F8F2C8` for the Savings jar only.
- Errors and destructive actions use plum `#5E2657`. Never use red for money amounts. A low or negative number uses calm wording and the normal text color.

## Working rules (from Week 3)

- Money is integer cents, never floats.
- Every write that changes money is idempotent (one client ID per action) and atomic.
- Every screen has all four states: empty, loading, success and error.
- No `console.*` in app code. Never log or send money details anywhere.
- The app gives budgeting tools only, never financial advice.
- Write unhappy-path tests before the happy path. Run lint and typecheck before calling work done.
- Follow `ADHDbudget-App/AGENTS.md` for Expo specifics: use `npx expo install` for packages and check the versioned Expo docs, not memory.
