---
name: reminders-and-notifications
description: How to build bill reminders, the weekly check-in nudge and snooze with expo-notifications, in a calm ADHD-friendly way. Use when adding, changing or testing any notification, reminder, snooze, quiet hours or notification permission prompt.
---

# Reminders and notifications

Reminders are where ADHD apps most often become nagging. Every reminder is chosen, timed and mutable by the user (`adhd-ux-guidelines` rule 8).

## MVP reminders

| Reminder | When | Default |
|---|---|---|
| Bill due | N days before a bill's due date, at a user-chosen time | 2 days before, 9:00 |
| Weekly check-in | User-chosen day and time | Off until the user picks a time |
| Purchase pause follow-up | 24 hours after an item goes on the wishlist | On only if the user turns on the pause |

No other notifications in the MVP: no streak warnings, no "we miss you", no marketing.

## Implementation (expo-notifications, local only for the MVP)

- Schedule local notifications with `Notifications.scheduleNotificationAsync` using a date trigger. Store the returned id with the bill so it can be cancelled or rescheduled when the bill is paid, edited or deleted.
- On Android, create a channel (`setNotificationChannelAsync`) with default importance, no sound by default.
- Snooze: register a notification category with actions ("Snooze 1 hour", "Snooze until tomorrow", "Mark paid") via `setNotificationCategoryAsync`, and handle the response listener to reschedule or mark paid.
- Reschedule everything from the database on app start, since scheduled notifications can be lost after reinstall or OS cleanup.

## Permission

- Never ask on first launch. Ask the first time the user turns on a reminder, after a one-line explanation of what they will get.
- If denied, the app works fully; show reminders in-app (bill countdown) and a gentle settings link.

## Copy

- Neutral and specific: "Phone bill due in 2 days ($45)". Not "Don't forget!!" or "You're about to be late".
- The check-in nudge: "Your 60-second check-in is ready when you are."
- Respect quiet hours (default 21:00 to 8:00): move reminders to the next allowed time.

## Testing

- Mock `expo-notifications` in unit tests and assert what was scheduled (title, trigger date, id stored).
- Test on a real device for delivery and actions; simulators handle notifications inconsistently.
