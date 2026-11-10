import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Calendar } from '@/components/calendar';
import { COULD_NOT_SAVE, NEEDS_NUMBER, useSaveOnce } from '@/components/forms';
import {
  AppText,
  ErrorText,
  BackLink,
  Field,
  Heading,
  ListGroup,
  PrimaryButton,
  Screen,
  Spacer,
  SwitchRow,
} from '@/components/ui';
import { longDate, today } from '@/domain/dates';
import { parseCents } from '@/domain/money';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

type Errors = { name?: string; amount?: string; date?: string; save?: string };

export default function AddBill() {
  const { addBill } = useMoney();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [repeatsMonthly, setRepeatsMonthly] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const saveOnce = useSaveOnce();

  function save() {
    const parsed = parseCents(amount);
    const next: Errors = {};
    if (!name.trim()) next.name = 'Give this bill a name, like Internet';
    if (!parsed.ok) next.amount = NEEDS_NUMBER;
    if (!dueDate) next.date = 'Pick the day this bill is due';
    setErrors(next);
    if (!parsed.ok || !dueDate || !name.trim()) return;

    saveOnce(
      async () => {
        await addBill({
          name: name.trim(),
          amountCents: parsed.cents,
          dueDate,
          repeatsMonthly,
        });
        router.back();
      },
      () => setErrors({ save: COULD_NOT_SAVE }),
    );
  }

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <Heading>Add a bill</Heading>

      <View style={styles.fields}>
        <Field
          label="Bill name"
          autoFocus
          value={name}
          error={errors.name}
          onChangeText={(text) => {
            setName(text);
            setErrors({ ...errors, name: undefined });
          }}
        />
        <Field
          label="Amount"
          inputMode="decimal"
          keyboardType="decimal-pad"
          value={amount}
          error={errors.amount}
          onChangeText={(text) => {
            setAmount(text);
            setErrors({ ...errors, amount: undefined });
          }}
        />
        <View style={styles.date}>
          <AppText variant="footnote" muted>
            Due date
          </AppText>
          <AppText accessibilityLiveRegion="polite">
            {dueDate ? longDate(dueDate) : 'Pick a day below'}
          </AppText>
          <Calendar
            value={dueDate}
            minDate={today()}
            onChange={(date) => {
              setDueDate(date);
              setErrors({ ...errors, date: undefined });
            }}
          />
          {errors.date ? (
            <ErrorText>{errors.date}</ErrorText>
          ) : null}
        </View>
        <ListGroup>
          <SwitchRow label="Every month" value={repeatsMonthly} onChange={setRepeatsMonthly} />
        </ListGroup>
      </View>

      {errors.save ? (
        <ErrorText>{errors.save}</ErrorText>
      ) : null}

      <Spacer />
      <PrimaryButton label="Save bill" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.lg },
  date: { gap: space.xs },
});
