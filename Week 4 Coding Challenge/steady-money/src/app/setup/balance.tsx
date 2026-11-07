import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MoneyFormScreen } from '@/components/forms';
import { StepProgress } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

export default function SetupBalance() {
  const { inputs, saveBalance, saveSetupStep } = useMoney();

  return (
    <MoneyFormScreen
      top={
        <View style={styles.top}>
          <StepProgress step={1} />
        </View>
      }
      title="How much is in your account?"
      helper="A rough number is fine. You can change it later."
      fieldLabel="Balance, in dollars"
      initialCents={inputs?.balanceCents ? inputs.balanceCents : null}
      allowZero
      buttonLabel="Save my balance"
      onSave={async (cents) => {
        await saveBalance(cents);
        await saveSetupStep('payday');
        router.replace('/setup/payday');
      }}
    />
  );
}

const styles = StyleSheet.create({ top: { gap: space.lg } });
