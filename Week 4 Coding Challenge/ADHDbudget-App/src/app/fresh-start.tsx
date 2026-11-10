import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Heading, PrimaryButton, Screen, Spacer, TextButton } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

export default function FreshStart() {
  const { dismissFreshStart } = useMoney();

  return (
    <Screen>
      <Spacer />
      <View style={styles.copy}>
        <Heading>Welcome back. Want a fresh start?</Heading>
        <AppText muted>
          Items without a category move to Other, and you&apos;ll check your balance is right.
        </AppText>
      </View>
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label="Start fresh" onPress={() => router.push('/fresh-start-balance')} />
        <TextButton
          label="Not now"
          onPress={() => {
            dismissFreshStart();
            router.replace('/');
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  actions: { gap: space.xxl },
});
