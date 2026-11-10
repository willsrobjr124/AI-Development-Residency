import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { COULD_NOT_SAVE, NEEDS_NUMBER, useSaveOnce } from '@/components/forms';
import {
  AppText,
  BackLink,
  Chip,
  Heading,
  MoneyField,
  PrimaryButton,
  Screen,
  Spacer,
} from '@/components/ui';
import { parseCents } from '@/domain/money';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

const CATEGORIES = ['Bills', 'Food', 'Fun', 'Transport', 'Other'];

export default function AddExpense() {
  const { addExpense } = useMoney();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  function save() {
    const parsed = parseCents(amount);
    if (!parsed.ok) {
      setError(NEEDS_NUMBER);
      return;
    }
    saveOnce(
      async () => {
        await addExpense(parsed.cents, category);
        router.back();
      },
      () => setError(COULD_NOT_SAVE),
    );
  }

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />

      <View style={styles.copy}>
        <Heading>How much did you spend?</Heading>
        <AppText muted>Picking a category is optional.</AppText>
      </View>

      <MoneyField
        label="Amount spent, in dollars"
        value={amount}
        error={error}
        onChange={(text) => {
          setAmount(text);
          setError(null);
        }}
        onSubmit={save}
      />

      <View style={styles.chips}>
        {CATEGORIES.map((name) => (
          <Chip
            key={name}
            label={name}
            selected={category === name}
            onPress={() => setCategory(category === name ? null : name)}
          />
        ))}
      </View>

      {category === 'Bills' ? (
        <AppText muted>If this pays a bill on your list, use Mark paid there instead.</AppText>
      ) : null}

      <Spacer />
      <PrimaryButton label="Add expense" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
