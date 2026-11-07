import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { useMoney } from '@/hooks/use-money';

/** True if the phone's setting or the app's own setting asks for less motion. */
export function useReducedMotion(): boolean {
  const { preferences } = useMoney();
  const [system, setSystem] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setSystem(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystem);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return system || preferences.reduceMotion;
}
