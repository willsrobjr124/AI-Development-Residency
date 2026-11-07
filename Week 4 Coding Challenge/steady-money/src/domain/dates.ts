/**
 * Bills and paydays fall on calendar days, so dates are plain 'YYYY-MM-DD' strings.
 * All math runs in UTC so clock changes can't shift "days left".
 */

const DAY_MS = 86_400_000;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LONG_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December',
];

export const NO_PAYDAY_DAYS = 30;

function toUtc(date: string): number {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function fromUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** The only place the app asks what day it is, so tests can set the date. */
export function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

export function addDays(date: string, days: number): string {
  return fromUtc(toUtc(date) + days * DAY_MS);
}

export function addMonths(date: string, months: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year, month - 1 + months + 1, 0)).getUTCDate();
  return fromUtc(Date.UTC(year, month - 1 + months, Math.min(day, lastDay)));
}

export function weekdayName(date: string): string {
  return WEEKDAYS[new Date(toUtc(date)).getUTCDay()];
}

export function shortDate(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}

export function untilLabel(nextPayday: string | null, currentDay: string): string {
  const end = nextPayday ?? addDays(currentDay, NO_PAYDAY_DAYS);
  const days = daysBetween(currentDay, end);
  if (days === 0) return 'until today';
  if (days > 0 && days <= 6) return `until ${weekdayName(end)}`;
  return `until ${shortDate(end)}`;
}

export function longDate(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  return `${weekdayName(date)}, ${LONG_MONTHS[month - 1]} ${day}`;
}

export function monthTitle(year: number, month: number): string {
  return `${LONG_MONTHS[month - 1]} ${year}`;
}

/** Weeks of a month for a calendar, Sunday first, with null for blank cells. */
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = Array(first).fill(null);
  for (let day = 1; day <= days; day += 1) {
    cells.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return weeks;
}
