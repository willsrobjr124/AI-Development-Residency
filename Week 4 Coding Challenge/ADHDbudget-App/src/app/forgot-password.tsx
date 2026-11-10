import { router } from 'expo-router';
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
} from '@/components/ui';
import { authErrorMessage, emailError } from '@/domain/auth';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

export default function ForgotPassword() {
  const { sendResetCode } = useAuth();
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  function send() {
    const badEmail = emailError(email);
    setProblem(badEmail);
    if (badEmail) return;
    saveOnce(
      async () => {
        await sendResetCode(email);
        router.replace({ pathname: '/new-password', params: { email: email.trim() } });
      },
      (error) => setProblem(authErrorMessage(error)),
    );
  }

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <View style={styles.copy}>
        <Heading>Reset your password</Heading>
        <AppText muted>We&apos;ll send a code to your email.</AppText>
      </View>
      <Field
        label="Email"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        inputMode="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        error={problem}
        onChangeText={(text) => {
          setEmail(text);
          setProblem(null);
        }}
      />
      <Spacer />
      <PrimaryButton label="Send my code" onPress={send} />
    </Screen>
  );
}

const styles = StyleSheet.create({ copy: { gap: space.md } });
