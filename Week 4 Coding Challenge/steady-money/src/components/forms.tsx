import { useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Calendar } from '@/components/calendar';
import {
  AppText,
  Heading,
  MoneyField,
  Option,
  PrimaryButton,
  Screen,
  Spacer,
  TextButton,
} from '@/components/ui';
import { today } from '@/domain/dates';
import { centsToInput, formatCents, parseCents } from '@/domain/money';
import { nextFridays } from '@/domain/rules';
import { space } from '@/theme';

export const NEEDS_NUMBER = 'That amount needs a number, like 12.50';
export const COULD_NOT_SAVE = "We couldn't save that just now. Your money is safe, so try again.";

/** Keeps a slow save from running twice if the button is tapped again. */
export function useSaveOnce() {
  const saving = useRef(false);
  return async (task: () => Promise<void>, onError: (error: unknown) => void) => {
    if (saving.current) return;
    saving.current = true;
    try {
      await task();
    } catch (error) {
      onError(error);
    } finally {
      saving.current = false;
    }
  };
}

/** One amount on a screen: setup, editing, moving money and fresh start all share this. */
export function MoneyFormScreen({
  top,
  title,
  helper,
  fieldLabel,
  initialCents,
  allowZero = false,
  maxCents,
  maxLabel,
  buttonLabel,
  skip,
  onSave,
}: {
  top?: ReactNode;
  title: string;
  helper?: string;
  fieldLabel: string;
  initialCents?: number | null;
  allowZero?: boolean;
  maxCents?: number;
  maxLabel?: string;
  buttonLabel: string | ((text: string) => string);
  skip?: { label: string; onPress: () => void };
  onSave: (cents: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState(
    initialCents === null || initialCents === undefined ? '' : centsToInput(initialCents),
  );
  const [error, setError] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  function save() {
    const parsed = parseCents(amount, { allowZero });
    if (!parsed.ok) {
      setError(NEEDS_NUMBER);
      return;
    }
    if (maxCents !== undefined && parsed.cents > maxCents) {
      setError(`${maxLabel ?? 'The most you can use here is'} ${formatCents(maxCents)}`);
      return;
    }
    saveOnce(
      () => onSave(parsed.cents),
      () => setError(COULD_NOT_SAVE),
    );
  }

  const parsed = parseCents(amount);
  const label =
    typeof buttonLabel === 'string'
      ? buttonLabel
      : buttonLabel(parsed.ok ? formatCents(parsed.cents) : '');

  return (
    <Screen>
      {top}
      <View style={styles.copy}>
        <Heading>{title}</Heading>
        {helper ? <AppText>{helper}</AppText> : null}
      </View>
      <MoneyField
        label={fieldLabel}
        value={amount}
        error={error}
        onChange={(text) => {
          setAmount(text);
          setError(null);
        }}
        onSubmit={save}
      />
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label={label} onPress={save} />
        {skip ? <TextButton label={skip.label} onPress={skip.onPress} /> : null}
      </View>
    </Screen>
  );
}

type PaydayChoice = 'first' | 'second' | 'pick';

export function PaydayFormScreen({
  top,
  title,
  helper,
  initialDate,
  buttonLabel,
  onSave,
}: {
  top?: ReactNode;
  title: string;
  helper: string;
  initialDate?: string | null;
  buttonLabel: string;
  onSave: (date: string) => Promise<void>;
}) {
  const day = today();
  const fridays = nextFridays(day);
  const usable = initialDate && initialDate >= day ? initialDate : null;
  const startChoice: PaydayChoice | null =
    usable === fridays.first
      ? 'first'
      : usable === fridays.second
        ? 'second'
        : usable
          ? 'pick'
          : null;

  const [choice, setChoice] = useState<PaydayChoice | null>(startChoice);
  const [picked, setPicked] = useState<string | null>(startChoice === 'pick' ? usable : null);
  const [error, setError] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  const date =
    choice === 'first'
      ? fridays.first
      : choice === 'second'
        ? fridays.second
        : choice === 'pick'
          ? picked
          : null;

  function save() {
    if (!date) {
      setError('Pick a day, and your number will cover the days until then.');
      return;
    }
    saveOnce(
      () => onSave(date),
      () => setError(COULD_NOT_SAVE),
    );
  }

  function choose(next: PaydayChoice) {
    setChoice(next);
    setError(null);
  }

  return (
    <Screen>
      {top}
      <View style={styles.copy}>
        <Heading>{title}</Heading>
        <AppText>{helper}</AppText>
      </View>
      <View style={styles.options}>
        <Option label="This Friday" selected={choice === 'first'} onPress={() => choose('first')} />
        <Option label="Next Friday" selected={choice === 'second'} onPress={() => choose('second')} />
        <Option label="Pick a date" selected={choice === 'pick'} onPress={() => choose('pick')} />
      </View>
      {choice === 'pick' ? (
        <Calendar
          value={picked}
          minDate={day}
          onChange={(next) => {
            setPicked(next);
            setError(null);
          }}
        />
      ) : null}
      {error ? (
        <AppText variant="bodyBold" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      <Spacer />
      <PrimaryButton label={buttonLabel} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  options: { gap: space.md },
  actions: { gap: space.sm },
});
