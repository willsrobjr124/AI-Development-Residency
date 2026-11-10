import Ionicons from '@expo/vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ScreenCapture from 'expo-screen-capture';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, AppState, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Heading, PrimaryButton, Spacer } from '@/components/ui';
import { shouldLock } from '@/domain/rules';
import { useMoney } from '@/hooks/use-money';
import { size, space, useColors } from '@/theme';

const IDLE_CHECK_MS = 15_000;
const LOCKED_MESSAGE = 'Locked to keep your money private';

/**
 * Stand-in lock for Expo Go. It uses the phone's own passcode or fingerprint.
 * It covers money the moment the app leaves the screen, and locks after 5 idle minutes.
 */
export function PrivacyGate({ children }: { children: ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { status, setupStep, preferences, hideMoney, showMoney } = useMoney();
  const [covered, setCovered] = useState(false);
  const [locked, setLocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const lastActive = useRef(0);

  const guarding = status === 'ready' && setupStep === 'done';

  const lock = useCallback(() => {
    setLocked(true);
    hideMoney();
    AccessibilityInfo.announceForAccessibility(LOCKED_MESSAGE);
  }, [hideMoney]);

  useEffect(() => {
    lastActive.current = Date.now();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setCovered(true);
        if (state === 'background') lastActive.current = Date.now();
        return;
      }
      setCovered(false);
      if (guarding && shouldLock(lastActive.current, Date.now())) lock();
      lastActive.current = Date.now();
    });
    return () => subscription.remove();
  }, [guarding, lock]);

  useEffect(() => {
    if (!guarding) return;
    const timer = setInterval(() => {
      if (AppState.currentState === 'active' && shouldLock(lastActive.current, Date.now())) lock();
    }, IDLE_CHECK_MS);
    return () => clearInterval(timer);
  }, [guarding, lock]);

  // On Android this also gives the app a blank preview in the recent apps list.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const change = preferences.allowScreenshots
      ? ScreenCapture.allowScreenCaptureAsync()
      : ScreenCapture.preventScreenCaptureAsync();
    change.catch(() => {});
  }, [preferences.allowScreenshots]);

  async function unlock() {
    setFailed(false);
    try {
      const canAsk =
        Platform.OS !== 'web' &&
        (await LocalAuthentication.hasHardwareAsync()) &&
        (await LocalAuthentication.isEnrolledAsync());
      if (canAsk) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock your budget',
        });
        if (!result.success) {
          setFailed(true);
          return;
        }
      }
      await showMoney();
      lastActive.current = Date.now();
      setLocked(false);
    } catch {
      setFailed(true);
    }
  }

  const hidden = covered || locked;

  return (
    <View
      style={styles.fill}
      onTouchStart={() => {
        lastActive.current = Date.now();
      }}>
      <View
        style={styles.fill}
        importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={hidden}>
        {children}
      </View>

      {locked ? (
        <View
          accessibilityViewIsModal
          style={[
            styles.lock,
            {
              backgroundColor: colors.background,
              paddingTop: insets.top + space.xl,
              paddingBottom: insets.bottom + space.xl,
            },
          ]}>
          <Spacer />
          <Ionicons name="lock-closed-outline" size={48} color={colors.label} />
          <View style={styles.copy}>
            <Heading>{LOCKED_MESSAGE}</Heading>
            <AppText muted>
              {failed
                ? "That didn't unlock. Your money is safe, so try again."
                : 'Unlock to pick up where you left off.'}
            </AppText>
          </View>
          <Spacer />
          <PrimaryButton label="Unlock" onPress={unlock} />
        </View>
      ) : covered ? (
        <View style={[styles.cover, { backgroundColor: colors.background }]}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.label} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  lock: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: size.screenPadding,
    gap: space.xxl,
  },
  cover: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  copy: { gap: space.md },
});
