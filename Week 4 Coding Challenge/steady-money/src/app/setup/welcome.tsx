import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Heading, PrimaryButton, Screen, Spacer } from '@/components/ui';
import { useMoney } from '@/hooks/use-money';
import { radius, space, useColors } from '@/theme';

function Jar({ level, fill }: { level: number; fill: string }) {
  const colors = useColors();
  return (
    <View style={[styles.jar, { borderColor: colors.text }]}>
      <View style={[styles.level, { height: level, backgroundColor: fill }]} />
    </View>
  );
}

export default function Welcome() {
  const colors = useColors();
  const { saveSetupStep } = useMoney();

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
        <AppText>Four short steps. You can change anything later.</AppText>
      </View>
      <Spacer />
      <PrimaryButton
        label="Get started"
        onPress={async () => {
          await saveSetupStep('balance');
          router.replace('/setup/balance');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  jars: { flexDirection: 'row', justifyContent: 'center', gap: space.md },
  jar: {
    width: 72,
    height: 120,
    borderWidth: 1.5,
    borderRadius: radius.control,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  level: { width: '100%' },
});
