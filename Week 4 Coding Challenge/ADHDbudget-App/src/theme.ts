import { useColorScheme, type TextStyle } from 'react-native';

/**
 * Every color, size and font in the app lives here, matching the Figma file
 * (iOS 26 UI kit, November 2026 redesign).
 *
 * Two kit colors are darkened slightly so text passes WCAG 2.2 AA (4.5:1):
 * - accent: #0066CC instead of #0088FF (white on it is 5.6:1, not 3.5:1)
 * - secondaryLabel: #6D6D72 instead of rgba(60,60,67,0.6) (5.2:1, not 3.4:1)
 */

export const light = {
  background: '#FFFFFF',
  /** Grouped lists, text fields, chips and confirmation bars. */
  groupedBackground: '#F2F2F7',
  label: '#000000',
  secondaryLabel: '#6D6D72',
  /** Chevrons only. Never used for text. */
  tertiaryLabel: '#C4C4C7',
  separator: '#E6E6E6',
  fieldLine: '#3C3C43',
  /** Buttons, links, Undo and selected chips. */
  accent: '#0066CC',
  /** Accent used as text on the page background. */
  link: '#0066CC',
  onAccent: '#FFFFFF',
  /** Errors and destructive actions. Calm plum, never red. */
  plum: '#5E2657',
  plumText: '#5E2657',
  onPlum: '#FFFFFF',
  /** Brand deep blue: progress, the check circle and jar outlines. */
  brand: '#006E93',
  onBrand: '#FFFFFF',
  progressTrack: '#DCE9EE',
  jarBorder: '#006E93',
  bucketSpending: '#008F97',
  bucketBills: '#006E93',
  bucketSavings: '#F8F2C8',
  switchOn: '#34C759',
  calendarSelected: '#E0EDFA',
  glass: 'rgba(255,255,255,0.85)',
  glassBorder: 'rgba(0,0,0,0.06)',
  pressed: '#E5E5EA',
};

export const dark: typeof light = {
  background: '#000000',
  groupedBackground: '#1C1C1E',
  label: '#FFFFFF',
  secondaryLabel: '#A1A1A6',
  tertiaryLabel: '#5A5A5F',
  separator: '#38383A',
  fieldLine: '#8D8D93',
  accent: '#0066CC',
  link: '#4AA8FF',
  onAccent: '#FFFFFF',
  plum: '#5E2657',
  plumText: '#D6A6D1',
  onPlum: '#FFFFFF',
  brand: '#7CC4DE',
  onBrand: '#000000',
  progressTrack: '#2F4A57',
  jarBorder: '#F4F8F9',
  bucketSpending: '#2CC3CC',
  bucketBills: '#7CC4DE',
  bucketSavings: '#F8F2C8',
  switchOn: '#30D158',
  calendarSelected: '#0B2A4A',
  glass: 'rgba(44,44,46,0.9)',
  glassBorder: 'rgba(255,255,255,0.1)',
  pressed: '#2C2C2E',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 28 };

export const radius = { group: 26, field: 12, confirmation: 14, chip: 22, jar: 16, small: 12 };

export const size = {
  screenPadding: 20,
  minTarget: 44,
  glassButton: 48,
  buttonHeight: 50,
  rowHeight: 52,
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

/** The system font: SF Pro on iPhone, Roboto on Android, and the system font on the web. */
const regular: TextStyle = { fontWeight: '400' };
const semibold: TextStyle = { fontWeight: '600' };
const bold: TextStyle = { fontWeight: '700' };

export const type = {
  /** Large Title, Emphasized (34/41). */
  heading: { ...bold, fontSize: 34, lineHeight: 41, letterSpacing: 0.4 },
  /** Title 1, Emphasized (28/34). */
  title: { ...bold, fontSize: 28, lineHeight: 34, letterSpacing: 0.38 },
  /** The safe-to-spend number. */
  number: { ...bold, fontSize: 72, lineHeight: 86, letterSpacing: 0.4 },
  /** Money typed into a field. */
  amountInput: { ...bold, fontSize: 34, lineHeight: 41, letterSpacing: 0.4 },
  /** Body (17/22). */
  body: { ...regular, fontSize: 17, lineHeight: 22, letterSpacing: -0.43 },
  /** Headline (17/22, semibold). */
  bodyBold: { ...semibold, fontSize: 17, lineHeight: 22, letterSpacing: -0.43 },
  /** Subheadline (15/20). */
  subhead: { ...regular, fontSize: 15, lineHeight: 20, letterSpacing: -0.23 },
  /** Footnote (13/18). */
  footnote: { ...regular, fontSize: 13, lineHeight: 18, letterSpacing: -0.08 },
  button: { ...regular, fontSize: 17, lineHeight: 22, letterSpacing: -0.43 },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof type;
