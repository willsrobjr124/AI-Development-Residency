import {
  LOCK_AFTER_MS,
  moveLimitCents,
  nextFridays,
  shouldLock,
  shouldOfferFreshStart,
} from './rules';

describe('moveLimitCents', () => {
  it('limits a move into Savings to what is in Spending', () => {
    expect(moveLimitCents('savings', { spendingCents: 24500, savingsCents: 5000 })).toBe(24500);
  });

  it('limits a move into Spending to what is in Savings', () => {
    expect(moveLimitCents('spending', { spendingCents: 24500, savingsCents: 5000 })).toBe(5000);
  });
});

describe('shouldOfferFreshStart', () => {
  it('does not offer on a first open', () => {
    expect(shouldOfferFreshStart(null, '2026-11-09')).toBe(false);
  });

  it('does not offer after 6 days', () => {
    expect(shouldOfferFreshStart('2026-11-03', '2026-11-09')).toBe(false);
  });

  it('offers after 7 days', () => {
    expect(shouldOfferFreshStart('2026-11-02', '2026-11-09')).toBe(true);
  });
});

describe('shouldLock', () => {
  it('stays open just under 5 minutes', () => {
    expect(shouldLock(1000, 1000 + LOCK_AFTER_MS - 1)).toBe(false);
  });

  it('locks at 5 minutes', () => {
    expect(shouldLock(1000, 1000 + LOCK_AFTER_MS)).toBe(true);
  });
});

describe('nextFridays', () => {
  it('finds this Friday and next Friday from a Monday', () => {
    expect(nextFridays('2026-11-09')).toEqual({ first: '2026-11-13', second: '2026-11-20' });
  });

  it('never picks today, even on a Friday', () => {
    expect(nextFridays('2026-11-13')).toEqual({ first: '2026-11-20', second: '2026-11-27' });
  });
});
