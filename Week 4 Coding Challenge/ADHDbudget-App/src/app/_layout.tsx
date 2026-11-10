import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrivacyGate } from '@/components/privacy-gate';
import { AppText, Heading, PrimaryButton } from '@/components/ui';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { MoneyProvider, useMoney } from '@/hooks/use-money';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { size, useColors } from '@/theme';

SplashScreen.preventAutoHideAsync();

const SIGNED_OUT_SCREENS = [
  'welcome',
  'sign-up',
  'verify-email',
  'log-in',
  'forgot-password',
  'new-password',
];

const SIGNED_IN_SCREENS = [
  'breakdown',
  'move-money',
  'bills',
  'add-bill',
  'recent',
  'settings',
  'account',
  'log-out',
  'delete-account',
  'edit-balance',
  'edit-payday',
  'edit-savings',
  'fresh-start',
  'fresh-start-balance',
  'fresh-start-done',
  'setup/balance',
  'setup/payday',
  'setup/bills',
  'setup/savings',
  'setup/ready',
];

function Navigator() {
  const colors = useColors();
  const reduced = useReducedMotion();
  const { ready: authReady, session } = useAuth();
  const { status, retry } = useMoney();
  const ready = authReady && status !== 'loading';
  const signedIn = session !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  if (status === 'error') {
    return (
      <View style={[styles.error, { backgroundColor: colors.background }]}>
        <Heading>We couldn&apos;t open your budget just now</Heading>
        <AppText muted>Your money is safe. Check your connection and try again.</AppText>
        <PrimaryButton label="Try again" onPress={retry} />
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
        <Stack.Protected guard={signedIn}>
          <Stack.Screen
            name="add-expense"
            options={{ animation: reduced ? 'none' : 'slide_from_bottom' }}
          />
          {SIGNED_IN_SCREENS.map((name) => (
            <Stack.Screen key={name} name={name} />
          ))}
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          {SIGNED_OUT_SCREENS.map((name) => (
            <Stack.Screen key={name} name={name} />
          ))}
        </Stack.Protected>
      </Stack>
    </PrivacyGate>
  );
}

function Money() {
  const { session } = useAuth();
  const userId = session?.user.id ?? 'signed-out';
  return (
    <MoneyProvider key={userId} signedIn={session !== null}>
      <StatusBar style="auto" />
      <Navigator />
    </MoneyProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Money />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, justifyContent: 'center', padding: size.screenPadding, gap: 12 },
});
