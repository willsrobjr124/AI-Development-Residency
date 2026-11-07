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

import * as repo from '@/data/repo';
import { today } from '@/domain/dates';
import { formatCents } from '@/domain/money';
import { shouldOfferFreshStart, type MoveTarget } from '@/domain/rules';
import { calculate, type Bill, type MoneyInputs, type MoneySummary } from '@/domain/safeToSpend';

const SETUP_STEPS = ['balance', 'payday', 'bills', 'savings', 'ready', 'done'] as const;

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

const PREFERENCE_COLUMNS = {
  reduceMotion: 'reduce_motion',
  allowScreenshots: 'allow_screenshots',
  bucketHintSeen: 'bucket_hint_seen',
} as const;

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
  retry: () => void;
};

const Context = createContext<MoneyContext | null>(null);

function feedback(reduceMotion: boolean) {
  if (reduceMotion || Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Remounted for each person, so one person's money is never left in memory for the next. */
export function MoneyProvider({
  signedIn,
  children,
}: {
  signedIn: boolean;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<MoneyContext['status']>(signedIn ? 'loading' : 'ready');
  const [tries, setTries] = useState(0);
  const [setupStep, setSetupStep] = useState<SetupStep>('balance');
  const [preferences, setPreferences] = useState<Preferences>({
    reduceMotion: false,
    allowScreenshots: false,
    bucketHintSeen: false,
  });
  const [inputs, setInputs] = useState<MoneyInputs | null>(null);
  const [notice, setNoticeState] = useState<Notice | null>(null);
  const [offerFreshStart, setOfferFreshStart] = useState(false);

  const refresh = useCallback(async () => {
    setInputs(await repo.loadMoneyInputs(today()));
  }, []);

  const setNotice = useCallback((next: Notice) => {
    setNoticeState(next);
    AccessibilityInfo.announceForAccessibility(next.message);
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    (async () => {
      try {
        const settings = await repo.loadSettings();
        const day = today();
        await repo.updateSettings({ last_opened: day });
        await refresh();
        if (!active) return;
        const step = settings.setup_step;
        setSetupStep(isSetupStep(step) ? step : 'balance');
        setPreferences({
          reduceMotion: settings.reduce_motion,
          allowScreenshots: settings.allow_screenshots,
          bucketHintSeen: settings.bucket_hint_seen,
        });
        setOfferFreshStart(step === 'done' && shouldOfferFreshStart(settings.last_opened, day));
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [signedIn, refresh, tries]);

  const retry = useCallback(() => {
    setStatus('loading');
    setTries((count) => count + 1);
  }, []);

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
      await repo.updateSettings({ setup_step: step });
      setSetupStep(step);
    },
    [],
  );

  const setPreference = useCallback(
    async (key: keyof Preferences, value: boolean) => {
      await repo.updateSettings({ [PREFERENCE_COLUMNS[key]]: value });
      setPreferences((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const addExpense = useCallback(
    async (amountCents: number, category: string | null) => {
      const id = randomUUID();
      await repo.addExpense({ id, amountCents, category });
      await refresh();
      feedback(preferences.reduceMotion);
      setNotice({
        message: `${formatCents(amountCents)} added${category ? ` to ${category}` : ''}`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.removeExpense(id);
          await refresh();
          setNotice({ message: 'Removed. Your number is back.' });
        }),
      });
    },
    [attempt, preferences.reduceMotion, refresh, setNotice],
  );

  const removeExpense = useCallback(
    async (id: string) => {
      await repo.removeExpense(id);
      await refresh();
      setNotice({
        message: 'Expense removed',
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.restoreExpense(id);
          await refresh();
          setNotice({ message: 'Expense is back.' });
        }),
      });
    },
    [attempt, refresh, setNotice],
  );

  const listRecent = useCallback(() => repo.listRecentExpenses(), []);

  const moveMoney = useCallback(
    async (to: MoveTarget, amountCents: number) => {
      const id = randomUUID();
      await repo.moveSavings({
        id,
        amountCents: to === 'savings' ? amountCents : -amountCents,
      });
      await refresh();
      feedback(preferences.reduceMotion);
      setNotice({
        message: `${formatCents(amountCents)} moved to ${to === 'savings' ? 'Savings' : 'Spending'}`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.undoSavingsMove(id);
          await refresh();
          setNotice({ message: 'Moved back.' });
        }),
      });
    },
    [attempt, preferences.reduceMotion, refresh, setNotice],
  );

  const addBill = useCallback<MoneyContext['addBill']>(
    async (bill) => {
      const id = randomUUID();
      await repo.addBill({ ...bill, id });
      await refresh();
      setNotice({
        message: `${bill.name} added to your bills`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.removeBill(id);
          await refresh();
          setNotice({ message: `${bill.name} removed.` });
        }),
      });
    },
    [attempt, refresh, setNotice],
  );

  const markBillPaid = useCallback(
    async (bill: Bill) => {
      const id = randomUUID();
      try {
        await repo.markBillPaid({ id, billId: bill.id });
      } catch {
        setNotice({ message: COULD_NOT_SAVE });
        return;
      }
      await refresh();
      feedback(preferences.reduceMotion);
      setNotice({
        message: `${bill.name} bill marked paid`,
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.undoBillPaid(id);
          await refresh();
          setNotice({ message: `${bill.name} bill is back on your list.` });
        }),
      });
    },
    [attempt, preferences.reduceMotion, refresh, setNotice],
  );

  const saveBalance = useCallback(
    async (cents: number) => {
      await repo.setBalance(cents);
      await refresh();
    },
    [refresh],
  );

  const savePayday = useCallback(
    async (date: string) => {
      await repo.setNextPayday(date);
      await refresh();
    },
    [refresh],
  );

  const saveSavings = useCallback(
    async (cents: number) => {
      const current = (await repo.loadMoneyInputs(today())).savingsCents;
      if (cents !== current) {
        await repo.moveSavings({ id: randomUUID(), amountCents: cents - current });
      }
      await refresh();
    },
    [refresh],
  );

  const startFresh = useCallback(
    async (balanceCents: number) => {
      const undo = await repo.freshStart(balanceCents);
      await refresh();
      setOfferFreshStart(false);
      setNotice({
        message: 'Your balance is up to date',
        actionLabel: 'Undo',
        action: attempt(async () => {
          await repo.undoFreshStart(undo);
          await refresh();
          setNotice({ message: 'Back to how it was.' });
        }),
      });
    },
    [attempt, refresh, setNotice],
  );

  const dismissFreshStart = useCallback(() => setOfferFreshStart(false), []);

  /** Clears money from memory while locked. It reloads from storage on unlock. */
  const hideMoney = useCallback(() => {
    setInputs(null);
    setNoticeState(null);
  }, []);

  const showMoney = useCallback(async () => {
    await refresh();
  }, [refresh]);

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
      retry,
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
      retry,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMoney(): MoneyContext {
  const value = useContext(Context);
  if (!value) throw new Error('useMoney must be used inside MoneyProvider.');
  return value;
}
