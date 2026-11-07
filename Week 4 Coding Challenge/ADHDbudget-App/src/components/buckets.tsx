import { useIsFocused } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { AppText, Row } from '@/components/ui';
import { formatCents, spokenCents } from '@/domain/money';
import type { MoneySummary } from '@/domain/safeToSpend';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion, radius, size, space, useColors } from '@/theme';

const EASE_IN_OUT = cubicBezier(0.77, 0, 0.175, 1);

type BucketInfo = { name: string; cents: number; fill: string; onPress: () => void; hint: string };

function levelHeight(cents: number, totalCents: number): number {
  if (cents <= 0 || totalCents <= 0) return 0;
  const inner = size.jarHeight - 3;
  return Math.max((cents / totalCents) * inner, size.jarMinLevel);
}

function Bucket({ bucket, totalCents }: { bucket: BucketInfo; totalCents: number }) {
  const colors = useColors();
  const reduced = useReducedMotion();
  const focused = useIsFocused();
  const target = levelHeight(bucket.cents, totalCents);
  // The level waits until home is back in view, or the move would finish out of sight.
  const [height, setHeight] = useState(target);
  if (focused && height !== target) setHeight(target);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${bucket.name} bucket, ${spokenCents(bucket.cents)}`}
      accessibilityHint={bucket.hint}
      onPress={bucket.onPress}
      style={({ pressed }) => [styles.bucket, pressed ? styles.pressed : null]}>
      <View style={[styles.jar, { borderColor: colors.text }]}>
        <Animated.View
          style={[
            styles.level,
            { height, backgroundColor: bucket.fill, borderTopColor: colors.text },
            bucket.name === 'Savings' && height > 0 ? styles.levelEdge : null,
            reduced
              ? null
              : {
                  transitionProperty: 'height',
                  transitionDuration: motion.fill,
                  transitionTimingFunction: EASE_IN_OUT,
                },
          ]}
        />
      </View>
      <View style={styles.labels}>
        <AppText>{bucket.name}</AppText>
        <AppText variant="bodyBold">{formatCents(bucket.cents, { wholeDollars: true })}</AppText>
      </View>
    </Pressable>
  );
}

export function Buckets({
  summary,
  onSpending,
  onBills,
  onSavings,
}: {
  summary: MoneySummary;
  onSpending: () => void;
  onBills: () => void;
  onSavings: () => void;
}) {
  const colors = useColors();
  const { fontScale } = useWindowDimensions();
  const { spendingCents, billsCents, savingsCents } = summary.buckets;
  const buckets: BucketInfo[] = [
    {
      name: 'Spending',
      cents: spendingCents,
      fill: colors.bucketSpending,
      onPress: onSpending,
      hint: 'Moves money to Savings',
    },
    {
      name: 'Bills',
      cents: billsCents,
      fill: colors.bucketBills,
      onPress: onBills,
      hint: 'Shows your bills',
    },
    {
      name: 'Savings',
      cents: savingsCents,
      fill: colors.bucketSavings,
      onPress: onSavings,
      hint: 'Moves money to Spending',
    },
  ];

  if (fontScale > size.stackBucketsAt) {
    return (
      <View>
        {buckets.map((bucket) => (
          <Row
            key={bucket.name}
            title={bucket.name}
            detail={formatCents(bucket.cents, { wholeDollars: true })}
            accessibilityLabel={`${bucket.name} bucket, ${spokenCents(bucket.cents)}`}
            onPress={bucket.onPress}
          />
        ))}
      </View>
    );
  }

  const totalCents = spendingCents + billsCents + savingsCents;
  return (
    <View style={styles.buckets}>
      {buckets.map((bucket) => (
        <Bucket key={bucket.name} bucket={bucket} totalCents={totalCents} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  buckets: { flexDirection: 'row', gap: space.md },
  bucket: { flex: 1, gap: 10 },
  pressed: { opacity: 0.7 },
  jar: {
    height: size.jarHeight,
    borderWidth: 1.5,
    borderRadius: radius.jar,
    overflow: 'hidden',
  },
  level: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  levelEdge: { borderTopWidth: 1.5 },
  labels: { alignItems: 'center' },
});
