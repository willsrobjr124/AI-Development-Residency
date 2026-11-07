import { router } from 'expo-router';

import { PaydayFormScreen } from '@/components/forms';
import { BackLink } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';

export default function EditPayday() {
  const { inputs, savePayday } = useMoney();
  if (!inputs) return null;

  return (
    <PaydayFormScreen
      top={<BackLink onPress={() => router.back()} />}
      title="When do you get paid next?"
      helper="Your number will cover the days until then."
      initialDate={inputs.nextPayday}
      buttonLabel="Save my payday"
      onSave={async (date) => {
        await savePayday(date);
        router.back();
      }}
    />
  );
}
