import Ionicons from '@expo/vector-icons/Ionicons';
import { Children, createContext, Fragment, useContext, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
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

type Tone = 'accent' | 'plum';

type AppTextProps = TextProps & { variant?: TextVariant; color?: string; muted?: boolean };

/** Text in the system font. `muted` is the secondary gray used for helper lines. */
export function AppText({ variant = 'body', color, muted = false, style, ...props }: AppTextProps) {
  const colors = useColors();
  return (
    <Text
      {...props}
      style={[type[variant], { color: color ?? (muted ? colors.secondaryLabel : colors.label) }, style]}
    />
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <AppText variant="heading" accessibilityRole="header">
      {children}
    </AppText>
  );
}

/** A plum message under a field or a form, read out when it appears. */
export function ErrorText({ children }: { children: ReactNode }) {
  const colors = useColors();
  return (
    <AppText variant="bodyBold" color={colors.plumText} accessibilityLiveRegion="polite">
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
          { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.lg },
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

/** The one main action on a screen: a filled capsule. */
export function PrimaryButton({
  label,
  onPress,
  tone = 'accent',
}: {
  label: string;
  onPress: () => void;
  tone?: Tone;
}) {
  const colors = useColors();
  const fill = tone === 'plum' ? colors.plum : colors.accent;
  const text = tone === 'plum' ? colors.onPlum : colors.onAccent;
  return (
    <PressScale onPress={onPress} style={[styles.primary, { backgroundColor: fill }]}>
      <AppText variant="button" color={text} style={styles.center}>
        {label}
      </AppText>
    </PressScale>
  );
}

/** A second, quieter choice under the main button: borderless colored text. */
export function TextButton({
  label,
  onPress,
  tone = 'accent',
}: {
  label: string;
  onPress: () => void;
  tone?: Tone;
}) {
  const colors = useColors();
  return (
    <PressScale onPress={onPress} style={styles.textButton}>
      <AppText color={tone === 'plum' ? colors.plumText : colors.link} style={styles.center}>
        {label}
      </AppText>
    </PressScale>
  );
}

/** A small action inside a row, such as Mark paid (outlined) or Remove (plain). */
export function SmallButton({
  label,
  accessibilityLabel,
  onPress,
  tone = 'accent',
  outlined = true,
}: {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  tone?: Tone;
  outlined?: boolean;
}) {
  const colors = useColors();
  const color = tone === 'plum' ? colors.plumText : colors.link;
  return (
    <PressScale
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.small, outlined ? { borderColor: color, borderWidth: 1.5 } : null]}>
      <AppText color={color}>{label}</AppText>
    </PressScale>
  );
}

/** A round, frosted button for one icon, like the gear on Home. */
export function GlassButton({
  icon,
  accessibilityLabel,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <PressScale
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.glass, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
      <Ionicons name={icon} size={24} color={colors.label} />
    </PressScale>
  );
}

/** Back: a glass chevron with the name of where it goes. */
export function BackLink({ label = 'Back', onPress }: { label?: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.back}>
      <View
        style={[styles.glass, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
        <Ionicons name="chevron-back" size={24} color={colors.label} />
      </View>
      <AppText color={colors.link}>{label}</AppText>
    </Pressable>
  );
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
  const colors = useColors();
  const reduced = useReducedMotion();
  const textColor = selected ? colors.onAccent : colors.label;
  return (
    <PressScale
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.groupedBackground,
          ...(reduced
            ? {}
            : {
                transitionProperty: 'backgroundColor',
                transitionDuration: motion.select,
                transitionTimingFunction: EASE_OUT,
              }),
        } as ViewStyle,
      ]}>
      {selected ? <Ionicons name="checkmark" size={18} color={textColor} /> : null}
      <AppText color={textColor}>{label}</AppText>
    </PressScale>
  );
}

const GroupContext = createContext<{ plain: boolean } | null>(null);

/**
 * A list of rows with hairlines between them. By default it sits on a gray rounded card,
 * like iOS inset grouped lists; `plain` drops the card for lists that fill the screen.
 */
export function ListGroup({ children, plain = false }: { children: ReactNode; plain?: boolean }) {
  const colors = useColors();
  const items = Children.toArray(children).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <GroupContext.Provider value={{ plain }}>
      <View
        style={
          plain ? null : [styles.group, { backgroundColor: colors.groupedBackground }]
        }>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 ? (
              <View
                style={[
                  styles.separator,
                  { backgroundColor: colors.separator, marginHorizontal: plain ? 0 : space.lg },
                ]}
              />
            ) : null}
            {item}
          </Fragment>
        ))}
      </View>
    </GroupContext.Provider>
  );
}

/** The padding a row needs inside its group. */
function useRowInset(): ViewStyle {
  const group = useContext(GroupContext);
  return { paddingHorizontal: group && !group.plain ? space.lg : 0 };
}

/** A custom row inside a ListGroup, for rows with their own buttons. */
export function ListItem({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const inset = useRowInset();
  return <View style={[styles.row, inset, style]}>{children}</View>;
}

/** A list row. Rows highlight when pressed, because a scaling row looks like a squish. */
export function Row({
  title,
  subtitle,
  detail,
  accessibilityLabel,
  onPress,
  selected,
  strong = false,
}: {
  title: string;
  subtitle?: string;
  detail?: string;
  accessibilityLabel?: string;
  onPress?: () => void;
  /** Shows a checkmark when true, for picking one of a few options. */
  selected?: boolean;
  strong?: boolean;
  /** No longer needed: ListGroup draws the lines. Kept so older calls still type-check. */
  divider?: boolean;
}) {
  const colors = useColors();
  const inset = useRowInset();
  const content = (
    <>
      <View style={styles.rowTitle}>
        <AppText variant={strong ? 'bodyBold' : 'body'}>{title}</AppText>
        {subtitle ? (
          <AppText variant="subhead" muted>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {detail ? <AppText muted>{detail}</AppText> : null}
      {selected ? <Ionicons name="checkmark" size={22} color={colors.label} /> : null}
      {onPress && selected === undefined ? (
        <Ionicons name="chevron-forward" size={18} color={colors.tertiaryLabel} />
      ) : null}
    </>
  );
  if (!onPress) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel} style={[styles.row, inset]}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole={selected === undefined ? 'button' : 'radio'}
      accessibilityState={selected === undefined ? undefined : { checked: selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        inset,
        pressed ? { backgroundColor: colors.pressed } : null,
      ]}>
      {content}
    </Pressable>
  );
}

/** One choice of a few, shown as a row with a checkmark. Place it inside a ListGroup. */
export function Option({
  label,
  selected,
  onPress,
  chevron = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Shows a chevron when not selected, for an option that opens more choices. */
  chevron?: boolean;
}) {
  const colors = useColors();
  const inset = useRowInset();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        inset,
        pressed ? { backgroundColor: colors.pressed } : null,
      ]}>
      <AppText style={styles.rowTitle}>{label}</AppText>
      {selected ? (
        <Ionicons name="checkmark" size={22} color={colors.label} />
      ) : chevron ? (
        <Ionicons name="chevron-forward" size={18} color={colors.tertiaryLabel} />
      ) : null}
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
  const inset = useRowInset();
  return (
    <View style={[styles.row, inset]}>
      <AppText style={styles.rowTitle} importantForAccessibility="no" accessibilityElementsHidden>
        {label}
      </AppText>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.separator, true: colors.switchOn }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.separator}
        // The web version colors the "on" knob separately.
        {...({ activeThumbColor: '#FFFFFF' } as object)}
      />
    </View>
  );
}

/** A gray filled text field with its label inside, as in the iOS kit. */
function FieldBox({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.fieldGroup}>
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.groupedBackground,
            borderBottomColor: error ? colors.plum : colors.fieldLine,
            borderBottomWidth: error ? 3 : 1.5,
          },
        ]}>
        <AppText variant="footnote" importantForAccessibility="no" accessibilityElementsHidden>
          {label}
        </AppText>
        {children}
      </View>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </View>
  );
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string | null }) {
  const colors = useColors();
  return (
    <FieldBox label={label} error={error}>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.secondaryLabel}
        {...props}
        style={[type.body, styles.fieldInput, { color: colors.label }]}
      />
    </FieldBox>
  );
}

export function PasswordField({
  label,
  value,
  error,
  onChange,
  isNew = false,
}: {
  label: string;
  value: string;
  error?: string | null;
  onChange: (text: string) => void;
  isNew?: boolean;
}) {
  const colors = useColors();
  const [shown, setShown] = useState(false);
  return (
    <FieldBox label={label} error={error}>
      <View style={styles.passwordRow}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={isNew ? 'new-password' : 'current-password'}
          textContentType={isNew ? 'newPassword' : 'password'}
          secureTextEntry={!shown}
          value={value}
          onChangeText={onChange}
          style={[type.body, styles.fieldInput, styles.passwordInput, { color: colors.label }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={shown ? 'Hide password' : 'Show password'}
          onPress={() => setShown(!shown)}
          style={styles.showPassword}>
          <AppText variant="bodyBold" color={colors.link}>
            {shown ? 'Hide' : 'Show'}
          </AppText>
        </Pressable>
      </View>
    </FieldBox>
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
          {
            borderBottomColor: error ? colors.plum : colors.brand,
            borderBottomWidth: error ? 3 : 2,
          },
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
          style={[type.amountInput, styles.moneyInput, { color: colors.label }]}
        />
      </View>
      {error ? <ErrorText>{error}</ErrorText> : null}
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
              { backgroundColor: segment <= step ? colors.brand : colors.progressTrack },
            ]}
          />
        ))}
      </View>
      <AppText variant="footnote" muted>
        Step {step} of 4
      </AppText>
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
        style={[styles.check, { backgroundColor: colors.brand }]}>
        <Ionicons name="checkmark" size={48} color={colors.onBrand} />
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
      style={[styles.confirmation, { backgroundColor: colors.groupedBackground }]}>
      <View style={styles.confirmationMessage}>
        <AppText>{message}</AppText>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityHint={message}
          onPress={onAction}
          style={styles.confirmationAction}>
          <AppText color={colors.link}>{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  screen: { flexGrow: 1, paddingHorizontal: size.screenPadding, gap: space.xl },
  primary: {
    minHeight: size.buttonHeight,
    borderRadius: size.buttonHeight / 2,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  small: {
    minHeight: size.minTarget,
    borderRadius: radius.small,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glass: {
    width: size.glassButton,
    height: size.glassButton,
    borderRadius: size.glassButton / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  back: {
    minHeight: size.glassButton,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    alignSelf: 'flex-start',
  },
  chip: {
    minHeight: size.minTarget,
    borderRadius: radius.chip,
    paddingHorizontal: space.lg,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  group: { borderRadius: radius.group, overflow: 'hidden' },
  separator: { height: StyleSheet.hairlineWidth * 2 },
  row: {
    minHeight: size.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 11,
  },
  rowTitle: { flex: 1 },
  fieldGroup: { gap: space.sm },
  field: {
    borderTopLeftRadius: radius.field,
    borderTopRightRadius: radius.field,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    gap: 2,
  },
  fieldInput: { padding: 0, minHeight: 26 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  passwordInput: { flex: 1, minWidth: 0 },
  showPassword: {
    minHeight: size.minTarget,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moneyField: { flexDirection: 'row', alignItems: 'center', paddingBottom: space.sm },
  moneyInput: { flex: 1, padding: 0, minWidth: 0 },
  progress: { gap: space.md },
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
    borderRadius: radius.confirmation,
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
