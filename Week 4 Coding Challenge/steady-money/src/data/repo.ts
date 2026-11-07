import { addMonths } from '@/domain/dates';
import type { Bill, MoneyInputs } from '@/domain/safeToSpend';

import type { Db } from './schema';

/**
 * The only code that runs SQL. Every id is made at the tap, so a double tap or
 * a retry can't save the same thing twice.
 */

const SETTING = {
  balanceCents: 'balance_cents',
  balanceSetAt: 'balance_set_at',
  nextPayday: 'next_payday',
  setupStep: 'setup_step',
} as const;

const now = () => new Date().toISOString();

export async function getSetting(db: Db, key: string): Promise<string | null> {
  const found = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [key],
  );
  return found?.value ?? null;
}

export async function setSetting(db: Db, key: string, value: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value],
  );
}

async function writeBalance(db: Db, cents: number, setAt: string): Promise<void> {
  await setSetting(db, SETTING.balanceCents, String(cents));
  await setSetting(db, SETTING.balanceSetAt, setAt);
}

export async function setBalance(db: Db, cents: number): Promise<void> {
  await db.withTransactionAsync(() => writeBalance(db, cents, now()));
}

export type FreshStartUndo = {
  balanceCents: number;
  balanceSetAt: string;
  expenseIds: string[];
};

/** Items with no category move to Other, and the balance becomes the confirmed one. */
export async function freshStart(db: Db, balanceCents: number): Promise<FreshStartUndo> {
  let undo: FreshStartUndo | null = null;
  await db.withTransactionAsync(async () => {
    const expenses = await db.getAllAsync<{ id: string }>(
      'SELECT id FROM expenses WHERE category IS NULL AND deleted_at IS NULL',
    );
    undo = {
      balanceCents: Number((await getSetting(db, SETTING.balanceCents)) ?? 0),
      balanceSetAt: (await getSetting(db, SETTING.balanceSetAt)) ?? now(),
      expenseIds: expenses.map((expense) => expense.id),
    };
    const time = now();
    await db.runAsync(
      `UPDATE expenses SET category = 'Other', updated_at = ?
       WHERE category IS NULL AND deleted_at IS NULL`,
      [time],
    );
    await writeBalance(db, balanceCents, time);
  });
  if (!undo) throw new Error('Fresh start did not finish.');
  return undo;
}

export async function undoFreshStart(db: Db, undo: FreshStartUndo): Promise<void> {
  await db.withTransactionAsync(async () => {
    const time = now();
    for (const id of undo.expenseIds) {
      await db.runAsync('UPDATE expenses SET category = NULL, updated_at = ? WHERE id = ?', [
        time,
        id,
      ]);
    }
    await writeBalance(db, undo.balanceCents, undo.balanceSetAt);
  });
}

export async function setNextPayday(db: Db, date: string): Promise<void> {
  await setSetting(db, SETTING.nextPayday, date);
}

export async function getSetupStep(db: Db): Promise<string | null> {
  return getSetting(db, SETTING.setupStep);
}

export async function setSetupStep(db: Db, step: string): Promise<void> {
  await setSetting(db, SETTING.setupStep, step);
}

export async function addExpense(
  db: Db,
  expense: { id: string; amountCents: number; category: string | null },
): Promise<void> {
  const time = now();
  await db.runAsync(
    `INSERT INTO expenses (id, amount_cents, category, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
    [expense.id, expense.amountCents, expense.category, time, time],
  );
}

export async function removeExpense(db: Db, id: string): Promise<void> {
  const time = now();
  await db.runAsync('UPDATE expenses SET deleted_at = ?, updated_at = ? WHERE id = ?', [
    time,
    time,
    id,
  ]);
}

export async function restoreExpense(db: Db, id: string): Promise<void> {
  await db.runAsync('UPDATE expenses SET deleted_at = NULL, updated_at = ? WHERE id = ?', [
    now(),
    id,
  ]);
}

export type RecentExpense = {
  id: string;
  amountCents: number;
  category: string | null;
  createdAt: string;
};

export async function listRecentExpenses(db: Db, limit = 50): Promise<RecentExpense[]> {
  return db.getAllAsync<RecentExpense>(
    `SELECT id, amount_cents AS amountCents, category, created_at AS createdAt
     FROM expenses WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ?`,
    [limit],
  );
}

/** A positive amount moves money into Savings. A negative amount moves it back. */
export async function moveSavings(db: Db, move: { id: string; amountCents: number }): Promise<void> {
  const time = now();
  await db.runAsync(
    `INSERT INTO savings_moves (id, amount_cents, created_at, updated_at)
     VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
    [move.id, move.amountCents, time, time],
  );
}

export async function undoSavingsMove(db: Db, id: string): Promise<void> {
  const time = now();
  await db.runAsync('UPDATE savings_moves SET deleted_at = ?, updated_at = ? WHERE id = ?', [
    time,
    time,
    id,
  ]);
}

export async function addBill(
  db: Db,
  bill: Bill & { repeatsMonthly: boolean },
): Promise<void> {
  const time = now();
  await db.runAsync(
    `INSERT INTO bills (id, name, amount_cents, due_date, repeats_monthly, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
    [bill.id, bill.name, bill.amountCents, bill.dueDate, bill.repeatsMonthly ? 1 : 0, time, time],
  );
}

export async function removeBill(db: Db, id: string): Promise<void> {
  const time = now();
  await db.runAsync('UPDATE bills SET deleted_at = ?, updated_at = ? WHERE id = ?', [time, time, id]);
}

type BillRow = { amountCents: number; dueDate: string; repeatsMonthly: number };

/**
 * Marking a bill paid means the money has left the account, so the number stays
 * the same. A repeating bill moves to its next date. Both happen together or not at all.
 */
export async function markBillPaid(
  db: Db,
  payment: { id: string; billId: string },
): Promise<void> {
  await db.withTransactionAsync(async () => {
    const bill = await db.getFirstAsync<BillRow>(
      `SELECT amount_cents AS amountCents, due_date AS dueDate, repeats_monthly AS repeatsMonthly
       FROM bills WHERE id = ? AND deleted_at IS NULL`,
      [payment.billId],
    );
    if (!bill) throw new Error('That bill could not be found.');

    const time = now();
    const { changes } = await db.runAsync(
      `INSERT INTO bill_payments (id, bill_id, amount_cents, due_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
      [payment.id, payment.billId, bill.amountCents, bill.dueDate, time, time],
    );
    if (changes === 0) return;

    if (bill.repeatsMonthly) {
      await db.runAsync('UPDATE bills SET due_date = ?, updated_at = ? WHERE id = ?', [
        addMonths(bill.dueDate, 1),
        time,
        payment.billId,
      ]);
    } else {
      await db.runAsync('UPDATE bills SET paid_at = ?, updated_at = ? WHERE id = ?', [
        time,
        time,
        payment.billId,
      ]);
    }
  });
}

export async function undoBillPaid(db: Db, paymentId: string): Promise<void> {
  await db.withTransactionAsync(async () => {
    const payment = await db.getFirstAsync<{ billId: string; dueDate: string }>(
      `SELECT bill_id AS billId, due_date AS dueDate FROM bill_payments
       WHERE id = ? AND deleted_at IS NULL`,
      [paymentId],
    );
    if (!payment) return;

    const time = now();
    await db.runAsync('UPDATE bill_payments SET deleted_at = ?, updated_at = ? WHERE id = ?', [
      time,
      time,
      paymentId,
    ]);
    await db.runAsync('UPDATE bills SET due_date = ?, paid_at = NULL, updated_at = ? WHERE id = ?', [
      payment.dueDate,
      time,
      payment.billId,
    ]);
  });
}

export async function listUnpaidBills(db: Db): Promise<Bill[]> {
  return db.getAllAsync<Bill>(
    `SELECT id, name, amount_cents AS amountCents, due_date AS dueDate
     FROM bills WHERE paid_at IS NULL AND deleted_at IS NULL ORDER BY due_date`,
  );
}

async function sumSince(db: Db, table: string, since: string): Promise<number> {
  const found = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount_cents), 0) AS total FROM ${table}
     WHERE deleted_at IS NULL AND created_at >= ?`,
    [since],
  );
  return found?.total ?? 0;
}

/** Everything the money math needs, read from storage. */
export async function loadMoneyInputs(db: Db, today: string): Promise<MoneyInputs> {
  const since = (await getSetting(db, SETTING.balanceSetAt)) ?? '';
  const [balance, nextPayday, spentCents, paidBillsCents, unpaidBills, savings] = await Promise.all([
    getSetting(db, SETTING.balanceCents),
    getSetting(db, SETTING.nextPayday),
    sumSince(db, 'expenses', since),
    sumSince(db, 'bill_payments', since),
    listUnpaidBills(db),
    db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(amount_cents), 0) AS total FROM savings_moves WHERE deleted_at IS NULL',
    ),
  ]);

  return {
    balanceCents: Number(balance ?? 0),
    spentCents,
    paidBillsCents,
    unpaidBills,
    savingsCents: savings?.total ?? 0,
    nextPayday,
    today,
  };
}
