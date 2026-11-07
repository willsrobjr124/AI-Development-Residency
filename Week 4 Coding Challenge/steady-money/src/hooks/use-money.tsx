import { randomUUID } from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { openDb } from '@/data/db';
import * as repo from '@/data/repo';
import type { Db } from '@/data/schema';
import { today } from '@/domain/dates';
import { formatCents } from '@/domain/money';
import { shouldOfferFreshStart, type MoveTarget } from '@/domain/rules';
import { calculate, type Bill, type MoneyInputs, type MoneySummary } from '@/domain/safeToSpend';

const SETUP_STEPS = ['welcome', 'balance', 'payday', 'bills', 'savings', 'ready', 'done'] as const;

export type SetupStep = (typeof SETUP_STEPS)[number];

function isSetupStep(step: string | null): step is SetupStep {
  return SETUP_STEPS.some((known) => known === step);
}

export type Notice = { message: string; actionLabel?: string; action?: () => Promise<void> };

export type Preferences = {
  reduceMotion: boolean;
  allowScreenshots: boolean;
  bucketHintSeen: boolean;
};

const PREFERENCE_KEYS: Record<keyof Preferences, string> = {
  reduceMotion: 'reduce_motion',
  allowScreenshots: 'allow_screenshots',
  bucketHintSeen: 'bucket_hint_seen',
};

const LAST_OPENED = 'last_opened';

const COULD_NOT_SAVE = "We couldn't save that just now. Your money is safe, so try again.";

type MoneyContext = {
  status: 'loading' | 'ready' | 'error';
  setupStep: SetupStep;
  preferences: Preferences;
  inputs: MoneyInputs | null;
  summary: MoneySummary | null;
  notice: Notice | null;
  offerFreshStart: boolean;
  clearNotice: () => void;
  saveSetupStep: (step: SetupStep) => Promise<void>;
  setPreference: (key: keyof Preferences, value: boolean) => Promise<void>;
  addExpense: (amountCents: number, category: string | null) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  listRecent: () => Promise<repo.RecentExpense[]>;
  moveMoney: (to: MoveTarget, amountCents: number) => Promise<void>;
  addBill: (bill: Omit<Bill, 'id'> & { repeatsMonthly: boolean }) => Promise<void>;
  markBillPaid: (bill: Bill) => Promise<void>;
  saveBalance: (cents: number) => Promise<void>;
  savePayday: (date: string) => Promise<void>;
  saveSavings: (cents: number) => Promise<void>;
  startFresh: (balanceCents: number) => Promise<void>;
  dismissFreshStart: () => void;
  hideMoney: () => void;
  showMoney: () => Promise<void>;
};

const Context = createContext<MoneyContext | null>(null);

function feedback(reduceMotion: boolean) {
  if (reduceMotion || Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function MoneyProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Db | null>(null);
  const [status, setStatus] = useState<MoneyContext['status']>('loading');
  const [setupStep, setSetupStep] = useState<SetupStep>('welcome');
  const [preferences, setPreferences] = useState<Preferences>({
    reduceMotion: false,
    allowScreenshots: false,
    bucketHintSeen: false,
  });
  const [inputs, setInputs] = useState<MoneyInputs | null>(null);
  const [notice, setNoticeState] = useState<Notice | null>(null);
  const [offerFreshStart, setOfferFreshStart] = useState(false);

  const refresh = useCallback(async (from: Db) => {
    setInputs(await repo.loadMoneyInputs(from, today()));
  }, []);

  const setNotice = useCallback((next: Notice) => {
    setNoticeState(next);
    AccessibilityInfo.announceForAccessibility(next.message);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const opened = await openDb();
        const day = today();
        const [step, lastOpened, reduceMotion, allowScreenshots, bucketHintSeen] = await Promise.all([
          repo.getSetupStep(opened),
          repo.getSetting(opened, LAST_OPENED),
          repo.getSetting(opened, PREFERENCE_KEYS.reduceMotion),
          repo.getSetting(opened, PREFERENCE_KEYS.allowScreenshots),
          repo.getSetting(opened, PREFERENCE_KEYS.bucketHintSeen),
        ]);
        await repo.setSetting(opened, LAST_OPENED, day);
        await refresh(opened);
        if (!active) return;
        setSetupStep(isSetupStep(step) ? step : 'welcome');
        setPreferences({
          reduceMotion: reduceMotion === 'true',
          allowScreenshots: allowScreenshots === 'true',
          bucketHintSeen: bucketHintSeen === 'true',
        });
        setOfferFreshStart(step === 'done' && shouldOfferFreshStart(lastOpened, day));
        setDb(opened);
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const need = useCallback((): Db => {
    if (!db) throw new Error('Storage is not ready.');
    return db;
  }, [db]);

  /** Runs an undo or similar action, and says so calmly if it can't finish. */
  const attempt = useCallback(
    (task: () => Promise<void>) => async () => {
      try {
        await task();
      } catch {
        setNotice({ message: COULD_NOT_SAVE });
      }
    },
    [setNotice],
  );

  const clearNotice = useCallback(() => setNoticeState(null), []);

  const saveSetupStep = useCallback(
    async (step: SetupStep) => {
      await repo.setSetupStep(need(), step);
      setSetupStep(step);
    },
    [need],
  );

  const setPreference = useCallback(
    async (key: keyof Preferences, value: boolean) => {
      await repo.setSetting(need(), PREFERENCE_KEYS[key], String(value));
      setPreferences((current) => ({ ...current, [key]: value }));
    },
    [need],
  );

  const addExpense = useCallback(
    async (amountCents: number, category: string | null) => {
      const store = need();
      const id = randomUUID();
      await repo.addExpense(store, { id, amountCents, category });
      await refresh(store);
      feedback(preferences.reduceMotion);
      setNotice({
        message: `${formatCents(amountCents)} added${category ? ` to ${category}` : ''}`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.removeExpense(store, id);
          await refresh(store);
          setNotice({ message: 'Removed. Your number is back.' });
        }),
      });
    },
    [attempt, need, preferences.reduceMotion, refresh, setNotice],
  );

  const removeExpense = useCallback(
    async (id: string) => {
      const store = need();
      await repo.removeExpense(store, id);
      await refresh(store);
      setNotice({
        message: 'Expense removed',
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.restoreExpense(store, id);
          await refresh(store);
          setNotice({ message: 'Expense is back.' });
        }),
      });
    },
    [attempt, need, refresh, setNotice],
  );

  const listRecent = useCallback(() => repo.listRecentExpenses(need()), [need]);

  const moveMoney = useCallback(
    async (to: MoveTarget, amountCents: number) => {
      const store = need();
      const id = randomUUID();
      await repo.moveSavings(store, {
        id,
        amountCents: to === 'savings' ? amountCents : -amountCents,
      });
      await refresh(store);
      feedback(preferences.reduceMotion);
      setNotice({
        message: `${formatCents(amountCents)} moved to ${to === 'savings' ? 'Savings' : 'Spending'}`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.undoSavingsMove(store, id);
          await refresh(store);
          setNotice({ message: 'Moved back.' });
        }),
      });
    },
    [attempt, need, preferences.reduceMotion, refresh, setNotice],
  );

  const addBill = useCallback<MoneyContext['addBill']>(
    async (bill) => {
      const store = need();
      const id = randomUUID();
      await repo.addBill(store, { ...bill, id });
      await refresh(store);
      setNotice({
        message: `${bill.name} added to your bills`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.removeBill(store, id);
          await refresh(store);
          setNotice({ message: `${bill.name} removed.` });
        }),
      });
    },
    [attempt, need, refresh, setNotice],
  );

  const markBillPaid = useCallback(
    async (bill: Bill) => {
      const store = need();
      const id = randomUUID();
      try {
        await repo.markBillPaid(store, { id, billId: bill.id });
      } catch {
        setNotice({ message: COULD_NOT_SAVE });
        return;
      }
      await refresh(store);
      feedback(preferences.reduceMotion);
      setNotice({
        message: `${bill.name} bill marked paid`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.undoBillPaid(store, id);
          await refresh(store);
          setNotice({ message: `${bill.name} bill is back on your list.` });
        }),
      });
    },
    [attempt, need, preferences.reduceMotion, refresh, setNotice],
  );

  const saveBalance = useCallback(
    async (cents: number) => {
      const store = need();
      await repo.setBalance(store, cents);
      await refresh(store);
    },
    [need, refresh],
  );

  const savePayday = useCallback(
    async (date: string) => {
      const store = need();
      await repo.setNextPayday(store, date);
      await refresh(store);
    },
    [need, refresh],
  );

  const saveSavings = useCallback(
    async (cents: number) => {
      const store = need();
      const current = (await repo.loadMoneyInputs(store, today())).savingsCents;
      if (cents !== current) {
        await repo.moveSavings(store, { id: randomUUID(), amountCents: cents - current });
      }
      await refresh(store);
    },
    [need, refresh],
  );

  const startFresh = useCallback(
    async (balanceCents: number) => {
      const store = need();
      const undo = await repo.freshStart(store, balanceCents);
      await refresh(store);
      setOfferFreshStart(false);
      setNotice({
        message: 'Your balance is up to date',
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.undoFreshStart(store, undo);
          await refresh(store);
          setNotice({ message: 'Back to how it was.' });
        }),
      });
    },
    [attempt, need, refresh, setNotice],
  );

  const dismissFreshStart = useCallback(() => setOfferFreshStart(false), []);

  /** Clears money from memory while locked. It reloads from storage on unlock. */
  const hideMoney = useCallback(() => {
    setInputs(null);
    setNoticeState(null);
  }, []);

  const showMoney = useCallback(async () => {
    await refresh(need());
  }, [need, refresh]);

  const value = useMemo<MoneyContext>(
    () => ({
      status,
      setupStep,
      preferences,
      inputs,
      summary: inputs ? calculate(inputs) : null,
      notice,
      offerFreshStart,
      clearNotice,
      saveSetupStep,
      setPreference,
      addExpense,
      removeExpense,
      listRecent,
      moveMoney,
      addBill,
      markBillPaid,
      saveBalance,
      savePayday,
      saveSavings,
      startFresh,
      dismissFreshStart,
      hideMoney,
      showMoney,
    }),
    [
      status,
      setupStep,
      preferences,
      inputs,
      notice,
      offerFreshStart,
      clearNotice,
      saveSetupStep,
      setPreference,
      addExpense,
      removeExpense,
      listRecent,
      moveMoney,
      addBill,
      markBillPaid,
      saveBalance,
      savePayday,
      saveSavings,
      startFresh,
      dismissFreshStart,
      hideMoney,
      showMoney,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMoney(): MoneyContext {
  const value = useContext(Context);
  if (!value) throw new Error('useMoney must be used inside MoneyProvider.');
  return value;
}
