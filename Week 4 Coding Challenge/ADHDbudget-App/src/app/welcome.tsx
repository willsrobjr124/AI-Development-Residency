import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Heading, PrimaryButton, Screen, Spacer, TextButton } from '@/components/ui';
import { radius, space, useColors } from '@/theme';

function Jar({ level, fill }: { level: number; fill: string }) {
  const colors = useColors();
  return (
    <View style={[styles.jar, { borderColor: colors.jarBorder }]}>
      <View style={[styles.level, { height: level, backgroundColor: fill }]} />
    </View>
  );
}

export default function Welcome() {
  const colors = useColors();

  return (
    <Screen>
      <Spacer />
      <View style={styles.jars} importantForAccessibility="no-hide-descendants">
        <Jar level={45} fill={colors.bucketSpending} />
        <Jar level={90} fill={colors.bucketBills} />
        <Jar level={26} fill={colors.bucketSavings} />
      </View>
      <View style={styles.copy}>
        <Heading>See what&apos;s safe to spend, at a glance</Heading>
        <AppText muted>Make an account, then four short steps. You can change anything later.</AppText>
      </View>
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label="Get started" onPress={() => router.push('/sign-up')} />
        <TextButton label="I already have an account" onPress={() => router.push('/log-in')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  actions: { gap: space.sm },
  jars: { flexDirection: 'row', justifyContent: 'center', gap: space.md },
  jar: {
    width: 72,
    height: 120,
    borderWidth: 1.5,
    borderRadius: radius.jar,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  level: { width: '100%' },
});
