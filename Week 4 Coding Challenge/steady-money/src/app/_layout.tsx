import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
  useFonts,
} from '@expo-google-fonts/atkinson-hyperlegible';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrivacyGate } from '@/components/privacy-gate';
import { AppText, Heading } from '@/components/ui';
import { MoneyProvider, useMoney } from '@/hooks/use-money';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { size, useColors } from '@/theme';

SplashScreen.preventAutoHideAsync();

function Navigator() {
  const colors = useColors();
  const reduced = useReducedMotion();
  const { status } = useMoney();
  const [fontsLoaded, fontError] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });
  const ready = (fontsLoaded || fontError !== null) && status !== 'loading';

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  if (status === 'error') {
    return (
      <View style={[styles.error, { backgroundColor: colors.background }]}>
        <Heading>We couldn&apos;t open your budget just now</Heading>
        <AppText>Your money is safe. Close the app and open it again.</AppText>
      </View>
    );
  }

  const none = reduced ? ({ animation: 'none' } as const) : {};

  return (
    <PrivacyGate>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          ...none,
        }}>
        <Stack.Screen name="index" options={{ animation: reduced ? 'none' : 'fade' }} />
        <Stack.Screen
          name="add-expense"
          options={{ animation: reduced ? 'none' : 'slide_from_bottom' }}
        />
      </Stack>
    </PrivacyGate>
  );
}

export default function RootLayout() {
  return (
    <MoneyProvider>
      <StatusBar style="auto" />
      <Navigator />
    </MoneyProvider>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, justifyContent: 'center', padding: size.screenPadding, gap: 12 },
});
