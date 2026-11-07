import { router, useLocalSearchParams } from 'expo-router';

import { MoneyFormScreen } from '@/components/forms';
import { BackLink } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';

export default function EditBalance() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { summary, saveBalance } = useMoney();
  if (!summary) return null;

  const afterPayday = next === 'payday';

  return (
    <MoneyFormScreen
      top={<BackLink onPress={() => router.back()} />}
      title={afterPayday ? "What's in your account now?" : 'How much is in your account?'}
      helper="A rough number is fine. You can change it later."
      fieldLabel="Balance, in dollars"
      initialCents={summary.availableCents}
      allowZero
      buttonLabel="Save my balance"
      onSave={async (cents) => {
        await saveBalance(cents);
        if (afterPayday) router.replace('/edit-payday');
        else router.back();
      }}
    />
  );
}
