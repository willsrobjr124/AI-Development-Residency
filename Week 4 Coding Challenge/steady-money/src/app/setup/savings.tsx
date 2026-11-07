import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MoneyFormScreen } from '@/components/forms';
import { BackLink, StepProgress } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

export default function SetupSavings() {
  const { inputs, saveSavings, saveSetupStep } = useMoney();

  async function finish() {
    await saveSetupStep('ready');
    router.replace('/setup/ready');
  }

  return (
    <MoneyFormScreen
      top={
        <View style={styles.top}>
          <BackLink
            onPress={async () => {
              await saveSetupStep('bills');
              router.replace('/setup/bills');
            }}
          />
          <StepProgress step={4} />
        </View>
      }
      title="Want to set some money aside?"
      helper="Any amount counts, and $0 is fine too."
      fieldLabel="Savings, in dollars"
      initialCents={inputs?.savingsCents ? inputs.savingsCents : null}
      allowZero
      buttonLabel="See my number"
      skip={{ label: 'Skip for now', onPress: finish }}
      onSave={async (cents) => {
        await saveSavings(cents);
        await finish();
      }}
    />
  );
}

const styles = StyleSheet.create({ top: { gap: space.lg } });
