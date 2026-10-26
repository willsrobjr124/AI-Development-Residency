---
name: mobile-accessibility
description: How to make React Native screens accessible - roles and labels, font scaling, reduced motion, touch targets, contrast and screen reader testing. Use when building or reviewing any component or screen, alongside adhd-ux-guidelines.
---

# Mobile accessibility

Accessibility and ADHD-friendly design overlap: clear labels, calm motion and big targets help everyone. Apply this with the `adhd-ux-guidelines` checklist.

## Every interactive element

- Use `Pressable` (or a component built on it) with `accessibilityRole` ("button", "link", "switch", "header") and an `accessibilityLabel` that says what it does: "Add expense", not "Plus".
- Add `accessibilityHint` only when the result is not obvious ("Clears old transactions and restarts your week").
- Report state: `accessibilityState={{ selected, disabled, checked }}`.
- Touch targets at least 44x44pt. Use `hitSlop` for small icons.
- Group related text so a screen reader reads it as one item: the safe-to-spend card reads "Safe to spend, 120 dollars".

## Money for screen readers

Format amounts for speech in the label: visible text "$120.00", `accessibilityLabel="Safe to spend: 120 dollars"`. Never read a negative number aloud; safe-to-spend floors at $0.

## Text

- Respect the system font size. Do not set `allowFontScaling={false}` on body text. Use `maxFontSizeMultiplier` (about 1.5 to 2) only where layout would break, and test at the largest size.
- Body text at least 16pt (from `adhd-ux-guidelines`), contrast at least WCAG AA (4.5:1 for body text).
- Never use color alone for meaning: amber "running low" also has a word or icon.

## Motion and sound

- Read the system setting: `AccessibilityInfo.isReduceMotionEnabled()` or Reanimated's `useReducedMotion()`, combined with the in-app "reduce motion" toggle.
- When reduced motion is on, buckets update without animation and Lottie celebrations are replaced by a static icon and message (render the first frame or skip the animation; do not just slow it down).
- Never autoplay sound; haptics are optional and follow the user setting.

## Focus and announcements

- After an action, announce the result when it is not visible: `AccessibilityInfo.announceForAccessibility('Expense added')`.
- Modals and sheets trap focus and return it to the trigger when closed.
- Headings use `accessibilityRole="header"` so screen reader users can jump between sections.

## Lock screen and privacy blur

- The lock screen's unlock button is labelled "Unlock with Face ID" (or the method in use) and offers the device passcode as a fallback, so users who cannot use biometrics are never stuck.
- When the 5-minute lock appears, announce it ("Locked to keep your money private") and move focus to the unlock button.
- Masked values ("Tap to view", hidden amounts) have a label that says they are hidden, not a string of dots read aloud.

## Test before done

- Turn on VoiceOver (iOS) or TalkBack (Android) and complete the core flow: setup, see safe-to-spend, quick add, undo.
- Set the largest font size and check nothing is cut off.
- Turn on reduce motion and check animations stop.
- In tests, find elements by role and label (see `testing-react-native`); a failed role query usually means a missing label.
