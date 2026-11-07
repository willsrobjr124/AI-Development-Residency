# Accessibility Review: App Designs

**Reviewer:** a11y-reviewer subagent (WCAG 2.2 AA, plus this project's accessibility and ADHD rules)
**Date:** November 7, 2026
**Reviewed:** all 44 mobile screens in the Figma file [ADHD Budgeting App: Onboarding and Home](https://www.figma.com/design/I7sMJVM9BSOtZDEKiLtx9B): 8 onboarding and home screens, and 36 feature flow screens
**Evidence:** colors, text sizes, tap areas and layout read from the Figma file, plus images of every screen. Contrast is calculated with the WCAG formula. No code exists yet, so nothing was tested on a phone or with a screen reader.

## Status: Non-Compliant Blockers

The colors and tap sizes are strong. Two things fail at AA level on core flows: the home screen can't work with large text under its "no scrolling" rule, and the app is locked to portrait.

| Severity | Count |
| --- | --- |
| Blocker | 2 |
| Serious | 7 |
| Moderate | 9 |
| Minor | 7 |
| **Total** | **25** |

Most findings are design gaps, not WCAG failures. Only A1, A2, A3 and A8 are WCAG failures. A1 and A3 are failures of the design as specified, because there is no code to test yet. The 200% text sizes in A1 and A3 are worked out from the design's measurements, so confirm them on a phone.

**Suggested order:** fix A1 and A2 first, because they shape the home layout. Then fix A3 to A7 and A9 in the components before building, with A10 to A14 alongside them. A8, A21, A22 and A25 can wait for their Epics.

## Fix progress

Updated November 7, 2026, after the first round of Figma fixes. The file now has 47 screens, because three were added. The a11y-reviewer has not re-checked these fixes yet.

| Status | Notes | What's left |
| --- | --- | --- |
| **Fixed in Figma** | A5, A8, A10, A14, A17, A19, A20, A21, A22, A23, A24, A25 | Nothing in Figma |
| **Partly fixed** | A1, A3, A4, A6, A7, A9, A11, A18 | See below |
| **Not started** | A2, A12, A13, A15, A16 | All of the fix |

**What's left on the partly fixed notes:**

- **A1:** a 200% home screen is drawn. The brief still says "no scrolling", and scrolling itself happens in the build.
- **A3:** components now grow with their content. Labels wrapping and stacking at large sizes happen in the build.
- **A4:** Undo now has its own 65x56 target. Rename still needs one. How long Undo stays, and a way to remove recent expenses, are still to decide.
- **A6:** home has a tappable bill row on the main home versions. Where settings lives is still to decide.
- **A7:** all four steps have Back. Screens to edit the balance, payday and savings aren't drawn.
- **A9:** one keyboard screen shows the pattern, on Quick add. The other input screens should follow it.
- **A11:** the helper line is on home. What tapping Bills does, and moving money out of Savings, aren't drawn.
- **A18:** the Savings level is taller and now rises with the amount. The stronger fill color wasn't applied, because it would add a new color to the brand.

## What already passes

- **Text contrast:** every text pair passes in light and dark. The lowest is 5.07:1 against the 4.5:1 needed.
- **Teal:** #008F97 is never used for text, as the brief asks.
- **No red:** none of the file's colors is red. Amounts stay in the normal text color, even on the $0 screen.
- **Text size:** the smallest text is 17pt (the rule is 16pt or larger). Body line height is about 1.5.
- **Tap sizes:** Primary button 327x58, text button 327x48, Option 327x58, Chip 44 tall with 8pt gaps, Mark paid 112x49, Add 59x49, Remove 91x49, "?" 44x44 frame, Back and Home 327x46 frame, Bucket 101x212.
- **Color alone (1.4.1):** buckets have a word and an amount. Progress has "Step X of 4". The error uses words, not color.
- **Gestures (2.5.1, 2.5.7):** nothing needs dragging, swiping or two fingers.
- **Error text (3.3.1, 3.3.3):** "That amount needs a number, like 12.50" says what's wrong and how to fix it.
- **Labels (3.3.2):** fields have visible labels that stay put. Money inputs use the heading as their label.
- **Sign-in (3.3.8):** the app has no passwords or puzzles.
- **Repeat typing (3.3.7):** no flow asks for the same thing twice (see A14 for one risk).
- **ADHD rules:** the number comes first on every home version. There are no streaks, badges or pop-ups in a task. Copy stays kind, and nothing mentions time away. Undo is drawn for quick add, money moves, Mark paid and added bill suggestions.

## Contrast results

### Light mode

| Pair | Ratio | Needed | Result | Where used |
| --- | --- | --- | --- | --- |
| #006E93 on #FFFFFF | 5.75 | 4.5 | Pass | All text, icons, control borders, jar outlines |
| #FFFFFF on #006E93 | 5.75 | 4.5 | Pass | Primary button, selected Option and Chip, check mark |
| #006E93 on #F8F2C8 | 5.07 | 4.5 | Pass | Confirmation text and Undo |
| #008F97 on #FFFFFF | 3.91 | 3 | Pass | Spending fill (shape only; would fail as text) |
| #006E93 vs #DCE9EE | 4.64 | 3 | Pass | Filled vs unfilled progress segments |
| #DCE9EE on #FFFFFF | 1.24 | Not required | See note | Unfilled progress, row dividers |
| #F8F2C8 on #FFFFFF | 1.13 | Not required | See note | Savings fill, Confirmation background |
| #DCE9EE on #FFFFFF | 1.24 | 3 | **Fail** | Toggle track, off state (A8) |
| #FFFFFF on #DCE9EE | 1.24 | 3 | **Fail** | Toggle knob on track (A8) |

**Note:** the "not required" rows aren't 1.4.11 failures. Dividers are decoration, progress is also given as text, the Savings level has a 5.75:1 outline and a written amount, and Confirmation's text carries the meaning. Leave the progress colors alone: a track dark enough to pass on white (#6F97A8, 3.15:1) would cut the filled vs unfilled difference to about 1.8:1.

### Dark mode (only Home is drawn)

| Pair | Ratio | Needed | Result | Where used |
| --- | --- | --- | --- | --- |
| #F4F8F9 on #0E2029 | 15.62 | 4.5 | Pass | All text, icon, jar outlines |
| #0E2029 on #F8F2C8 | 14.73 | 4.5 | Pass | Primary button text |
| #F8F2C8 on #0E2029 | 14.73 | 3 | Pass | Button shape, Savings fill |
| #7CC4DE on #0E2029 | 8.60 | 3 | Pass | Bills fill |
| #2CC3CC on #0E2029 | 7.78 | 3 | Pass | Spending fill |
| #006E93 on #0E2029 | 2.90 | 3 or 4.5 | **Would fail if reused** | Not drawn yet (A15) |
| #008F97 on #0E2029 | 4.28 | 3 or 4.5 | Shapes only; fails as text | Not drawn yet |

## Recommended fixes

"In scope" means the feature is in this week's build. Node numbers are the Figma IDs of the screens.

### Blockers

**A1. Home can't fit at large text.** WCAG 1.4.4 and the project's text-scaling rule. All home versions (3:149, 3:183, 10:103, 10:140, 10:219, 10:270, 10:402, 17:240). In scope.

- **What's wrong:** the brief says "no scrolling", but the numbers don't fit at 200% text. Home has 196pt free and text growth needs about 228pt, before the button or the 56pt Confirmation. "$245" grows to 372 wide in a 327 space, and "Spending" stops fitting its 101-wide bucket at about 1.42x.
- **Fix:** change the brief to "no scrolling at default text size". Put home in a scroll view. Above about 1.3x text, stack the buckets as full-width rows. Cap only the 76pt number at about 1.3x with `maxFontSizeMultiplier`. Draw one 200% home screen in Figma.

**A2. The app is locked to portrait.** WCAG 1.3.4. All screens. In scope.

- **What's wrong:** `ADHDbudget-App/app.json` line 6 sets `"orientation": "portrait"`, and no landscape layout is drawn. A budgeting app doesn't need portrait to work. People with a phone mounted on a wheelchair may not be able to rotate it. This looks like the starter template's value.
- **Fix:** set it to `"default"`. It's a one-line change, but landscape then relies on the same scrolling as A1, at only about 375pt tall.

### Serious

**A3. Key components break at large text.** WCAG 1.4.4. In scope, except Suggestion row.

- **What's wrong (at 200%):** Confirmation is fixed at 327x56, but "Removed. Your number is back." grows to 590 wide. Bill countdown row is 72 tall and needs 406 wide in 327. "Move $20 to Savings" grows to 362 wide. Money input (74 tall with 56pt text), Field (70 tall) and Suggestion row (72 tall, three items) have the same problem.
- **Fix:** use minimum heights, not fixed heights. Let labels wrap. Stack the action under the text at large sizes. Fix each once, in the component.

**A4. Undo has no defined target, no time limit and no later way back.** Project 44pt rule, and possibly 2.2.1 depending on timing. Confirmation (10:103, 10:270, 10:334, 17:415) and Rename (17:474). Undo is in scope; Rename is Epic 1.

- **What's wrong:** the word Undo is 41x26 with no frame around it. If only the word is tappable, it misses 44pt but meets WCAG's 24pt minimum. Rename is the same at 65x26. No doc says how long Undo stays. FR-03 says undo follows "every add and delete", but no way to delete an expense is drawn. Once Undo is gone, a typed expense can't be fixed, because Recent spending is Epic 2.
- **Fix:** give Undo its own frame, at least 64x56, and do the same for Rename. Keep Undo until the next action or until the user leaves the screen, not on a short timer. Add a simple way to see and remove recent expenses.

**A5. Fresh start can't be undone and doesn't say what it changes.** Project rule: every destructive action can be undone. 3.3.4 is only weakly met. Nodes 10:387, 10:397, 10:402. In scope.

- **What's wrong:** "One tap tidies older items" doesn't say what happens to them. No Undo follows on the Done or Home screens.
- **Fix:** say exactly what changes. Add a Confirmation with Undo to Fresh start 3 (10:402).

**A6. Home has no drawn route to bills or settings.** Design gap, not a WCAG failure. Nodes 3:149, 10:219. In scope for bills.

- **What's wrong:** "Phone bill: 3 days left" is plain text with no sign it can be tapped. On the $0 home (10:219) that line is missing, so there's no way to the bill list. Epic screens such as Your goal, Home-screen widget, Linked bank and Your categories need a settings area, but no settings screen or entry is drawn.
- **Fix:** make the bill line a full-width row at least 44pt tall with a visible cue, and show it on every home version. Decide where settings lives.

**A7. Setup steps have no Back, and "change it later" has no screen.** Project rule, not a WCAG failure. Nodes 3:61, 3:77, 3:98, 3:125. In scope.

- **What's wrong:** steps 1 to 4 have no Back link, so returning relies on the iPhone edge swipe or Android's back control. The copy promises "You can change it later", but no screen edits the balance, payday or savings.
- **Fix:** add the existing Back link to the steps. Add an edit route for those values.

**A8. The widget toggle's off state is almost invisible.** WCAG 1.4.11 failure. Node 17:557. Epic 2, not this week.

- **What's wrong:** track on white and knob on track are both 1.24:1. This switch controls whether money shows on the phone's home screen. No on state is drawn, and the design doesn't say whether the whole row is tappable.
- **Fix:** when off, use a 2pt #006E93 outline with a #006E93 knob. When on, use a #006E93 track with a white knob (5.75:1). Make the whole row the target, at least 44pt tall. Draw the on state.

**A9. Keyboard-open screens aren't drawn.** Design gap; check in the build. Nodes 3:61, 3:125, 10:81, 10:259, 10:353. In scope.

- **What's wrong:** a phone keyboard takes roughly the bottom 300 to 340pt. Primary buttons sit at y=720 (y=668 on 3:125), so they'd be hidden on the core "add expense" step. That threatens the two-tap goal.
- **Fix:** draw the button sitting directly above the keyboard. Check that the chips on Quick add 1 stay reachable.

### Moderate

**A10. A selected option looks like the main button.** Project rule: color never carries meaning alone. Not called a WCAG failure, because the fill change is strong. Option (3:77, 17:224, 17:280) and Chip (10:81, 17:446, 17:600). Payday and Quick add are in scope.

- **What's wrong:** selected "This Friday" has the same size and color as "Save my payday" below it.
- **Fix:** add a check mark to the selected Option and Chip.

**A11. Nothing shows that buckets can be tapped.** ADHD guideline on just-in-time coaching. Home versions. In scope.

- **What's wrong:** no helper line appears on home. Tapping Bills, and moving money from Savings back to Spending, aren't drawn.
- **Fix:** add the guideline's helper line, "Tap a bucket to move money between them.", for early uses. Define all three bucket taps.

**A12. No focus, pressed or error versions exist for any component.** Design gap. 2.4.7 applies mainly to the web preview and external keyboards. All components. In scope.

- **Fix:** add focus and pressed versions to Button, Option, Chip, Field, Money input and Bucket. A 2pt #006E93 outline passes on white.

**A13. Required screen states are missing.** Project "four states" rule. In scope.

- **What's wrong:** these aren't drawn: loading screens, a failed save, validation on Add a bill (10:353), the brief's "gentle line" for a missing setup answer, moving more than Spending holds (10:259), and the date picker.
- **Fix:** draw the core ones, reusing the Quick add 4 pattern.

**A14. The error screen loses the category chips.** ADHD guideline: nothing lost. Becomes a 3.3.7 risk if a chosen category resets. Node 10:177 compared with 10:81. In scope.

- **What's wrong:** the chips and helper vanish in the error state, and the field itself doesn't change.
- **Fix:** keep the chips and the selection. Thicken the field line and put the error directly beneath it.

**A15. Dark mode is drawn for 1 of 44 screens.** Can't be judged as a failure yet. In scope, since the brief puts dark mode in the MVP.

- **What's wrong:** only Home has dark colors. Reusing #006E93 on dark gives 2.90:1, which fails. Confirmation, selected states, progress, fields and the check mark have no dark colors.
- **Fix:** define dark colors for every component before building. Text on the cream Confirmation must be #0E2029 (14.73:1), not #F4F8F9 (1.06:1). Review the cream bar sitting directly above the cream button.

**A16. The lock screen has one path only.** Mobile accessibility skill; 3.3.8 and 2.2.1 as judgment calls. Node 10:476. In scope, as a stand-in this week.

- **What's wrong:** no passcode fallback or failed-unlock state is drawn. The 5-minute limit has no warning or setting. Nothing is lost, so this isn't called a failure, but a strict reading of 2.2.1 wants a way to extend it.
- **Fix:** draw the fallback and failed states. Consider a lock-time setting.

**A17. The app-switcher blur doesn't fully hide the number.** Project privacy rule, not WCAG. Node 10:442. In scope.

- **What's wrong:** "$245" is still readable under the blur, because the digits are so large.
- **Fix:** use a solid cover with the lock icon instead of a blur.

**A18. The Savings level barely shows and doesn't react.** ADHD guideline, not WCAG. Nodes 3:149, 10:270. In scope.

- **What's wrong:** the level is only 5pt tall and looks empty. On Buckets 2, Savings rises to $70 but the level stays at 5, so the fill doesn't confirm the move.
- **Fix:** update the mockup and set a visible minimum height. Consider a stronger fill such as #3F7D58 (4.90:1 on white).

### Minor

- **A19. Two screens have no button.** Nodes 3:144, 10:397. In scope. They must advance by themselves, which can cut off screen reader users. Announce the message and allow a tap to continue.
- **A20. Uneven button spacing in setup.** Nodes 3:98, 3:125. In scope. Save and Skip are 4pt apart here but 28pt apart on other screens, and the main button jumps from y=720 to y=668. Use one layout on every step.
- **A21. Crowded suggestion rows.** Nodes 17:378, 17:415. Epic 1. Add and Remove are opposite actions only 6pt apart, and three filled Adds compete with Done. Widen the gap to 8pt or more and make Add outlined.
- **A22. Vague label.** Nodes 17:378, 17:415. Epic 1. "Done" doesn't say what it does. Use something like "Save my bills".
- **A23. "Tap the ?" doesn't match the control's name.** Node 10:219. In scope. Screen reader users would hear "How it was worked out". Include "help" in the label, or reword the helper line.
- **A24. File clean-up before handoff.** Nodes 10:140 (in scope), 17:620, 17:574, 17:600. Confirmation uses a blank space as hidden Undo text, so make a no-Undo version. Category buttons on the Import screens are layers named "Mark paid", so rename them.
- **A25. Import failure has no next step.** Node 17:620. Epic 2. There's no "Try again", and two lines of text sit in a 56pt bar with almost no padding.

## Check during the build

A static design can't show these. They are not failures.

- **Screen reader order (1.3.1, 2.4.3):** the number should read as one sentence, "You can safely spend 245 dollars until Friday", then "?".
- **Roles, names and states (4.1.2):** options and chips report as selected. Repeated buttons need context, such as "Mark Phone bill paid". Buckets read as "Spending bucket, 245 dollars". "- $900" doesn't read as "dash". Decorative jars, the progress bar and the lock icon are hidden.
- **Headings (2.4.6):** each title uses the header role, including home.
- **Announcements (4.1.3):** "$12 added to Food", errors, the lock and auto-advancing screens are all spoken.
- **Focus (2.4.3, 2.4.7, 2.4.11):** focus has somewhere to go when Mark paid removes its row. The lock screen moves focus to Unlock. The keyboard and Confirmation don't cover focused items. The web preview shows a focus ring.
- **Consistency (3.2.2, 3.2.3, 3.2.4):** selecting a chip doesn't jump to another screen. "Back" and "Home" each mean one thing.
- **Reduced motion (2.3.3, project rule):** check bucket changes, the setup-to-home move and any animation.
- **Whole-frame targets:** Back and "?" pass only if the full frame is tappable. Use `hitSlop` or the frame.
- **Date picker:** works with screen readers and without dragging a wheel (2.5.7).
- **Privacy:** blurred or locked content is also hidden from screen readers.
- **Narrow phones and web (1.4.10):** check at 320 wide. The buckets should shrink to about 83pt each.
- **Largest system sizes:** iOS goes well beyond 200%, so test the top setting.

## Linter recommendations

- **`eslint-plugin-react-native-a11y`:** catches missing roles, labels and states on native components. It's a community plugin, so check it works with your Expo version first.
- **React Native Testing Library:** find elements by role and name, as the `testing-react-native` skill says. A failed query usually means a missing label. This is the best fit for an `npm run test:a11y` script, which doesn't exist in `package.json` yet.
- **Contrast test on theme colors:** once `src/theme.ts` exists, add a small test that computes every color pair in light and dark. It catches the A15 problem automatically.
- **Custom lint rules:** ban `allowFontScaling={false}`, flag fixed `height` on text containers, and flag red in money styles.
- **`axe-core`:** covers only the Expo web build. It can't see native iOS or Android screens.
- **Manual device checks:** VoiceOver and TalkBack on the core flow, Xcode Accessibility Inspector (needs a Mac), Google's Accessibility Scanner on Android, and largest text with reduce motion on.

Prepared by Robert Wills · © 2026
