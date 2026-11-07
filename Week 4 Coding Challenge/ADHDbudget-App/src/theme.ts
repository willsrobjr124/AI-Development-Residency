import { useColorScheme } from 'react-native';

/** Every color, size and font in the app lives here, matching the Figma file. */

export const light = {
  background: '#FFFFFF',
  text: '#006E93',
  button: '#006E93',
  buttonText: '#FFFFFF',
  bucketSpending: '#008F97',
  bucketBills: '#006E93',
  bucketSavings: '#F8F2C8',
  line: '#DCE9EE',
  confirmation: '#F8F2C8',
  confirmationText: '#006E93',
  pressed: '#EDF4F7',
};

export const dark: typeof light = {
  background: '#0E2029',
  text: '#F4F8F9',
  button: '#F8F2C8',
  buttonText: '#0E2029',
  bucketSpending: '#2CC3CC',
  bucketBills: '#7CC4DE',
  bucketSavings: '#F8F2C8',
  line: '#2F4A57',
  // A darker bar than the cream button, so the two don't merge when stacked.
  confirmation: '#1E3A47',
  confirmationText: '#F4F8F9',
  pressed: '#1E3A47',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 28 };

export const radius = { control: 14, chip: 22, jar: 18 };

export const size = {
  screenPadding: 24,
  minTarget: 44,
  jarHeight: 150,
  jarMinLevel: 12,
  /** Above this text size the buckets stack as full-width rows. */
  stackBucketsAt: 1.3,
};

/** Calm and short. Nothing bounces, and all of it switches off with reduced motion. */
export const motion = {
  press: 120,
  select: 150,
  enter: 200,
  exit: 150,
  fill: 250,
  pressScale: 0.97,
};

export const fonts = {
  regular: 'AtkinsonHyperlegible_400Regular',
  bold: 'AtkinsonHyperlegible_700Bold',
};

export const type = {
  heading: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 38 },
  sentence: { fontFamily: fonts.regular, fontSize: 26, lineHeight: 33 },
  number: { fontFamily: fonts.bold, fontSize: 76, lineHeight: 84 },
  amountInput: { fontFamily: fonts.bold, fontSize: 56, lineHeight: 64 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 26 },
  bodyBold: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 26 },
  button: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 22 },
};

export type TextVariant = keyof typeof type;
