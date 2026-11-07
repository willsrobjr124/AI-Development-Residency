import type { Bill, MoneyInputs } from '@/domain/safeToSpend';

import { supabase } from './supabase';

/**
 * The only code that talks to the database. Every id is made at the tap, so a double
 * tap or a retry can't save the same thing twice. Row-level security limits every
 * call to the signed-in person.
 */

export type SettingsRow = {
  balance_cents: number;
  balance_set_at: string;
  next_payday: string | null;
  setup_step: string;
  last_opened: string | null;
  reduce_motion: boolean;
  allow_screenshots: boolean;
  bucket_hint_seen: boolean;
};

type AmountRow = { amount_cents: number };
type BillRow = { id: string; name: string; amount_cents: number; due_date: string };
type ExpenseRow = {
  id: string;
  amount_cents: number;
  category: string | null;
  created_at: string;
};

const now = () => new Date().toISOString();

function check<T>(result: { data: unknown; error: unknown }): T {
  if (result.error) throw result.error;
  return result.data as T;
}

async function userId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error('Not signed in.');
  return id;
}

/** Reads this person's settings, making the row the first time they sign in. */
export async function loadSettings(): Promise<SettingsRow> {
  const user_id = await userId();
  check(
    await supabase
      .from('user_settings')
      .upsert({ user_id }, { onConflict: 'user_id', ignoreDuplicates: true }),
  );
  return check<SettingsRow>(
    await supabase.from('user_settings').select('*').eq('user_id', user_id).single(),
  );
}

export async function updateSettings(changes: Partial<SettingsRow>): Promise<void> {
  check(
    await supabase
      .from('user_settings')
      .update({ ...changes, updated_at: now() })
      .eq('user_id', await userId()),
  );
}

export async function setBalance(cents: number): Promise<void> {
  check(await supabase.rpc('set_balance', { p_balance_cents: cents }));
}

export async function setNextPayday(date: string): Promise<void> {
  await updateSettings({ next_payday: date });
}

export async function addExpense(expense: {
  id: string;
  amountCents: number;
  category: string | null;
}): Promise<void> {
  check(
    await supabase
      .from('expenses')
      .upsert(
        { id: expense.id, amount_cents: expense.amountCents, category: expense.category },
        { onConflict: 'id', ignoreDuplicates: true },
      ),
  );
}

export async function removeExpense(id: string): Promise<void> {
  const time = now();
  check(
    await supabase.from('expenses').update({ deleted_at: time, updated_at: time }).eq('id', id),
  );
}

export async function restoreExpense(id: string): Promise<void> {
  check(
    await supabase.from('expenses').update({ deleted_at: null, updated_at: now() }).eq('id', id),
  );
}

export type RecentExpense = {
  id: string;
  amountCents: number;
  category: string | null;
  createdAt: string;
};

export async function listRecentExpenses(limit = 50): Promise<RecentExpense[]> {
  const rows = check<ExpenseRow[]>(
    await supabase
      .from('expenses')
      .select('id, amount_cents, category, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit),
  );
  return rows.map((row) => ({
    id: row.id,
    amountCents: row.amount_cents,
    category: row.category,
    createdAt: row.created_at,
  }));
}

/** A positive amount moves money into Savings. A negative amount moves it back. */
export async function moveSavings(move: { id: string; amountCents: number }): Promise<void> {
  check(
    await supabase
      .from('savings_moves')
      .upsert(
        { id: move.id, amount_cents: move.amountCents },
        { onConflict: 'id', ignoreDuplicates: true },
      ),
  );
}

export async function undoSavingsMove(id: string): Promise<void> {
  const time = now();
  check(
    await supabase
      .from('savings_moves')
      .update({ deleted_at: time, updated_at: time })
      .eq('id', id),
  );
}

export async function addBill(bill: Bill & { repeatsMonthly: boolean }): Promise<void> {
  check(
    await supabase.from('bills').upsert(
      {
        id: bill.id,
        name: bill.name,
        amount_cents: bill.amountCents,
        due_date: bill.dueDate,
        repeats_monthly: bill.repeatsMonthly,
      },
      { onConflict: 'id', ignoreDuplicates: true },
    ),
  );
}

export async function removeBill(id: string): Promise<void> {
  const time = now();
  check(await supabase.from('bills').update({ deleted_at: time, updated_at: time }).eq('id', id));
}

/** Runs on the server as one step, so a payment and the next date can't come apart. */
export async function markBillPaid(payment: { id: string; billId: string }): Promise<void> {
  check(
    await supabase.rpc('mark_bill_paid', { p_payment_id: payment.id, p_bill_id: payment.billId }),
  );
}

export async function undoBillPaid(paymentId: string): Promise<void> {
  check(await supabase.rpc('undo_bill_paid', { p_payment_id: paymentId }));
}

export type FreshStartUndo = {
  balance_cents: number;
  balance_set_at: string;
  expense_ids: string[];
};

export async function freshStart(balanceCents: number): Promise<FreshStartUndo> {
  return check<FreshStartUndo>(
    await supabase.rpc('fresh_start', { p_balance_cents: balanceCents }),
  );
}

export async function undoFreshStart(undo: FreshStartUndo): Promise<void> {
  check(await supabase.rpc('undo_fresh_start', { p_undo: undo }));
}

export async function deleteMyAccount(): Promise<void> {
  check(await supabase.rpc('delete_my_account'));
}

export async function listUnpaidBills(): Promise<Bill[]> {
  const rows = check<BillRow[]>(
    await supabase
      .from('bills')
      .select('id, name, amount_cents, due_date')
      .is('paid_at', null)
      .is('deleted_at', null)
      .order('due_date'),
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    amountCents: row.amount_cents,
    dueDate: row.due_date,
  }));
}

const total = (rows: AmountRow[]) => rows.reduce((sum, row) => sum + row.amount_cents, 0);

/** Everything the money math needs, read from the database. */
export async function loadMoneyInputs(today: string): Promise<MoneyInputs> {
  const settings = check<Pick<SettingsRow, 'balance_cents' | 'balance_set_at' | 'next_payday'>>(
    await supabase
      .from('user_settings')
      .select('balance_cents, balance_set_at, next_payday')
      .single(),
  );
  const since = settings.balance_set_at;
  const [spent, paid, unpaidBills, savings] = await Promise.all([
    supabase.from('expenses').select('amount_cents').is('deleted_at', null).gte('created_at', since),
    supabase
      .from('bill_payments')
      .select('amount_cents')
      .is('deleted_at', null)
      .gte('created_at', since),
    listUnpaidBills(),
    supabase.from('savings_moves').select('amount_cents').is('deleted_at', null),
  ]);

  return {
    balanceCents: settings.balance_cents,
    spentCents: total(check<AmountRow[]>(spent)),
    paidBillsCents: total(check<AmountRow[]>(paid)),
    unpaidBills,
    savingsCents: total(check<AmountRow[]>(savings)),
    nextPayday: settings.next_payday,
    today,
  };
}
