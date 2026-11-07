import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import {
  AppText,
  BackLink,
  Confirmation,
  Heading,
  PrimaryButton,
  Row,
  Screen,
  SmallButton,
  Spacer,
} from '@/components/ui';
import { shortDate } from '@/domain/dates';
import { formatCents, spokenCents } from '@/domain/money';
import { billCountdown } from '@/domain/safeToSpend';
import { useMoney } from '@/hooks/use-money';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion, space, useColors } from '@/theme';

export default function Bills() {
  const colors = useColors();
  const reduced = useReducedMotion();
  const { inputs, markBillPaid, notice, clearNotice } = useMoney();

  useFocusEffect(useCallback(() => clearNotice, [clearNotice]));

  if (!inputs) return null;

  const soon = billCountdown(inputs.unpaidBills, inputs.today);
  const soonIds = new Set(soon.map((bill) => bill.id));
  const later = inputs.unpaidBills.filter((bill) => !soonIds.has(bill.id));

  return (
    <Screen>
      <BackLink label="Home" onPress={() => router.back()} />

      <View style={styles.copy}>
        <Heading>{soon.length ? 'Bills coming up' : 'No bills in the next 7 days'}</Heading>
        <AppText>{soon.length ? 'Due in the next 7 days.' : 'You can add one any time.'}</AppText>
      </View>

      {soon.length ? (
        <View>
          {soon.map((bill) => (
            <Animated.View
              key={bill.id}
              exiting={reduced ? undefined : FadeOut.duration(motion.exit)}
              layout={reduced ? undefined : LinearTransition.duration(motion.enter)}
              style={[styles.bill, { borderBottomColor: colors.line }]}>
              <View
                accessible
                accessibilityLabel={`${bill.name}, ${spokenCents(bill.amountCents)}, ${bill.countdown}`}
                style={styles.billText}>
                <AppText variant="bodyBold">
                  {bill.name}, {formatCents(bill.amountCents)}
                </AppText>
                <AppText>{bill.countdown}</AppText>
              </View>
              <SmallButton
                label="Mark paid"
                accessibilityLabel={`Mark ${bill.name} bill paid`}
                onPress={() => markBillPaid(bill)}
              />
            </Animated.View>
          ))}
        </View>
      ) : null}

      {later.length ? (
        <View style={styles.later}>
          <AppText variant="bodyBold" accessibilityRole="header">
            Later on
          </AppText>
          <View>
            {later.map((bill) => (
              <Row
                key={bill.id}
                title={`${bill.name}, ${formatCents(bill.amountCents)}`}
                detail={shortDate(bill.dueDate)}
                accessibilityLabel={`${bill.name}, ${spokenCents(bill.amountCents)}, due ${shortDate(bill.dueDate)}`}
              />
            ))}
          </View>
        </View>
      ) : null}

      <Spacer />

      {notice ? (
        <Confirmation
          message={notice.message}
          actionLabel={notice.actionLabel}
          onAction={notice.action}
        />
      ) : null}

      <PrimaryButton label="Add a bill" onPress={() => router.push('/add-bill')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  later: { gap: space.xs },
  bill: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: space.md,
    borderBottomWidth: 1,
    paddingVertical: space.sm,
  },
  billText: { flexShrink: 1 },
});
