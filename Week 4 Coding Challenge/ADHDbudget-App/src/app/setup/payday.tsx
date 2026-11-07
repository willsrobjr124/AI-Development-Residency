import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PaydayFormScreen } from '@/components/forms';
import { BackLink, StepProgress } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

export default function SetupPayday() {
  const { inputs, savePayday, saveSetupStep } = useMoney();

  return (
    <PaydayFormScreen
      top={
        <View style={styles.top}>
          <BackLink
            onPress={async () => {
              await saveSetupStep('balance');
              router.replace('/setup/balance');
            }}
          />
          <StepProgress step={2} />
        </View>
      }
      title="When do you get paid next?"
      helper="Your number will cover the days until then."
      initialDate={inputs?.nextPayday}
      buttonLabel="Save my payday"
      onSave={async (date) => {
        await savePayday(date);
        await saveSetupStep('bills');
        router.replace('/setup/bills');
      }}
    />
  );
}

const styles = StyleSheet.create({ top: { gap: space.lg } });
