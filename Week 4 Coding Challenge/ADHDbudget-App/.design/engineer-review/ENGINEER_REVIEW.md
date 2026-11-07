# Engineer Review: Features and Motion

**Reviewer:** (@_@) Engineer subagent
**Date:** November 7, 2026
**Reviewed:** all 47 screens in the Figma file [ADHD Budgeting App: Onboarding and Home](https://www.figma.com/design/I7sMJVM9BSOtZDEKiLtx9B), plus the project files, requirements and skills
**Limits:** the engineer read the code and images but did not run the app. All estimates are estimates.

## Bottom line

All seven Must-haves can be built as typed-in features, and none needs a backend. Most of the risk is in unanswered product questions and phone-only behavior, not in the code.

The estimate is 18 to 30 focused sessions including polish, or about 5 to 10 days. A single week is tight, and only works if the blocking decisions are made first. Do not attempt bank linking, transaction import, automatic bill detection or the widget this week.

The largest gap is that the number goes wrong after the first payday. The app has no pay schedule, no paycheck entry and no way to update the balance.

Before building, check which phone you test on. The Expo docs say Expo Go on an iPhone now needs a paid Apple Developer subscription.

**How to read the source tags:**

- **[repo]** checked in the project files or installed packages
- **[docs]** read in the Expo SDK 58 docs
- **[skill]** comes from a project skill
- **[my knowledge]** the engineer's own experience, not checked, so test it

## 1. Technical feasibility

**Installed [repo]:** Expo 58.0.23, React Native 0.88.1, Expo Router 58.0.30, Reanimated 4.7.1, Worklets 0.13.0, Gesture Handler 3.3.0.

**Not installed yet [repo]:**

- Storage and privacy: expo-sqlite, AsyncStorage, expo-local-authentication, expo-screen-capture, expo-crypto
- Interaction and display: expo-haptics, the date picker, the Atkinson font package
- Tooling: Jest and ESLint. The project's rule that lint and tests must pass can't be met until these are set up.

**The template needs replacing [repo].** The root layout shows tabs. The designs have no tabs, so this becomes a plain stack of screens.

### What runs where

| Item | Expo Go | Web preview | Source |
| --- | --- | --- | --- |
| Reanimated | Yes | Yes | Template uses it [repo]; Expo Go inclusion is [my knowledge], proven on first run |
| expo-sqlite | Yes | Yes, with extra setup | [docs] |
| SQLCipher (encryption) | **No** | No | [docs] |
| expo-local-authentication | Yes, but **no Face ID on iPhone** | Not listed | [docs] |
| expo-screen-capture | Yes | Not listed | [docs] |
| Date picker | Yes | **No** | [docs] |
| react-native-keyboard-controller | **No** | Not applicable | [docs] |
| expo-haptics | Not stated, believed yes | Yes (limited) | [docs] and [my knowledge] |
| expo-widgets | **No** | No | [docs] |
| Plaid native SDK | No | Not applicable | [my knowledge] |

### Hard or impossible as drawn

1. **iPhone testing.** The docs say installing Expo Go on an iPhone needs "an active subscription to the Apple Developer Program". You build it with `npx eas-cli@latest go` and install it through TestFlight [docs]. Android still installs from Google Play.
2. **App-switcher cover.** A cover drawn by our code may arrive too late, because the phone may take its snapshot first, most likely on Android [my knowledge].
   - Android has a dependable fix: `preventScreenCaptureAsync` "shows a blank screen in the recent apps preview" [docs]. It also blocks screenshots and recordings, so turn it off for demo images.
   - iOS has `enableAppSwitcherProtectionAsync`, but it is a blur [docs], which A17 rejected. Use our solid cover plus that blur at full strength, then check on a phone.
   - A root-level cover won't sit above native sheets [my knowledge]. Use normal full-screen pages, as the design draws.
   - The web preview can't show any of this.
3. **The lock.** On an iPhone in Expo Go, Unlock uses the passcode, not Face ID [docs]. The web preview needs a plain Unlock stand-in. The Face ID prompt can make the app briefly "inactive", so only a true move to the background should count, or you get a lock loop [my knowledge]. Measure the 5 minutes from saved times, not a running timer [my knowledge].
4. **The keyboard.** The animation skill's keyboard recipe needs a package Expo Go lacks [docs]. Use React Native's `KeyboardAvoidingView` with a `behavior` set [docs]. The drawn layout needs about 504pt above the keyboard, and a small phone has about 407pt (a rough figure), so the screen must scroll there. Set `keyboardShouldPersistTaps="handled"`, or the first tap on a chip only closes the keyboard, which breaks the two-tap goal [my knowledge].
5. **The "twelve" error screen.** A phone's number pad can't type letters, so this exact screen only happens on the web or by pasting. Real errors are an empty field, `0`, `12.3.4` or a huge amount. Keep the pattern and test those.
6. **Cents.** The money rules use cents, but every screen shows whole dollars. At 76pt, "$1,233.50" won't fit in 327pt. Shrink-to-fit is missing on the web [repo]. Turn typed text straight into cents, never through a decimal number.
7. **Large text.** The switch to stacked rows can use `fontScale`, but the web preview always reports 1 [repo], so this needs a phone or a dev-only switch. Put the bottom button inside the scroll area at large sizes and in landscape.
8. **Orientation.** Changing `app.json` to `"default"` is one line [docs]. The docs don't say how Expo Go treats this setting, so test it. Landscape is only about 375pt tall and reuses the A1 scrolling.
9. **Web preview.** `web.output` is `"server"` [repo], which needs deployment to a server [docs]. Change it to `"single"` [docs]. SQLite on the web needs extra setup [docs].
10. **Date picker.** It has no web version [docs], so the web preview needs a plain date input.

## 2. Implementation complexity

One **session** means 1 to 2 focused hours with Claude, including a phone check. Estimates could be off by 50% either way.

**Foundation comes first:** 3 to 5 sessions, High confidence, runs in Expo Go. It covers stack navigation, theme with light and dark colors, font, lint and tests, the storage module and shared components. The main risk is getting SQLite working on the web.

### Features ranked by ease and chance of success

| # | Feature | Effort | Sessions | Confidence | Expo Go? | Depends on | Main risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Safe-to-spend number, "?" breakdown, $0 state | M | 2–3 | High | Yes | Foundation | Math is easy; payday rollover is undefined |
| 2 | Buckets and moving money | S–M | 1–2 | High | Yes | 1 | Move from Savings and "too much" state aren't drawn |
| 3 | Quick add with undo | M | 2–3 | High to Medium | Yes | 1 | Keyboard behavior on real phones |
| 4 | Quick setup, saves your place | M | 2–3 | High to Medium | Yes | Inputs, bill form | Resuming the right step; date picker on web |
| 5 | Bill countdown | M | 2–3 | Medium to High | Yes (date input on web) | 1 | Repeats, overdue bills and the Mark paid decision |
| 6 | Fresh start | S–M | 1–2 | Medium | Yes | 1, 3, 5 | Code is easy; what it actually changes is undefined |
| 7 | Privacy: cover and 5-minute lock | M | 2–3 | Medium | Partly (no Face ID on iPhone, no encryption) | Lock module | Timing can only be proven on real phones |
| 8 | Default categories | S | 0.5–1 | High | Yes | 3 | Rename needs a settings area |
| 9 | Bills without a bank (chips) | S–M | 1 | High | Yes | 5 | The "add amounts" screen isn't drawn |
| 10 | Goal picker | S–M | 1–2 | High | Yes | Settings, 4 | Placement; only one of three goal homes is drawn |
| 11 | Widget | L | 3–6+ | Low | **No** | Dev build, settings | Needs native builds |
| 12 | Bank linking (Plaid) | L | 8–15+ | Low | **No** | Server, Plaid account, dev build | Needs a backend |
| 13 | Transaction import | L | 6–10+ | Low | **No** | 12 | Sync, duplicates, merchant memory |
| 14 | Automatic bill detection | M, once 13 exists | 2–3 | Low now | **No** | 13 | No data to read yet |

| Work | Sessions |
| --- | --- |
| Foundation | 3–5 |
| Seven Must-haves | 12–19 |
| Accessibility, dark mode and states polish | 2–4 |
| First motion set | 1–2 |
| **Total** | **18–30** |

At 3 to 4 sessions a day, that is 5 to 10 days. Phone testing is the part most likely to overrun.

## 3. Key challenges

**The number goes wrong after payday (the biggest one).** Setup asks only for the next payday. There is no pay schedule, no paycheck entry and no screen to edit the balance. Once the date passes, "until Friday" is false and the balance is missing the paycheck. A fortnight of normal use reaches this state, and Fresh start users always will.

**Mark paid changes the number wrongly.** Removing a bill while the typed balance still holds that money raises the number by the bill amount.

**Fresh start does very little as specified.** Nothing in the math uses a "week", so "your week restarts" has no meaning in the data. There is no expense list, so people can't see items move to Other. The number stays the same and is probably out of date.

**Gaps in the screens and rules:**

- **Add a bill has no repeat field.** FR-04 needs repeating bills. Without one, rent disappears after a month and the number overstates.
- **Setup bill rows show no due date,** but the countdown needs one.
- **The "Bills" chip on Quick add can double count.** Logging $45 under Bills while the Phone bill is unpaid takes $45 off twice.
- **The breakdown has no spending line.** After a $12 expense, the drawn lines no longer add up.
- **Below zero, the breakdown stops adding up.** The lines subtract to a negative, but the total shows $0.
- **Overdue bills, "1 day left" and "Due today" aren't drawn.**
- **The 7-day list and the number use different windows.** A bill due in 10 days, before a later payday, counts in the number but isn't listed.
- **Docs still say blur.** The technical requirements, `banking-security` skill and `CLAUDE.md` all say blur, but the design now uses a solid cover.
- **Locking versus keeping your place.** SEC-04 wants money cleared from memory and also a return to the same screen. Saved drafts plus clearing stores behind a cover handles most of it, which is acceptable for a stand-in. Also hide the screen behind the lock from screen readers.
- **Testing a 7-day gap.** Code must get "today" from one replaceable function, or Fresh start and the countdown can't be tested without waiting.

**Storage stand-in.** Use plain expo-sqlite behind the storage module, because the same SQL carries over to SQLCipher later. Never describe this as encrypted. Give web setup a one-session limit. If it fails, use a simple web-only preview store behind the same module.

## 4. Performance and scale

- **Scale is not a concern.** One person, a few bills and up to about 1,000 expenses on the phone is small.
- **The screens are light.** Bills can be a plain list. A recent expenses list can use `FlatList` with a limit.
- **Date math.** Use calendar days, not milliseconds. Recalculate when the app returns to the front, in case midnight passed [my knowledge].
- **Double taps.** Create the ID at the tap, ignore repeat IDs and disable the button while saving [skill].
- **Motion.** Expo Go is not a fair test of how animation feels [skill]. Use it to check behavior, not smoothness.
- **Later swap.** Keep all storage and lock calls behind their modules, or moving to a development build becomes a rewrite.

## 5. Recommendations

### Build order

1. **Half a day of checks first:** open the template on your real phone, test the cover on that phone, try SQLite on the web, and change `web.output`.
2. Foundation, including dark colors, lint and tests.
3. Money math with tests first, using made-up sample data.
4. Home and breakdown, including scrolling and the large-text layout.
5. Quick add with undo, then the recent expenses list.
6. Buckets.
7. Bill countdown.
8. Quick setup, which reuses the money input and bill form.
9. Privacy.
10. Fresh start and the payday update.
11. Missing states, first motion set, and screen reader and large-text checks on a phone.

**If time runs short:** cut motion beyond the first three items, then category rename and goal picker. Do not cut undo, the payday update or the Mark paid fix.

**Do not attempt this week:**

- **Bank linking:** needs a backend, a Plaid account and a development build, and `CLAUDE.md` scopes it out.
- **Import and automatic bill detection:** both depend on bank linking.
- **Widget:** not available in Expo Go, and needs native builds.
- **SQLCipher and real Face ID:** need a development build.

**Stretch only if ahead:** default category rename, bills without a bank, goal picker.

### Design decisions: what blocks what

| Decision | Blocks | Engineer's default |
| --- | --- | --- |
| Does Mark paid also leave the balance? | Mark paid, the math | **Yes.** Record a payment linked to the bill, and Undo removes it. The number stays at $245. Update the `safe-to-spend-math` skill |
| "Until payday" | The home sentence, and correct numbers after payday | **Most urgent.** After payday passes, show one calm prompt to update balance and next payday, using the Fresh start screens. Use the weekday if within 6 days, "today" on the day, otherwise a date such as "Nov 21". No pay schedule this week |
| "Is this still your balance?" | Finishing Fresh start | **Yes.** Pre-filled, one tap to confirm, reusing the money input. Undo restores the old balance. Drop "week restarts" from the copy, or define it |
| How long Undo stays | The Confirmation component | **No timer.** It stays until the next money action or until the person leaves the screen |
| Recent expenses list | Removing an expense (FR-03) | **Build a plain one (about 1 session).** Reuse the Epic 2 layout. Add a "Spent since then" line to the breakdown as the way in, which also fixes the breakdown math |
| Where settings lives | Edit routes (A7) this week; goal, categories, widget and unlink later | **One 44pt gear at the top of Home.** Four rows: balance, payday, savings, reduce motion |
| Goal picker placement | Goal picker only | **Before Step 1, unnumbered, skippable.** Not needed this week |

**Smaller defaults:**

- Add an "Every month" switch to Add a bill, on by default.
- Show cents on the home number only when they aren't zero, at a smaller size, with whole dollars in the buckets.
- Tapping Bills opens the bill list.
- Tapping Savings opens the same move screen in reverse.
- Keep the Bills chip and add one helper line pointing to Mark paid.

### Remaining accessibility items

| Item | Where to solve it | Why |
| --- | --- | --- |
| A15 dark mode | **Design first, as colors only** | Set dark colors per component before the theme is built. Do not draw 47 dark screens. Add a contrast test in code. Decide on the cream bar above the cream button |
| A13 missing states | **Design first** for failed save, bill validation, moving too much, missing setup answer | Mostly copy, reusing the Quick add error pattern. Loading can be done in code |
| A16 lock fallback | **Design first, one small screen** | Needs a failed-unlock state and a phone with no passcode set. The system handles the passcode fallback by default [docs] |
| A12 focus and pressed | **Quick design decision, then code** | One color rule per component, built once in shared components |
| A2 orientation | **Code** | One line plus the A1 scrolling |

### Motion

**Two rules shape this section:**

- **Reduced motion needs a small custom hook.** Reanimated's `useReducedMotion()` is read at startup [repo], so it can miss a change while the app is open, and it doesn't know about an in-app toggle.
- **Reduced motion means instant.** `expo-animation` allows fades, but the ADHD and accessibility rules ask for a static result, and those rules win.

Gesture Handler isn't needed, because nothing in the designs uses dragging or swiping.

**Ranked motion ideas.** "Ease-out" means `Easing.bezier(0.23, 1, 0.32, 1)`.

| # | Where | What moves and what it says | Tool | Duration, easing | Reduced motion | Effort | Value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Confirmation bar | Fades in and rises 8pt: "that saved, and you can undo it". Space is reserved, so nothing jumps | Reanimated entering and exiting | 200ms in, 150ms out, ease-out | Appears instantly | S | High |
| 2 | Buttons, Options, Chips, Buckets, rows | Button scales to 0.97 and rows highlight: "I felt that tap". Also covers A12 | Reanimated CSS transition | 120ms, ease-out | Color change only | S | High |
| 3 | Mark paid row | Row fades and rows below close the gap: "this one is gone, nothing else changed". Undo brings it back | `exiting` plus `LinearTransition` | 150ms fade, 200ms move | Instant | S | High |
| 4 | Bucket fill | The level moves to its new height: "money moved" | Reanimated CSS transition | 250ms, ease-in-out | Jumps | S–M | Medium to High |
| 5 | Setup to Home | "Show my number" fades to Home: "you've arrived" | Native stack `animation: 'fade'` | Platform default | `'none'` | S | Medium |
| 6 | Number and bucket amounts | New value shows at once, then settles from 70% to 100% opacity: "this changed" | CSS transition | 150ms, ease-out | None | S | Medium |
| 7 | Option and Chip selected | Fill color changes and check fades in: "selected" | CSS transition | 150ms, ease-out | Instant | S | Medium |
| 8 | Privacy cover and lock | Appears **instantly**, then fades out on return. Required by SEC-05 | Opacity | 0ms in, 150ms out | Instant both ways | S | Required |
| 9 | Quick add open and close | Slides up: "a short task on top of Home" | Native stack option | Platform default | `'none'` | S | Medium |
| 10 | Check circle (ready, all set) | Scales 0.96 to 1 and fades in, once: "done" | Reanimated | 200ms, ease-out | Static | S | Medium |
| 11 | Setup progress bar | Next segment fills: "one step further" | CSS transition | 200ms, ease-out | Instant | S–M | Low to Medium |
| 12 | Error line | Message fades in under the thicker line | CSS transition | 150ms, ease-out | Instant | S | Low |
| 13 | Skeletons | Slow pulse, shown only after about 300ms | CSS animation | About 1s | Still | S | Low |
| 14 | Haptics (not motion) | One light tap when money is saved. Never the only feedback | expo-haptics | Same frame | Follows setting | S | Low to Medium |

**A limit on the bucket fill.** $12 moves the level about 1.5pt in a 150pt jar, and $20 about 2.4pt, so everyday amounts are barely visible. The number and the Confirmation bar do the real work. Don't exaggerate the fill, because it would stop being true.

**A timing trap.** If the fill animates when the save happens, it finishes behind the Quick add screen and nobody sees it. Show the number right away, and start the fill when Home is back in view.

**First set for the MVP (about 1 to 2 sessions):**

1. Confirmation bar
2. Press and selected feedback (including #7)
3. Mark paid row
4. Bucket fill
5. Setup to Home fade (almost free)

Item 8 comes with Privacy, and item 9 is a one-line setting.

**One rule to confirm.** The ADHD guidelines and technical requirements name Lottie for success moments, but `expo-animation` says Lottie is for illustration, never UI state. The engineer recommends skipping it, because a simple fade delivers the same calm result. That changes a written rule, so it needs your approval.

### Motion ideas to avoid

| Idea | Why not |
| --- | --- |
| Counting or rolling numbers | Delays the true number, and shows false values along the way |
| Bounce or overshoot | Banned by project rules |
| Confetti, stars, celebration | Overstimulating, and close to reward mechanics |
| Celebrating the last setup step or a paid bill | Implies good and bad money behavior |
| Water sloshing or waves in the jars | A looping distraction on the most-viewed screen |
| Pulsing Add expense button or "?" | A looping attention-grabber, and a form of nagging |
| Shaking the field on error | Reads as "wrong", which is shame in motion |
| Red or flashing states | Banned for money |
| A shrinking Undo countdown bar | Creates time pressure, and Undo has no timer |
| Home parts appearing one by one on every open | Delays the number on the most frequent screen |
| Swipe to mark paid or delete | Hidden, and needs a gesture |
| Fading the privacy cover in, or animating blur | A fade can leak money on screen, and animated blur is banned [skill] |
| Custom keyboard animation | Should follow the system [skill] |
| Bucket-to-screen shared transitions | High effort and fragile for little meaning |
| A haptic on every keystroke | Becomes noise [skill] |

**Maybe later:** a one-time jar fill on Welcome (borderline against "no autoplay"), and staggered breakdown lines (they slow down reading the number).

## 6. Open questions

1. **Which phone do you test on?** If it's an iPhone, do you have a paid Apple Developer membership? If not, you need an Android phone or are limited to the web preview, which can't test privacy, large text or the keyboard.
2. **What is the deadline, and how many sessions a day can you do?** This decides how much of the cut list applies.
3. **Do you accept the Mark paid and payday defaults?** These two need answers before any math is written.
4. **What should "your week restarts" mean?** The engineer suggests removing it unless it has a real effect.
5. **Is a small gear on Home acceptable?** The brief says anything that doesn't help the current task comes off the screen, but "change it later" needs a route.
6. **Is it OK to skip Lottie?**
7. **Should screenshots be blocked on Android?** It is the dependable privacy fix, but it stops people screenshotting their own numbers too.
8. **Is the fix list ready to build on?** The a11y-reviewer has not re-checked the Figma fixes yet.

**Still to confirm on a phone:** that Expo Go opens this SDK 58 project (expo.dev lists SDK 58 as latest), how Expo Go treats the orientation setting, and whether the iOS blur at full strength hides "$245". The `@expo/ui` date picker is also unverified.

Prepared by Robert Wills · © 2026
