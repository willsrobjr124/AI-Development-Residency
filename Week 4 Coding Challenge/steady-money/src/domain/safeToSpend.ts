import { addDays, daysBetween, NO_PAYDAY_DAYS, shortDate } from './dates';

export type Bill = {
  id: string;
  name: string;
  amountCents: number;
  dueDate: string;
};

export type MoneyInputs = {
  /** The balance the person typed. */
  balanceCents: number;
  /** Expenses logged since that balance was typed. */
  spentCents: number;
  /** Bills marked paid since that balance was typed. They have left the account. */
  paidBillsCents: number;
  unpaidBills: Bill[];
  savingsCents: number;
  nextPayday: string | null;
  today: string;
};

export type BreakdownLine = { label: string; amountCents: number };

export type MoneySummary = {
  availableCents: number;
  periodEnd: string;
  billsInPeriod: Bill[];
  billsCents: number;
  savingsCents: number;
  /** Never below zero. */
  safeCents: number;
  /** True when bills and savings need more than the balance holds. */
  isShort: boolean;
  buckets: { spendingCents: number; billsCents: number; savingsCents: number };
  /** Signed lines. They add up to safeCents unless isShort is true. */
  breakdown: BreakdownLine[];
};

export function paydayHasPassed(nextPayday: string | null, today: string): boolean {
  return nextPayday !== null && daysBetween(today, nextPayday) < 0;
}

export function calculate(inputs: MoneyInputs): MoneySummary {
  const { balanceCents, spentCents, paidBillsCents, unpaidBills, savingsCents, nextPayday, today } =
    inputs;

  const periodEnd =
    nextPayday === null || paydayHasPassed(nextPayday, today)
      ? addDays(today, NO_PAYDAY_DAYS)
      : nextPayday;

  const billsInPeriod = unpaidBills
    .filter((bill) => bill.dueDate <= periodEnd)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const billsCents = billsInPeriod.reduce((sum, bill) => sum + bill.amountCents, 0);

  const availableCents = balanceCents - spentCents - paidBillsCents;
  const rawCents = availableCents - billsCents - savingsCents;
  const safeCents = Math.max(rawCents, 0);

  const lines: BreakdownLine[] = [
    { label: 'Your balance', amountCents: balanceCents },
    { label: 'Spent since then', amountCents: -spentCents },
    { label: 'Bills paid', amountCents: -paidBillsCents },
    ...billsInPeriod.map((bill) => ({ label: bill.name, amountCents: -bill.amountCents })),
    { label: 'Savings', amountCents: -savingsCents },
  ];

  return {
    availableCents,
    periodEnd,
    billsInPeriod,
    billsCents,
    savingsCents,
    safeCents,
    isShort: rawCents < 0,
    buckets: { spendingCents: safeCents, billsCents, savingsCents },
    breakdown: lines.filter((line, index) => index === 0 || line.amountCents !== 0),
  };
}

export type CountdownBill = Bill & { countdown: string };

const COUNTDOWN_DAYS = 7;

function countdownLabel(dueDate: string, today: string): string {
  const days = daysBetween(today, dueDate);
  if (days < 0) return `Due ${shortDate(dueDate)}`;
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export function billCountdown(unpaidBills: Bill[], today: string): CountdownBill[] {
  return unpaidBills
    .filter((bill) => daysBetween(today, bill.dueDate) <= COUNTDOWN_DAYS)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((bill) => ({ ...bill, countdown: countdownLabel(bill.dueDate, today) }));
}

export function nextBillLine(unpaidBills: Bill[], today: string): string {
  const [next] = [...unpaidBills].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (!next) return 'No bills coming up';
  return `${next.name} bill: ${countdownLabel(next.dueDate, today)}`;
}
