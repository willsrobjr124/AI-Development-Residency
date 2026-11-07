import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, BackLink, Heading, PrimaryButton, Row, Screen, Spacer } from '@/components/ui';
import { formatCents, spokenCents } from '@/domain/money';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

function amountText(cents: number): string {
  return cents < 0 ? `- ${formatCents(-cents)}` : formatCents(cents);
}

function amountSpoken(cents: number): string {
  return cents < 0 ? `minus ${spokenCents(-cents)}` : spokenCents(cents);
}

export default function Breakdown() {
  const { summary } = useMoney();
  if (!summary) return null;

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <Heading>How we worked out your number</Heading>

      <View>
        {summary.breakdown.map((line) => (
          <Row
            key={line.label}
            title={line.label}
            detail={amountText(line.amountCents)}
            accessibilityLabel={`${line.label}, ${amountSpoken(line.amountCents)}`}
            onPress={line.label === 'Spent since then' ? () => router.push('/recent') : undefined}
          />
        ))}
      </View>

      <View
        accessible
        accessibilityLabel={`Safe to spend, ${spokenCents(summary.safeCents)}`}
        style={styles.total}>
        <AppText variant="sentence" style={styles.label}>
          Safe to spend
        </AppText>
        <AppText variant="heading">{formatCents(summary.safeCents)}</AppText>
      </View>

      {summary.isShort ? (
        <AppText>Bills and savings need more than your balance, so your number stays at $0.</AppText>
      ) : null}

      <Spacer />
      <PrimaryButton label="Back to my number" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { flexShrink: 1 },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: space.sm,
  },
});
