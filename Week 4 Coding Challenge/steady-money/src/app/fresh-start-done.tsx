import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppText, CheckCircle, PrimaryButton, Screen, Spacer } from '@/components/ui';

export default function FreshStartDone() {
  return (
    <Screen>
      <Spacer />
      <CheckCircle />
      <AppText variant="sentence" accessibilityRole="header" style={styles.center}>
        You&apos;re all set
      </AppText>
      <Spacer />
      <PrimaryButton label="Go to my number" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({ center: { textAlign: 'center' } });
