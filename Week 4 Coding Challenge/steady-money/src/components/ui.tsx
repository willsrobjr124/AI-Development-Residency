import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type ViewStyle,
} from 'react-native';
import Animated, { cubicBezier, Easing, Keyframe } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion, radius, size, space, type, useColors, type TextVariant } from '@/theme';

const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const riseIn = new Keyframe({
  from: { opacity: 0, transform: [{ translateY: 8 }] },
  to: {
    opacity: 1,
    transform: [{ translateY: 0 }],
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  },
}).duration(motion.enter);

type AppTextProps = TextProps & { variant?: TextVariant; color?: string };

export function AppText({ variant = 'body', color, style, ...props }: AppTextProps) {
  const colors = useColors();
  return <Text {...props} style={[type[variant], { color: color ?? colors.text }, style]} />;
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <AppText variant="heading" accessibilityRole="header">
      {children}
    </AppText>
  );
}

/** Scrolls when text is large or the keyboard is open, and fits one screen otherwise. */
export function Screen({ children }: { children: ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.screen,
          { paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.xl },
        ]}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function Spacer() {
  return <View style={styles.flex} />;
}

/** A button that gives way slightly under the finger, then commits on release. */
function PressScale({
  style,
  children,
  ...props
}: Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      {...props}
      style={[
        style,
        reduced
          ? { opacity: pressed ? 0.8 : 1 }
          : {
              transform: [{ scale: pressed ? motion.pressScale : 1 }],
              transitionProperty: 'transform',
              transitionDuration: motion.press,
              transitionTimingFunction: EASE_OUT,
            },
      ]}>
      {children}
    </AnimatedPressable>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <PressScale onPress={onPress} style={[styles.primary, { backgroundColor: colors.button }]}>
      <AppText variant="button" color={colors.buttonText} style={styles.center}>
        {label}
      </AppText>
    </PressScale>
  );
}

export function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressScale onPress={onPress} style={styles.textButton}>
      <AppText variant="bodyBold">{label}</AppText>
    </PressScale>
  );
}

export function SmallButton({
  label,
  accessibilityLabel,
  onPress,
}: {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <PressScale
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.small, { borderColor: colors.text }]}>
      <AppText variant="bodyBold">{label}</AppText>
    </PressScale>
  );
}

export function BackLink({ label = 'Back', onPress }: { label?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.back}>
      <AppText variant="bodyBold">{label}</AppText>
    </Pressable>
  );
}

function SelectedCheck({ show, color, iconSize }: { show: boolean; color: string; iconSize: number }) {
  if (!show) return null;
  return <Ionicons name="checkmark" size={iconSize} color={color} />;
}

function useSelectStyle(selected: boolean): { fill: ViewStyle; textColor: string } {
  const colors = useColors();
  const reduced = useReducedMotion();
  return {
    textColor: selected ? colors.buttonText : colors.text,
    fill: {
      borderColor: colors.button,
      backgroundColor: selected ? colors.button : colors.background,
      ...(reduced
        ? {}
        : {
            transitionProperty: 'backgroundColor',
            transitionDuration: motion.select,
            transitionTimingFunction: EASE_OUT,
          }),
    } as ViewStyle,
  };
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { fill, textColor } = useSelectStyle(selected);
  return (
    <PressScale accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, fill]}>
      <SelectedCheck show={selected} color={textColor} iconSize={18} />
      <AppText color={textColor}>{label}</AppText>
    </PressScale>
  );
}

export function Option({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { fill, textColor } = useSelectStyle(selected);
  return (
    <PressScale accessibilityState={{ selected }} onPress={onPress} style={[styles.option, fill]}>
      <AppText color={textColor}>{label}</AppText>
      <SelectedCheck show={selected} color={textColor} iconSize={22} />
    </PressScale>
  );
}

/** A full-width row. Rows highlight when pressed, because a scaling row looks like a squish. */
export function Row({
  title,
  detail,
  accessibilityLabel,
  onPress,
  divider = true,
}: {
  title: string;
  detail?: string;
  accessibilityLabel?: string;
  onPress?: () => void;
  divider?: boolean;
}) {
  const colors = useColors();
  const content = (
    <>
      <AppText style={styles.rowTitle}>{title}</AppText>
      {detail ? <AppText variant="bodyBold">{detail}</AppText> : null}
      {onPress ? <Ionicons name="chevron-forward" size={20} color={colors.text} /> : null}
    </>
  );
  const line = divider ? { borderBottomColor: colors.line, borderBottomWidth: 1 } : null;
  if (!onPress) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel} style={[styles.row, line]}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        line,
        pressed ? { backgroundColor: colors.pressed } : null,
      ]}>
      {content}
    </Pressable>
  );
}

export function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={[styles.row, { borderBottomColor: colors.line, borderBottomWidth: 1 }]}>
      <AppText style={styles.rowTitle}>{label}</AppText>
      <View
        style={[
          styles.track,
          { borderColor: colors.button, backgroundColor: value ? colors.button : 'transparent' },
          value ? styles.trackOn : null,
        ]}>
        <View
          style={[styles.knob, { backgroundColor: value ? colors.buttonText : colors.button }]}
        />
      </View>
    </Pressable>
  );
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string | null }) {
  const colors = useColors();
  return (
    <View style={styles.fieldGroup}>
      <View style={[styles.field, { borderBottomColor: colors.text, borderBottomWidth: error ? 4 : 2 }]}>
        <AppText importantForAccessibility="no" accessibilityElementsHidden>
          {label}
        </AppText>
        <TextInput
          accessibilityLabel={label}
          {...props}
          style={[type.bodyBold, styles.fieldInput, { color: colors.text }]}
        />
      </View>
      {error ? (
        <AppText variant="bodyBold" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function MoneyField({
  label,
  value,
  error,
  onChange,
  onSubmit,
}: {
  label: string;
  value: string;
  error: string | null;
  onChange: (text: string) => void;
  onSubmit?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.fieldGroup}>
      <View
        style={[
          styles.moneyField,
          { borderBottomColor: colors.text, borderBottomWidth: error ? 4 : 2 },
        ]}>
        <AppText variant="amountInput" importantForAccessibility="no" accessibilityElementsHidden>
          $
        </AppText>
        <TextInput
          accessibilityLabel={label}
          autoFocus
          inputMode="decimal"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          style={[type.amountInput, styles.moneyInput, { color: colors.text }]}
        />
      </View>
      {error ? (
        <AppText variant="bodyBold" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function StepProgress({ step }: { step: number }) {
  const colors = useColors();
  return (
    <View accessible accessibilityLabel={`Step ${step} of 4`} style={styles.progress}>
      <View style={styles.segments}>
        {[1, 2, 3, 4].map((segment) => (
          <View
            key={segment}
            style={[
              styles.segment,
              { backgroundColor: segment <= step ? colors.button : colors.line },
            ]}
          />
        ))}
      </View>
      <AppText>Step {step} of 4</AppText>
    </View>
  );
}

export function CheckCircle() {
  const colors = useColors();
  const reduced = useReducedMotion();
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={styles.checkSpace}>
      <Animated.View
        entering={
          reduced
            ? undefined
            : new Keyframe({
                from: { opacity: 0, transform: [{ scale: 0.96 }] },
                to: {
                  opacity: 1,
                  transform: [{ scale: 1 }],
                  easing: Easing.bezier(0.23, 1, 0.32, 1),
                },
              }).duration(motion.enter)
        }
        style={[styles.check, { backgroundColor: colors.button }]}>
        <Ionicons name="checkmark" size={48} color={colors.buttonText} />
      </Animated.View>
    </View>
  );
}

export function Confirmation({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  const reduced = useReducedMotion();
  return (
    <Animated.View
      entering={reduced ? undefined : riseIn}
      accessibilityLiveRegion="polite"
      style={[styles.confirmation, { backgroundColor: colors.confirmation }]}>
      <View style={styles.confirmationMessage}>
        <AppText color={colors.confirmationText}>{message}</AppText>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityHint={message}
          onPress={onAction}
          style={styles.confirmationAction}>
          <AppText variant="bodyBold" color={colors.confirmationText}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  screen: { flexGrow: 1, paddingHorizontal: size.screenPadding, gap: space.xxl },
  primary: {
    minHeight: 58,
    borderRadius: radius.control,
    paddingVertical: 18,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  small: {
    minHeight: 48,
    borderRadius: radius.control,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { minHeight: 46, justifyContent: 'center', alignSelf: 'stretch' },
  chip: {
    minHeight: size.minTarget,
    borderRadius: radius.chip,
    borderWidth: 1.5,
    paddingHorizontal: space.lg,
    paddingVertical: 7.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  option: {
    minHeight: 58,
    borderRadius: radius.control,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 14.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
  },
  rowTitle: { flex: 1 },
  track: {
    width: 51,
    height: 31,
    borderRadius: 16,
    borderWidth: 2,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: { alignItems: 'flex-end' },
  knob: { width: 21, height: 21, borderRadius: 11 },
  fieldGroup: { gap: space.sm },
  field: { paddingBottom: space.sm, gap: 2 },
  fieldInput: { padding: 0, minHeight: 26 },
  moneyField: { flexDirection: 'row', alignItems: 'center', paddingBottom: space.sm },
  moneyInput: { flex: 1, padding: 0, minWidth: 0 },
  progress: { gap: 10 },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
  checkSpace: { height: 96, flexShrink: 0, alignItems: 'center' },
  check: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmation: {
    minHeight: 56,
    borderRadius: radius.control,
    paddingLeft: space.lg,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  confirmationMessage: { flex: 1, paddingVertical: 14 },
  confirmationAction: {
    minWidth: 64,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
