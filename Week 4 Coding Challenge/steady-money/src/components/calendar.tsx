import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { longDate, monthGrid, monthTitle } from '@/domain/dates';
import { size, useColors } from '@/theme';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function parts(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

/**
 * A plain month grid. It works the same on Android and the web preview, reads well
 * with a screen reader, and needs no dragging.
 */
export function Calendar({
  value,
  minDate,
  onChange,
}: {
  value: string | null;
  minDate: string;
  onChange: (date: string) => void;
}) {
  const colors = useColors();
  const start = parts(value ?? minDate);
  const [{ year, month }, setShown] = useState({ year: start.year, month: start.month });

  function shift(by: number) {
    const index = year * 12 + (month - 1) + by;
    setShown({ year: Math.floor(index / 12), month: (index % 12) + 1 });
  }

  const min = parts(minDate);
  const canGoBack = year * 12 + month > min.year * 12 + min.month;

  return (
    <View style={styles.calendar}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          accessibilityState={{ disabled: !canGoBack }}
          disabled={!canGoBack}
          onPress={() => shift(-1)}
          style={[styles.nav, canGoBack ? null : styles.hidden]}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <AppText variant="bodyBold" accessibilityLiveRegion="polite">
          {monthTitle(year, month)}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => shift(1)}
          style={styles.nav}>
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.week} importantForAccessibility="no-hide-descendants">
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={styles.cell}>
            <AppText>{day}</AppText>
          </View>
        ))}
      </View>

      {monthGrid(year, month).map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((date, column) => {
            if (!date) return <View key={column} style={styles.cell} />;
            const selected = date === value;
            const disabled = date < minDate;
            if (disabled) {
              return (
                <View key={date} style={[styles.cell, styles.past]}>
                  <AppText>{parts(date).day}</AppText>
                </View>
              );
            }
            return (
              <Pressable
                key={date}
                accessibilityRole="button"
                accessibilityLabel={longDate(date)}
                accessibilityState={{ selected }}
                onPress={() => onChange(date)}
                style={[
                  styles.cell,
                  styles.day,
                  selected ? { backgroundColor: colors.button } : null,
                ]}>
                <AppText
                  variant={selected ? 'bodyBold' : 'body'}
                  color={selected ? colors.buttonText : colors.text}>
                  {parts(date).day}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: { gap: 2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nav: {
    width: size.minTarget,
    height: size.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: { opacity: 0 },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: {
    width: size.minTarget,
    height: size.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: { borderRadius: size.minTarget / 2 },
  past: { opacity: 0.45 },
});
