import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSaveOnce } from '@/components/forms';
import {
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
import { authErrorMessage, emailError } from '@/domain/auth';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

export default function LogIn() {
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  function save() {
    const badEmail = emailError(email);
    if (badEmail) {
      setProblem(badEmail);
      return;
    }
    if (!password) {
      setProblem('Enter your password to log in.');
      return;
    }
    setProblem(null);
    saveOnce(
      () => logIn(email, password),
      (error) => setProblem(authErrorMessage(error)),
    );
  }

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <Heading>Log in</Heading>
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
          onChangeText={setEmail}
        />
        <PasswordField label="Password" value={password} onChange={setPassword} />
      </View>
      {problem ? (
        <ErrorText>{problem}</ErrorText>
      ) : null}
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label="Log in" onPress={save} />
        <TextButton label="Forgot my password" onPress={() => router.push('/forgot-password')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.lg },
  actions: { gap: space.sm },
});
