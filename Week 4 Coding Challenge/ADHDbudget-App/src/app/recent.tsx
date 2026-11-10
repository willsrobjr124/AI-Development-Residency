import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  BackLink,
  Confirmation,
  Heading,
  ListGroup,
  ListItem,
  Screen,
  SmallButton,
  Spacer,
} from '@/components/ui';
import { shortDate } from '@/domain/dates';
import { formatCents, spokenCents } from '@/domain/money';
import { useMoney } from '@/hooks/use-money';
import type { RecentExpense } from '@/data/repo';


export default function Recent() {
  const { inputs, listRecent, removeExpense, notice, clearNotice } = useMoney();
  const [expenses, setExpenses] = useState<RecentExpense[] | null>(null);
  const [failed, setFailed] = useState(false);

  // Reloads when the list opens and after any change, including Undo.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      listRecent()
        .then((list) => {
          if (active) setExpenses(list);
        })
        .catch(() => {
          if (active) setFailed(true);
        });
      return () => {
        active = false;
      };
      // inputs changes after every save, so the list stays in step with the number.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listRecent, inputs]),
  );

  useFocusEffect(useCallback(() => clearNotice, [clearNotice]));

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <Heading>Recent spending</Heading>

      {failed ? (
        <AppText muted>We couldn&apos;t load this just now. Your money is safe.</AppText>
      ) : null}

      {expenses && expenses.length === 0 ? <AppText muted>Nothing added yet.</AppText> : null}

      <ListGroup>
        {expenses?.map((expense) => {
          const title = `${expense.category ?? 'No category'}, ${formatCents(expense.amountCents)}`;
          const when = shortDate(expense.createdAt.slice(0, 10));
          return (
            <ListItem key={expense.id} style={styles.row}>
              <View
                accessible
                accessibilityLabel={`${expense.category ?? 'No category'}, ${spokenCents(expense.amountCents)}, ${when}`}
                style={styles.text}>
                <AppText>{title}</AppText>
                <AppText variant="subhead" muted>
                  {when}
                </AppText>
              </View>
              <SmallButton
                label="Remove"
                tone="plum"
                outlined={false}
                accessibilityLabel={`Remove ${title}`}
                onPress={() => removeExpense(expense.id)}
              />
            </ListItem>
          );
        })}
      </ListGroup>

      <Spacer />

      {notice ? (
        <Confirmation
          message={notice.message}
          actionLabel={notice.actionLabel}
          onAction={notice.action}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 64, justifyContent: 'space-between' },
  text: { flexShrink: 1 },
});
