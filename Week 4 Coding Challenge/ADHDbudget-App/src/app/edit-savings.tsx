import { router } from 'expo-router';

import { MoneyFormScreen } from '@/components/forms';
import { BackLink } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';

export default function EditSavings() {
  const { summary, saveSavings } = useMoney();
  if (!summary) return null;

  return (
    <MoneyFormScreen
      top={<BackLink onPress={() => router.back()} />}
      title="How much is set aside?"
      helper="Any amount counts, and $0 is fine too."
      fieldLabel="Savings, in dollars"
      initialCents={summary.savingsCents}
      allowZero
      buttonLabel="Save my savings"
      onSave={async (cents) => {
        await saveSavings(cents);
        router.back();
      }}
    />
  );
}
