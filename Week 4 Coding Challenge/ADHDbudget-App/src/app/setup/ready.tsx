import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppText, CheckCircle, PrimaryButton, Screen, Spacer } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';

export default function SetupReady() {
  const { saveSetupStep } = useMoney();

  return (
    <Screen>
      <Spacer />
      <CheckCircle />
      <AppText variant="sentence" accessibilityRole="header" style={styles.center}>
        Your number is ready
      </AppText>
      <Spacer />
      <PrimaryButton
        label="Show my number"
        onPress={async () => {
          await saveSetupStep('done');
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ center: { textAlign: 'center' } });
