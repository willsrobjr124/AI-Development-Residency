import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';

import { chunkedStorage } from './session-storage';

// Both of these are public by design. Row-level security is what protects the data.
const SUPABASE_URL = 'https://wobccsyesydhwmycpsdz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_xQljE67MGgu_UQH9qgr2Vw_VwVyip6W';

const isWeb = Platform.OS === 'web';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // On phones the session lives in the secure vault. The web uses the browser's storage.
    storage: isWeb ? undefined : chunkedStorage(SecureStore),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

if (!isWeb) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
