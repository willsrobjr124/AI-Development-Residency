/** Money is always a whole number of cents. Nothing here goes through a decimal number. */

const MAX_CENTS = 9_999_999_999; // $99,999,999.99

export type ParsedCents = { ok: true; cents: number } | { ok: false };

export function parseCents(input: string, options: { allowZero?: boolean } = {}): ParsedCents {
  const cleaned = input.trim().replace(/^\$/, '').replace(/,/g, '').trim();
  const match = /^(\d*)(?:\.(\d{0,2}))?$/.exec(cleaned);
  if (!match) return { ok: false };

  const [, dollars, fraction = ''] = match;
  if (dollars === '' && fraction === '') return { ok: false };

  const cents = Number(dollars || '0') * 100 + Number(fraction.padEnd(2, '0') || '0');
  if (!Number.isSafeInteger(cents) || cents > MAX_CENTS) return { ok: false };
  if (cents === 0 && !options.allowZero) return { ok: false };
  return { ok: true, cents };
}

function withCommas(whole: number): string {
  return String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatCents(cents: number, options: { wholeDollars?: boolean } = {}): string {
  if (options.wholeDollars) return `$${withCommas(Math.round(cents / 100))}`;
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  if (remainder === 0) return `$${withCommas(dollars)}`;
  return `$${withCommas(dollars)}.${String(remainder).padStart(2, '0')}`;
}

/** Text for screen readers, so "$245" is spoken as a person would say it. */
export function spokenCents(cents: number): string {
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  const dollarWords = `${withCommas(dollars)} ${dollars === 1 ? 'dollar' : 'dollars'}`;
  if (remainder === 0) return dollarWords;
  return `${dollarWords} and ${remainder} ${remainder === 1 ? 'cent' : 'cents'}`;
}

/** Fills an input with a saved amount, like "1240" or "12.50". */
export function centsToInput(cents: number): string {
  const remainder = cents % 100;
  const dollars = Math.floor(cents / 100);
  return remainder === 0 ? String(dollars) : `${dollars}.${String(remainder).padStart(2, '0')}`;
}
