import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSaveOnce } from '@/components/forms';
import {
  AppText,
  ErrorText,
  BackLink,
  Field,
  Heading,
  PasswordField,
  PrimaryButton,
  Screen,
  Spacer,
  TextButton,
} from '@/components/ui';
import { authErrorMessage, passwordError } from '@/domain/auth';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

export default function NewPassword() {
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const { setNewPassword, sendResetCode } = useAuth();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  function save() {
    if (!code.trim()) {
      setProblem('Enter the code from your email.');
      return;
    }
    const badPassword = passwordError(password);
    setProblem(badPassword);
    if (badPassword) return;
    saveOnce(
      () => setNewPassword(email, code, password),
      (error) => setProblem(authErrorMessage(error)),
    );
  }

  function resend() {
    saveOnce(
      async () => {
        await sendResetCode(email);
        setProblem('We sent a new code.');
      },
      (error) => setProblem(authErrorMessage(error)),
    );
  }

  return (
    <Screen>
      <BackLink onPress={() => router.replace('/log-in')} />
      <View style={styles.copy}>
        <Heading>Set a new password</Heading>
        <AppText muted>We sent a code to {email}. It can take a minute.</AppText>
      </View>
      <View style={styles.fields}>
        <Field
          label="Code"
          autoComplete="one-time-code"
          inputMode="numeric"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          value={code}
          onChangeText={setCode}
        />
        <PasswordField label="New password" isNew value={password} onChange={setPassword} />
      </View>
      {problem ? (
        <ErrorText>{problem}</ErrorText>
      ) : null}
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label="Save my password" onPress={save} />
        <TextButton label="Send a new code" onPress={resend} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  fields: { gap: space.lg },
  actions: { gap: space.sm },
});
