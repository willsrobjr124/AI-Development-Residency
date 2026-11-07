import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSaveOnce } from '@/components/forms';
import { AppText, Heading, PrimaryButton, Screen, Spacer, TextButton } from '@/components/ui';
import { authErrorMessage } from '@/domain/auth';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

export default function DeleteAccount() {
  const { deleteAccount } = useAuth();
  const [problem, setProblem] = useState<string | null>(null);
  const saveOnce = useSaveOnce();

  return (
    <Screen>
      <Spacer />
      <View style={styles.copy}>
        <Heading>Delete your account and data?</Heading>
        <AppText>This removes your account and everything saved in it. It can&apos;t be undone.</AppText>
        {problem ? (
          <AppText variant="bodyBold" accessibilityLiveRegion="polite">
            {problem}
          </AppText>
        ) : null}
      </View>
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton
          label="Delete everything"
          onPress={() => saveOnce(deleteAccount, (error) => setProblem(authErrorMessage(error)))}
        />
        <TextButton label="Keep my account" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  actions: { gap: space.xxl },
});
