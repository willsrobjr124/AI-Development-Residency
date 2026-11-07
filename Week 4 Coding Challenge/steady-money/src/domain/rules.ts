import { addDays, daysBetween, weekdayName } from './dates';

export const FRESH_START_AFTER_DAYS = 7;
export const LOCK_AFTER_MS = 5 * 60 * 1000;

export type MoveTarget = 'savings' | 'spending';

export function moveLimitCents(
  to: MoveTarget,
  buckets: { spendingCents: number; savingsCents: number },
): number {
  return to === 'savings' ? buckets.spendingCents : buckets.savingsCents;
}

export function shouldOfferFreshStart(lastOpened: string | null, today: string): boolean {
  return lastOpened !== null && daysBetween(lastOpened, today) >= FRESH_START_AFTER_DAYS;
}

/** Compares saved times, because timers pause while the app is in the background. */
export function shouldLock(lastActiveMs: number, nowMs: number): boolean {
  return nowMs - lastActiveMs >= LOCK_AFTER_MS;
}

export function nextFridays(today: string): { first: string; second: string } {
  let first = addDays(today, 1);
  while (weekdayName(first) !== 'Friday') first = addDays(first, 1);
  return { first, second: addDays(first, 7) };
}
