import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSaveOnce } from '@/components/forms';
import { AppText, ErrorText, Heading, PrimaryButton, Screen, Spacer, TextButton } from '@/components/ui';
import { authErrorMessage } from '@/domain/auth';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

export default function LogOut() {
  const { logOut } = useAuth();
  const [problem, setProblem] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  return (
    <Screen>
      <Spacer />
      <View style={styles.copy}>
        <Heading>Log out on this device?</Heading>
        <AppText muted>Your budget stays safe in your account. Log in any time to see it.</AppText>
        {problem ? (
          <ErrorText>{problem}</ErrorText>
        ) : null}
      </View>
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton
          label="Log out"
          onPress={() => saveOnce(logOut, (error) => setProblem(authErrorMessage(error)))}
        />
        <TextButton label="Stay logged in" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  actions: { gap: space.xxl },
});
