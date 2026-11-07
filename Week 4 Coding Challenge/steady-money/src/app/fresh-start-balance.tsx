import { router } from 'expo-router';

import { MoneyFormScreen } from '@/components/forms';
import { BackLink } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';

export default function FreshStartBalance() {
  const { summary, startFresh } = useMoney();
  if (!summary) return null;

  return (
    <MoneyFormScreen
      top={<BackLink onPress={() => router.back()} />}
      title="Is this still your balance?"
      helper="A rough number is fine. Change it if you need to."
      fieldLabel="Balance, in dollars"
      initialCents={summary.availableCents}
      allowZero
      buttonLabel="Use this balance"
      onSave={async (cents) => {
        await startFresh(cents);
        router.replace('/fresh-start-done');
      }}
    />
  );
}
