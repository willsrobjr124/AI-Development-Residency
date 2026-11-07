import { billCountdown, calculate, nextBillLine, paydayHasPassed, type MoneyInputs } from './safeToSpend';

const today = '2026-11-09';
const rent = { id: 'rent', name: 'Rent', amountCents: 90000, dueDate: '2026-11-13' };
const phone = { id: 'phone', name: 'Phone', amountCents: 4500, dueDate: '2026-11-12' };

const inputs = (overrides: Partial<MoneyInputs> = {}): MoneyInputs => ({
  balanceCents: 124000,
  spentCents: 0,
  paidBillsCents: 0,
  unpaidBills: [],
  savingsCents: 0,
  nextPayday: '2026-11-13',
  today,
  ...overrides,
});

describe('below zero', () => {
  it('shows $0, flags the shortfall and never a negative bucket', () => {
    const result = calculate(inputs({ balanceCents: 10000, unpaidBills: [rent], savingsCents: 5000 }));
    expect(result.safeCents).toBe(0);
    expect(result.isShort).toBe(true);
    expect(result.buckets.spendingCents).toBe(0);
  });

  it('is not short at exactly zero', () => {
    const result = calculate(inputs({ balanceCents: 90000, unpaidBills: [rent] }));
    expect(result.safeCents).toBe(0);
    expect(result.isShort).toBe(false);
  });
});

describe('which bills count', () => {
  it('excludes a bill due after the period end', () => {
    const later = { ...rent, dueDate: '2026-11-14' };
    expect(calculate(inputs({ unpaidBills: [later] })).safeCents).toBe(124000);
  });

  it('includes a bill due on the period end', () => {
    expect(calculate(inputs({ unpaidBills: [rent] })).safeCents).toBe(34000);
  });

  it('includes an overdue unpaid bill', () => {
    const overdue = { ...phone, dueDate: '2026-11-01' };
    expect(calculate(inputs({ unpaidBills: [overdue] })).safeCents).toBe(119500);
  });

  it('uses 30 days when no payday is set', () => {
    const result = calculate(
      inputs({
        nextPayday: null,
        unpaidBills: [
          { ...phone, dueDate: '2026-12-09' },
          { ...rent, dueDate: '2026-12-10' },
        ],
      }),
    );
    expect(result.periodEnd).toBe('2026-12-09');
    expect(result.billsCents).toBe(4500);
  });

  it('falls back to 30 days once payday has passed', () => {
    const result = calculate(inputs({ nextPayday: '2026-11-06' }));
    expect(result.periodEnd).toBe('2026-12-09');
  });
});

describe('the design example', () => {
  const example = inputs({ unpaidBills: [rent, phone], savingsCents: 5000 });

  it('gives $245 from $1,240', () => {
    expect(calculate(example).safeCents).toBe(24500);
  });

  it('takes a quick add off the number', () => {
    expect(calculate({ ...example, spentCents: 1200 }).safeCents).toBe(23300);
  });

  it('keeps the number the same when a bill is marked paid', () => {
    const paid = calculate({ ...example, unpaidBills: [rent], paidBillsCents: 4500 });
    expect(paid.safeCents).toBe(24500);
  });

  it('moves $20 from Spending to Savings', () => {
    const moved = calculate({ ...example, savingsCents: 7000 });
    expect(moved.buckets).toEqual({ spendingCents: 22500, billsCents: 94500, savingsCents: 7000 });
  });
});

describe('adding up', () => {
  it('has no bills and no savings: the number equals the balance', () => {
    expect(calculate(inputs()).safeCents).toBe(124000);
  });

  it('adds cents exactly', () => {
    const dime = { ...phone, amountCents: 10 };
    const result = calculate(inputs({ unpaidBills: [dime, { ...dime, id: 'b' }, { ...dime, id: 'c' }] }));
    expect(result.billsCents).toBe(30);
  });

  it('buckets add up to the available balance', () => {
    const result = calculate(
      inputs({ spentCents: 1234, unpaidBills: [rent, phone], savingsCents: 5000 }),
    );
    const { spendingCents, billsCents, savingsCents } = result.buckets;
    expect(spendingCents + billsCents + savingsCents).toBe(result.availableCents);
  });

  it('breakdown lines add up to the number', () => {
    const result = calculate(
      inputs({ spentCents: 1200, paidBillsCents: 4500, unpaidBills: [rent], savingsCents: 5000 }),
    );
    const total = result.breakdown.reduce((sum, line) => sum + line.amountCents, 0);
    expect(total).toBe(result.safeCents);
    expect(result.breakdown.map((line) => line.label)).toEqual([
      'Your balance',
      'Spent since then',
      'Bills paid',
      'Rent',
      'Savings',
    ]);
  });

  it('leaves out breakdown lines that are zero', () => {
    const labels = calculate(inputs()).breakdown.map((line) => line.label);
    expect(labels).toEqual(['Your balance']);
  });
});

describe('paydayHasPassed', () => {
  it('is false on payday and before, and with no payday', () => {
    expect(paydayHasPassed('2026-11-09', today)).toBe(false);
    expect(paydayHasPassed('2026-11-13', today)).toBe(false);
    expect(paydayHasPassed(null, today)).toBe(false);
  });

  it('is true the day after', () => {
    expect(paydayHasPassed('2026-11-08', today)).toBe(true);
  });
});

describe('billCountdown', () => {
  it('lists bills due in the next 7 days, soonest first', () => {
    const list = billCountdown(
      [rent, phone, { ...rent, id: 'far', dueDate: '2026-11-17' }],
      today,
    );
    expect(list.map((bill) => bill.id)).toEqual(['phone', 'rent']);
  });

  it('includes day 7', () => {
    expect(billCountdown([{ ...rent, dueDate: '2026-11-16' }], today)).toHaveLength(1);
  });

  it('words the countdown', () => {
    const labels = billCountdown(
      [
        { ...rent, id: 'a', dueDate: today },
        { ...rent, id: 'b', dueDate: '2026-11-10' },
        { ...rent, id: 'c', dueDate: '2026-11-12' },
      ],
      today,
    ).map((bill) => bill.countdown);
    expect(labels).toEqual(['Due today', '1 day left', '3 days left']);
  });

  it('shows an overdue bill first, by date, with no alarm words', () => {
    const list = billCountdown([rent, { ...phone, dueDate: '2026-11-03' }], today);
    expect(list[0]).toMatchObject({ id: 'phone', countdown: 'Due Nov 3' });
  });
});

describe('nextBillLine', () => {
  it('names the soonest unpaid bill', () => {
    expect(nextBillLine([rent, phone], today)).toBe('Phone bill: 3 days left');
  });

  it('still names a bill more than 7 days away', () => {
    expect(nextBillLine([{ ...rent, dueDate: '2026-11-21' }], today)).toBe('Rent bill: 12 days left');
  });

  it('says so when there are no bills', () => {
    expect(nextBillLine([], today)).toBe('No bills coming up');
  });
});
