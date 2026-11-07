import { router, useLocalSearchParams } from 'expo-router';

import { MoneyFormScreen } from '@/components/forms';
import { BackLink } from '@/components/ui';
import type { MoveTarget } from '@/domain/rules';
import { moveLimitCents } from '@/domain/rules';
import { useMoney } from '@/hooks/use-money';

export default function MoveMoney() {
  const params = useLocalSearchParams<{ to: MoveTarget }>();
  const { summary, moveMoney, preferences, setPreference } = useMoney();
  if (!summary) return null;

  const to: MoveTarget = params.to === 'spending' ? 'spending' : 'savings';
  const name = to === 'savings' ? 'Savings' : 'Spending';
  const from = to === 'savings' ? 'Spending' : 'Savings';

  return (
    <MoneyFormScreen
      top={<BackLink onPress={() => router.back()} />}
      title={`Move money to ${name}`}
      helper={`This comes out of your ${from} bucket. You can undo it.`}
      fieldLabel={`Amount to move to ${name}, in dollars`}
      maxCents={moveLimitCents(to, summary.buckets)}
      maxLabel={`Your ${from} bucket has`}
      buttonLabel={(amount) => (amount ? `Move ${amount} to ${name}` : `Move to ${name}`)}
      onSave={async (cents) => {
        await moveMoney(to, cents);
        if (!preferences.bucketHintSeen) await setPreference('bucketHintSeen', true);
        router.back();
      }}
    />
  );
}
