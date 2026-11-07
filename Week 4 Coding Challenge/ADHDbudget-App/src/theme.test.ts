import { dark, light, type Colors } from './theme';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

describe.each<[string, Colors]>([
  ['light', light],
  ['dark', dark],
])('%s colors', (_name, colors) => {
  it('text pairs reach 4.5:1', () => {
    expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.buttonText, colors.button)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.confirmationText, colors.confirmation)).toBeGreaterThanOrEqual(4.5);
  });

  it('bucket fills and the button shape reach 3:1, except the outlined Savings fill', () => {
    expect(contrast(colors.bucketSpending, colors.background)).toBeGreaterThanOrEqual(3);
    expect(contrast(colors.bucketBills, colors.background)).toBeGreaterThanOrEqual(3);
    expect(contrast(colors.button, colors.background)).toBeGreaterThanOrEqual(3);
  });

  it('never uses red for money', () => {
    const isRed = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
      return r > 150 && g < 100 && b < 100;
    };
    expect(Object.values(colors).filter(isRed)).toEqual([]);
  });
});
