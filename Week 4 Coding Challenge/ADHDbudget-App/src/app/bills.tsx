import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import {
  AppText,
  BackLink,
  Confirmation,
  Heading,
  ListGroup,
  ListItem,
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
import { motion, space } from '@/theme';

export default function Bills() {
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
        <AppText muted>
          {soon.length ? 'Due in the next 7 days.' : 'You can add one any time.'}
        </AppText>
      </View>

      {soon.length ? (
        <ListGroup plain>
          {soon.map((bill) => (
            <Animated.View
              key={bill.id}
              exiting={reduced ? undefined : FadeOut.duration(motion.exit)}
              layout={reduced ? undefined : LinearTransition.duration(motion.enter)}>
              <ListItem style={styles.bill}>
                <View
                  accessible
                  accessibilityLabel={`${bill.name}, ${spokenCents(bill.amountCents)}, ${bill.countdown}`}
                  style={styles.billText}>
                  <AppText>
                    {bill.name}, {formatCents(bill.amountCents)}
                  </AppText>
                  <AppText variant="footnote" muted>
                    {bill.countdown}
                  </AppText>
                </View>
                <SmallButton
                  label="Mark paid"
                  accessibilityLabel={`Mark ${bill.name} bill paid`}
                  onPress={() => markBillPaid(bill)}
                />
              </ListItem>
            </Animated.View>
          ))}
        </ListGroup>
      ) : null}

      {later.length ? (
        <View style={styles.later}>
          <AppText accessibilityRole="header">Later on</AppText>
          <ListGroup>
            {later.map((bill) => (
              <Row
                key={bill.id}
                title={`${bill.name}, ${formatCents(bill.amountCents)}`}
                detail={shortDate(bill.dueDate)}
                accessibilityLabel={`${bill.name}, ${spokenCents(bill.amountCents)}, due ${shortDate(bill.dueDate)}`}
              />
            ))}
          </ListGroup>
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
  later: { gap: space.sm },
  bill: { minHeight: 64, flexWrap: 'wrap', justifyContent: 'space-between' },
  billText: { flexShrink: 1 },
});
