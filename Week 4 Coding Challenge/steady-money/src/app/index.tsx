import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router, useFocusEffect, type Href } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Buckets } from '@/components/buckets';
import { AppText, Confirmation, PrimaryButton, Row, Screen, Spacer } from '@/components/ui';
import { untilLabel } from '@/domain/dates';
import { formatCents, spokenCents } from '@/domain/money';
import { nextBillLine, paydayHasPassed } from '@/domain/safeToSpend';
import { useMoney } from '@/hooks/use-money';
import { size, space, useColors } from '@/theme';

/** The number is already very large, so it stops growing here and stays on one line. */
const NUMBER_MAX_SCALE = 1.3;

export default function Home() {
  const colors = useColors();
  const { inputs, summary, notice, clearNotice, setupStep, offerFreshStart, preferences } =
    useMoney();

  // A confirmation belongs to this screen, so it goes when the person leaves.
  useFocusEffect(useCallback(() => clearNotice, [clearNotice]));

  if (setupStep !== 'done') return <Redirect href={`/setup/${setupStep}` as Href} />;
  if (offerFreshStart) return <Redirect href="/fresh-start" />;
  if (!inputs || !summary) return null;

  const until = untilLabel(inputs.nextPayday, inputs.today);
  const paydayPassed = paydayHasPassed(inputs.nextPayday, inputs.today);

  return (
    <Screen>
      <View style={styles.sentence}>
        <View style={styles.topRow}>
          <AppText
            variant="sentence"
            importantForAccessibility="no"
            accessibilityElementsHidden
            style={styles.flex}>
            You can safely spend
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => router.push('/settings')}
            style={styles.icon}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.numberRow}>
          <AppText
            variant="number"
            accessibilityRole="header"
            accessibilityLabel={`You can safely spend ${spokenCents(summary.safeCents)} ${until}`}
            maxFontSizeMultiplier={NUMBER_MAX_SCALE}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.number}>
            {formatCents(summary.safeCents)}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Help: how your number was worked out"
            onPress={() => router.push('/breakdown')}
            style={styles.icon}>
            <Ionicons name="help-circle-outline" size={26} color={colors.text} />
          </Pressable>
        </View>
        <AppText variant="sentence" importantForAccessibility="no" accessibilityElementsHidden>
          {until}
        </AppText>
      </View>

      <Buckets
        summary={summary}
        onSpending={() => router.push('/move-money?to=savings')}
        onBills={() => router.push('/bills')}
        onSavings={() => router.push('/move-money?to=spending')}
      />

      <View style={styles.below}>
        {summary.isShort ? (
          <AppText>Bills coming up use all of this period&apos;s money.</AppText>
        ) : !preferences.bucketHintSeen ? (
          <AppText>Tap a bucket to move money between them.</AppText>
        ) : null}
        <Row
          title={nextBillLine(inputs.unpaidBills, inputs.today)}
          accessibilityLabel={`${nextBillLine(inputs.unpaidBills, inputs.today)}. See your bills`}
          onPress={() => router.push('/bills')}
          divider={false}
        />
      </View>

      <Spacer />

      {paydayPassed ? (
        <Confirmation
          message="Payday has passed. Let's update your number."
          actionLabel="Update"
          onAction={() => router.push('/edit-balance?next=payday')}
        />
      ) : null}

      {notice ? (
        <Confirmation
          message={notice.message}
          actionLabel={notice.actionLabel}
          onAction={notice.action}
        />
      ) : null}

      <PrimaryButton label="Add expense" onPress={() => router.push('/add-expense')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sentence: { gap: 2 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  number: { flexShrink: 1 },
  below: { gap: space.xs },
  icon: {
    width: size.minTarget,
    height: size.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
