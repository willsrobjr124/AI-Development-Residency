/* eslint-disable @typescript-eslint/no-require-imports */
import { calculate } from '@/domain/safeToSpend';

import {
  addBill,
  addExpense,
  freshStart,
  getSetting,
  listRecentExpenses,
  listUnpaidBills,
  loadMoneyInputs,
  markBillPaid,
  moveSavings,
  removeExpense,
  restoreExpense,
  setBalance,
  setNextPayday,
  setSetting,
  undoBillPaid,
  undoFreshStart,
  undoSavingsMove,
} from './repo';
import { migrate, type Db } from './schema';

const today = '2026-11-09';

/** Runs the app's real SQL on Node's built-in SQLite. */
function testDb(): Db {
  const { DatabaseSync } = require('node:sqlite');
  const sqlite = new DatabaseSync(':memory:');
  return {
    execAsync: async (sql) => sqlite.exec(sql),
    runAsync: async (sql, params = []) => {
      const { changes } = sqlite.prepare(sql).run(...params);
      return { changes: Number(changes) };
    },
    getAllAsync: async (sql, params = []) => sqlite.prepare(sql).all(...params),
    getFirstAsync: async (sql, params = []) => sqlite.prepare(sql).get(...params) ?? null,
    withTransactionAsync: async (task) => {
      sqlite.exec('BEGIN');
      try {
        await task();
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
}

async function setUp(): Promise<Db> {
  const db = testDb();
  await migrate(db);
  await setBalance(db, 124000);
  await setNextPayday(db, '2026-11-13');
  await addBill(db, {
    id: 'rent',
    name: 'Rent',
    amountCents: 90000,
    dueDate: '2026-11-13',
    repeatsMonthly: true,
  });
  await addBill(db, {
    id: 'phone',
    name: 'Phone',
    amountCents: 4500,
    dueDate: '2026-11-12',
    repeatsMonthly: false,
  });
  await moveSavings(db, { id: 'setup-savings', amountCents: 5000 });
  return db;
}

const number = async (db: Db) => calculate(await loadMoneyInputs(db, today)).safeCents;

describe('failed and repeated writes', () => {
  it('runs migrations only once', async () => {
    const db = await setUp();
    await expect(migrate(db)).resolves.toBeUndefined();
  });

  it('saves nothing when a bill can not be found', async () => {
    const db = await setUp();
    await expect(markBillPaid(db, { id: 'p1', billId: 'missing' })).rejects.toThrow();
    expect((await loadMoneyInputs(db, today)).paidBillsCents).toBe(0);
  });

  it('rolls the payment back if moving the bill fails', async () => {
    const db = await setUp();
    const failing: Db = {
      ...db,
      runAsync: async (sql, params) => {
        if (sql.startsWith('UPDATE bills')) throw new Error('disk full');
        return db.runAsync(sql, params);
      },
    };
    await expect(markBillPaid(failing, { id: 'p1', billId: 'rent' })).rejects.toThrow('disk full');
    expect((await loadMoneyInputs(db, today)).paidBillsCents).toBe(0);
    expect(await number(db)).toBe(24500);
  });

  it('counts a double tap on Add expense once', async () => {
    const db = await setUp();
    await addExpense(db, { id: 'e1', amountCents: 1200, category: 'Food' });
    await addExpense(db, { id: 'e1', amountCents: 1200, category: 'Food' });
    expect(await number(db)).toBe(23300);
  });

  it('moves $20 once when the same move arrives twice', async () => {
    const db = await setUp();
    await moveSavings(db, { id: 'm1', amountCents: 2000 });
    await moveSavings(db, { id: 'm1', amountCents: 2000 });
    expect(await number(db)).toBe(22500);
  });

  it('counts a double tap on Mark paid once', async () => {
    const db = await setUp();
    await markBillPaid(db, { id: 'p1', billId: 'rent' });
    await markBillPaid(db, { id: 'p1', billId: 'rent' });
    const inputs = await loadMoneyInputs(db, today);
    expect(inputs.paidBillsCents).toBe(90000);
    expect(inputs.unpaidBills.find((bill) => bill.id === 'rent')?.dueDate).toBe('2026-12-13');
  });
});

describe('the number', () => {
  it('starts at $245 for the design example', async () => {
    expect(await number(await setUp())).toBe(24500);
  });

  it('counts only spending since the balance was typed', async () => {
    const db = await setUp();
    await addExpense(db, { id: 'e1', amountCents: 1200, category: null });
    await new Promise((resolve) => setTimeout(resolve, 5));
    await setBalance(db, 124000);
    expect(await number(db)).toBe(24500);
  });
});

describe('undo', () => {
  it('brings the number back after removing an expense, and can restore it', async () => {
    const db = await setUp();
    await addExpense(db, { id: 'e1', amountCents: 1200, category: 'Food' });
    await removeExpense(db, 'e1');
    expect(await number(db)).toBe(24500);
    expect(await listRecentExpenses(db)).toHaveLength(0);
    await restoreExpense(db, 'e1');
    expect(await number(db)).toBe(23300);
  });

  it('undoes a savings move', async () => {
    const db = await setUp();
    await moveSavings(db, { id: 'm1', amountCents: 2000 });
    await undoSavingsMove(db, 'm1');
    expect(await number(db)).toBe(24500);
  });
});

describe('Mark paid', () => {
  it('keeps the number at $245 and rolls a repeating bill forward', async () => {
    const db = await setUp();
    await markBillPaid(db, { id: 'p1', billId: 'rent' });
    expect(await number(db)).toBe(24500);
    const bills = await listUnpaidBills(db);
    expect(bills.find((bill) => bill.id === 'rent')?.dueDate).toBe('2026-12-13');
  });

  it('removes a one-time bill from the list', async () => {
    const db = await setUp();
    await markBillPaid(db, { id: 'p1', billId: 'phone' });
    expect((await listUnpaidBills(db)).map((bill) => bill.id)).toEqual(['rent']);
    expect(await number(db)).toBe(24500);
  });

  it('puts everything back on Undo', async () => {
    const db = await setUp();
    await markBillPaid(db, { id: 'p1', billId: 'rent' });
    await markBillPaid(db, { id: 'p2', billId: 'phone' });
    await undoBillPaid(db, 'p1');
    await undoBillPaid(db, 'p2');
    const inputs = await loadMoneyInputs(db, today);
    expect(inputs.paidBillsCents).toBe(0);
    expect(inputs.unpaidBills.map((bill) => bill.dueDate)).toEqual(['2026-11-12', '2026-11-13']);
    expect(await number(db)).toBe(24500);
  });
});

describe('fresh start', () => {
  it('leaves everything as it was if it fails partway', async () => {
    const db = await setUp();
    await addExpense(db, { id: 'e1', amountCents: 1200, category: null });
    const failing: Db = {
      ...db,
      runAsync: async (sql, params) => {
        if (sql.startsWith('INSERT INTO settings')) throw new Error('disk full');
        return db.runAsync(sql, params);
      },
    };
    await expect(freshStart(failing, 100000)).rejects.toThrow('disk full');
    expect((await listRecentExpenses(db))[0].category).toBeNull();
    expect(await getSetting(db, 'balance_cents')).toBe('124000');
  });

  it('moves items with no category to Other and uses the confirmed balance', async () => {
    const db = await setUp();
    await addExpense(db, { id: 'e1', amountCents: 1200, category: null });
    await addExpense(db, { id: 'e2', amountCents: 500, category: 'Food' });
    await new Promise((resolve) => setTimeout(resolve, 5));
    await freshStart(db, 122300);
    const categories = (await listRecentExpenses(db)).map((expense) => expense.category).sort();
    expect(categories).toEqual(['Food', 'Other']);
    const inputs = await loadMoneyInputs(db, today);
    expect(inputs.balanceCents).toBe(122300);
    expect(inputs.spentCents).toBe(0);
  });

  it('undoes everything', async () => {
    const db = await setUp();
    await addExpense(db, { id: 'e1', amountCents: 1200, category: null });
    await new Promise((resolve) => setTimeout(resolve, 5));
    const undo = await freshStart(db, 100000);
    await undoFreshStart(db, undo);
    expect((await listRecentExpenses(db))[0].category).toBeNull();
    expect(await number(db)).toBe(23300);
  });
});

describe('clearing the old sample numbers', () => {
  it('keeps real data', async () => {
    const db = await setUp();
    await setSetting(db, 'setup_step', 'done');
    await db.execAsync('PRAGMA user_version = 1');
    await migrate(db);
    expect(await listUnpaidBills(db)).toHaveLength(2);
  });

  it.each([1, 2])('clears sample data from version %i so setup can start', async (version) => {
    const db = await setUp();
    await setSetting(db, 'setup_step', 'sample');
    await db.execAsync(`PRAGMA user_version = ${version}`);
    await migrate(db);
    expect(await listUnpaidBills(db)).toHaveLength(0);
    expect(await getSetting(db, 'setup_step')).toBeNull();
  });
});
