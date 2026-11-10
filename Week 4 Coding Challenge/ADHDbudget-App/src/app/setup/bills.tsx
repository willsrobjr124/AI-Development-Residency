import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  BackLink,
  Confirmation,
  Heading,
  ListGroup,
  PrimaryButton,
  Row,
  Screen,
  Spacer,
  StepProgress,
  TextButton,
} from '@/components/ui';
import { shortDate } from '@/domain/dates';
import { formatCents, spokenCents } from '@/domain/money';
import { useMoney } from '@/hooks/use-money';
import { space } from '@/theme';

export default function SetupBills() {
  const { inputs, saveSetupStep, notice, clearNotice } = useMoney();

  useFocusEffect(useCallback(() => clearNotice, [clearNotice]));

  async function next() {
    await saveSetupStep('savings');
    router.replace('/setup/savings');
  }

  return (
    <Screen>
      <View style={styles.top}>
        <BackLink
          onPress={async () => {
            await saveSetupStep('payday');
            router.replace('/setup/payday');
          }}
        />
        <StepProgress step={3} />
      </View>

      <View style={styles.copy}>
        <Heading>Which bills are due before payday?</Heading>
        <AppText muted>Start with the big ones. You can add more later.</AppText>
      </View>

      <ListGroup>
        {inputs?.unpaidBills.map((bill) => (
          <Row
            key={bill.id}
            title={`${bill.name}, due ${shortDate(bill.dueDate)}`}
            detail={formatCents(bill.amountCents)}
            accessibilityLabel={`${bill.name}, ${spokenCents(bill.amountCents)}, due ${shortDate(bill.dueDate)}`}
          />
        ))}
        <Row title="Add a bill" onPress={() => router.push('/add-bill')} />
      </ListGroup>

      <Spacer />

      {notice ? (
        <Confirmation
          message={notice.message}
          actionLabel={notice.actionLabel}
          onAction={notice.action}
        />
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton label="Save my bills" onPress={next} />
        <TextButton label="Skip for now" onPress={next} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { gap: space.lg },
  copy: { gap: space.md },
  actions: { gap: space.sm },
});
