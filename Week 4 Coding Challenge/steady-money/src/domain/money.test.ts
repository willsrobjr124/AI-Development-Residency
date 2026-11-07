import { centsToInput, formatCents, parseCents, spokenCents } from './money';

describe('parseCents: inputs that must be refused', () => {
  it.each(['', '   ', 'twelve', '12.3.4', '12.345', '-5', '$', '.', '1e5', '12,34,5x'])(
    'refuses %j',
    (input) => {
      expect(parseCents(input).ok).toBe(false);
    },
  );

  it('refuses zero unless zero is allowed', () => {
    expect(parseCents('0').ok).toBe(false);
    expect(parseCents('0', { allowZero: true })).toEqual({ ok: true, cents: 0 });
  });

  it('refuses amounts too large to be real', () => {
    expect(parseCents('100000000').ok).toBe(false);
  });
});

describe('parseCents: inputs that work', () => {
  it.each([
    ['12', 1200],
    ['12.5', 1250],
    ['12.50', 1250],
    ['$1,240', 124000],
    ['.5', 50],
    [' 7 ', 700],
    ['0.10', 10],
    ['19.99', 1999],
    ['1.15', 115],
  ])('reads %j as %i cents', (input, cents) => {
    expect(parseCents(input)).toEqual({ ok: true, cents });
  });
});

describe('formatCents', () => {
  it('hides cents when they are zero', () => {
    expect(formatCents(124000)).toBe('$1,240');
    expect(formatCents(0)).toBe('$0');
  });

  it('shows cents when they are not zero', () => {
    expect(formatCents(123350)).toBe('$1,233.50');
    expect(formatCents(5)).toBe('$0.05');
  });

  it('can round to whole dollars for the buckets', () => {
    expect(formatCents(123350, { wholeDollars: true })).toBe('$1,234');
  });
});

describe('spokenCents', () => {
  it('reads money the way a person says it', () => {
    expect(spokenCents(24500)).toBe('245 dollars');
    expect(spokenCents(100)).toBe('1 dollar');
    expect(spokenCents(123350)).toBe('1,233 dollars and 50 cents');
    expect(spokenCents(0)).toBe('0 dollars');
  });
});

describe('centsToInput', () => {
  it('round-trips through parseCents', () => {
    for (const cents of [124000, 1250, 5, 100]) {
      expect(parseCents(centsToInput(cents))).toEqual({ ok: true, cents });
    }
  });
});
