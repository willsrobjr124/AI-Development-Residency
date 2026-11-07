import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { deleteMyAccount } from '@/data/repo';
import { supabase } from '@/data/supabase';

type SignUpResult = 'signed-in' | 'needs-code' | 'email-taken';

type AuthContext = {
  ready: boolean;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  verifySignUpCode: (email: string, code: string) => Promise<void>;
  resendSignUpCode: (email: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  sendResetCode: (email: string) => Promise<void>;
  setNewPassword: (email: string, code: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const Context = createContext<AuthContext | null>(null);

function fail(error: unknown) {
  if (error) throw error;
}

const actions = {
  async signUp(email: string, password: string): Promise<SignUpResult> {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    fail(error);
    if (data.session) return 'signed-in';
    // Supabase hides whether an email is taken: a repeat sign-up comes back with no identities.
    return data.user?.identities?.length === 0 ? 'email-taken' : 'needs-code';
  },
  async verifySignUpCode(email: string, code: string) {
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'signup',
    });
    fail(error);
  },
  async resendSignUpCode(email: string) {
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    fail(error);
  },
  async logIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    fail(error);
  },
  async sendResetCode(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    fail(error);
  },
  async setNewPassword(email: string, code: string, password: string) {
    const verified = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'recovery',
    });
    fail(verified.error);
    const updated = await supabase.auth.updateUser({ password });
    fail(updated.error);
  },
  async logOut() {
    const { error } = await supabase.auth.signOut();
    fail(error);
  },
  async deleteAccount() {
    await deleteMyAccount();
    await supabase.auth.signOut({ scope: 'local' });
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContext>(() => ({ ready, session, ...actions }), [ready, session]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAuth(): AuthContext {
  const value = useContext(Context);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
