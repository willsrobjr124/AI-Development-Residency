import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSaveOnce } from '@/components/forms';
import {
  AppText,
  BackLink,
  Field,
  Heading,
  PasswordField,
  PrimaryButton,
  Screen,
  Spacer,
  TextButton,
} from '@/components/ui';
import { authErrorMessage, emailError, passwordError } from '@/domain/auth';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

const EMAIL_TAKEN = 'That email already has an account. You can log in instead.';

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailProblem, setEmailProblem] = useState<string | null>(null);
  const [passwordProblem, setPasswordProblem] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  function save() {
    const badEmail = emailError(email);
    const badPassword = passwordError(password);
    setEmailProblem(badEmail);
    setPasswordProblem(badPassword);
    setProblem(null);
    if (badEmail || badPassword) return;

    saveOnce(
      async () => {
        const result = await signUp(email, password);
        if (result === 'email-taken') setProblem(EMAIL_TAKEN);
        if (result === 'needs-code') {
          router.push({ pathname: '/verify-email', params: { email: email.trim() } });
        }
      },
      (error) => setProblem(authErrorMessage(error)),
    );
  }

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <View style={styles.copy}>
        <Heading>Create your account</Heading>
        <AppText>Your budget stays private, and it&apos;s here whenever you come back.</AppText>
      </View>
      <View style={styles.fields}>
        <Field
          label="Email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          inputMode="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          error={emailProblem}
          onChangeText={(text) => {
            setEmail(text);
            setEmailProblem(null);
          }}
        />
        <PasswordField
          label="Password"
          isNew
          value={password}
          error={passwordProblem}
          onChange={(text) => {
            setPassword(text);
            setPasswordProblem(null);
          }}
        />
        <AppText>At least 8 characters. Pasting and password managers work here.</AppText>
      </View>
      {problem ? (
        <AppText variant="bodyBold" accessibilityLiveRegion="polite">
          {problem}
        </AppText>
      ) : null}
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label="Create my account" onPress={save} />
        <TextButton label="I already have an account" onPress={() => router.replace('/log-in')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  fields: { gap: space.lg },
  actions: { gap: space.sm },
});
