import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  BackLink,
  Heading,
  PrimaryButton,
  ListGroup,
  Row,
  Screen,
  Spacer,
  TextButton,
} from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { space } from '@/theme';

export default function Account() {
  const { session } = useAuth();
  const email = session?.user.email ?? '';

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <View style={styles.copy}>
        <Heading>Your account</Heading>
        <AppText muted>Your budget is saved to this account.</AppText>
      </View>
      <ListGroup>
        <Row title={email} accessibilityLabel={`Email, ${email}`} />
      </ListGroup>
      <Spacer />
      <View style={styles.actions}>
        <PrimaryButton label="Log out" onPress={() => router.push('/log-out')} />
        <TextButton
          tone="plum"
          label="Delete my account and data"
          onPress={() => router.push('/delete-account')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.md },
  actions: { gap: space.sm },
});
