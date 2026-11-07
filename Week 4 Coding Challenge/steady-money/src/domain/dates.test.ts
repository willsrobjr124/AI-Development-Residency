import {
  addDays,
  addMonths,
  daysBetween,
  longDate,
  monthGrid,
  shortDate,
  untilLabel,
  weekdayName,
} from './dates';

describe('calendar math', () => {
  it('counts calendar days across a clock change', () => {
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
    expect(daysBetween('2026-11-07', '2026-11-07')).toBe(0);
    expect(daysBetween('2026-11-07', '2026-11-01')).toBe(-6);
  });

  it('adds days across a month end', () => {
    expect(addDays('2026-11-29', 3)).toBe('2026-12-02');
  });

  it('keeps a monthly bill inside short months', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-15');
  });

  it('names days and dates', () => {
    expect(weekdayName('2026-11-13')).toBe('Friday');
    expect(shortDate('2026-11-21')).toBe('Nov 21');
  });
});

describe('untilLabel', () => {
  const today = '2026-11-09'; // a Monday

  it('says today on payday', () => {
    expect(untilLabel('2026-11-09', today)).toBe('until today');
  });

  it('uses the weekday within 6 days', () => {
    expect(untilLabel('2026-11-13', today)).toBe('until Friday');
    expect(untilLabel('2026-11-15', today)).toBe('until Sunday');
  });

  it('uses a date further out', () => {
    expect(untilLabel('2026-11-21', today)).toBe('until Nov 21');
  });

  it('uses a date when no payday is set', () => {
    expect(untilLabel(null, today)).toBe('until Dec 9');
  });
});

describe('calendar grid', () => {
  it('starts November 2026 on a Sunday', () => {
    const weeks = monthGrid(2026, 11);
    expect(weeks[0][0]).toBe('2026-11-01');
    expect(weeks[4][1]).toBe('2026-11-30');
    expect(weeks[4][2]).toBeNull();
  });

  it('leaves blanks before the first day', () => {
    expect(monthGrid(2026, 12)[0].slice(0, 3)).toEqual([null, null, '2026-12-01']);
  });

  it('reads a date out in full', () => {
    expect(longDate('2026-11-13')).toBe('Friday, November 13');
  });
});
