import { router } from 'expo-router';
import { View } from 'react-native';

import { AppText, BackLink, Heading, Row, Screen, SwitchRow } from '@/components/ui';
import { shortDate } from '@/domain/dates';
import { formatCents, spokenCents } from '@/domain/money';
import { useMoney } from '@/hooks/use-money';

export default function Settings() {
  const { inputs, summary, preferences, setPreference } = useMoney();
  if (!inputs || !summary) return null;

  const payday = inputs.nextPayday ? shortDate(inputs.nextPayday) : 'Not set';

  return (
    <Screen>
      <BackLink label="Home" onPress={() => router.back()} />
      <Heading>Settings</Heading>

      <View>
        <Row title="Account" onPress={() => router.push('/account')} />
        <Row
          title="Balance"
          detail={formatCents(summary.availableCents)}
          accessibilityLabel={`Balance, ${spokenCents(summary.availableCents)}. Change it`}
          onPress={() => router.push('/edit-balance')}
        />
        <Row
          title="Next payday"
          detail={payday}
          accessibilityLabel={`Next payday, ${payday}. Change it`}
          onPress={() => router.push('/edit-payday')}
        />
        <Row
          title="Savings"
          detail={formatCents(summary.savingsCents)}
          accessibilityLabel={`Savings, ${spokenCents(summary.savingsCents)}. Change it`}
          onPress={() => router.push('/edit-savings')}
        />
        <SwitchRow
          label="Reduce motion"
          value={preferences.reduceMotion}
          onChange={(value) => setPreference('reduceMotion', value)}
        />
        <SwitchRow
          label="Allow screenshots"
          value={preferences.allowScreenshots}
          onChange={(value) => setPreference('allowScreenshots', value)}
        />
      </View>

      <AppText>
        Screenshots stay off so your money stays hidden in the recent apps list. Turn them on if you
        want to take one.
      </AppText>
    </Screen>
  );
}
