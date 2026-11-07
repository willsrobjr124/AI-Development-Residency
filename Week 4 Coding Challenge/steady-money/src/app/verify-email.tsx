import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSaveOnce } from '@/components/forms';
import {
  AppText,
  BackLink,
  Field,
  Heading,
  PrimaryButton,
  Screen,
  Spacer,
  TextButton,
} from '@/components/ui';
import { authErrorMessage } from '@/domain/auth';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

export default function VerifyEmail() {
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const { verifySignUpCode, resendSignUpCode } = useAuth();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  function confirm() {
    if (!code.trim()) {
      setMessage('Enter the code from your email.');
      return;
    }
    setMessage(null);
    saveOnce(
      () => verifySignUpCode(email, code),
      (error) => setMessage(authErrorMessage(error)),
    );
  }

  function resend() {
    saveOnce(
      async () => {
        await resendSignUpCode(email);
        setMessage('We sent a new code.');
      },
      (error) => setMessage(authErrorMessage(error)),
    );
  }

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <View style={styles.copy}>
        <Heading>Check your email</Heading>
        <AppText>We sent a code to {email}. It can take a minute.</AppText>
      </View>
      <Field
        label="Code"
        autoComplete="one-time-code"
        inputMode="numeric"
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        value={code}
        onChangeText={setCode}
      />
      {message ? (
        <AppText variant="bodyBold" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      ) : null}
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label="Confirm my email" onPress={confirm} />
        <TextButton label="Send a new code" onPress={resend} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  actions: { gap: space.sm },
});
