/** The small part of expo-sqlite the app uses, so tests can run the same SQL in Node. */
export type Db = {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: (string | number | null)[]): Promise<{ changes: number }>;
  getAllAsync<T>(sql: string, params?: (string | number | null)[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: (string | number | null)[]): Promise<T | null>;
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
};

const row = `
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT`;

/** The first test version filled in sample numbers. This clears them so setup can start. */
const CLEAR_SAMPLE_DATA = `
  DELETE FROM bill_payments WHERE (SELECT value FROM settings WHERE key = 'setup_step') = 'sample';
  DELETE FROM bills WHERE (SELECT value FROM settings WHERE key = 'setup_step') = 'sample';
  DELETE FROM expenses WHERE (SELECT value FROM settings WHERE key = 'setup_step') = 'sample';
  DELETE FROM savings_moves WHERE (SELECT value FROM settings WHERE key = 'setup_step') = 'sample';
  DELETE FROM settings WHERE (SELECT value FROM settings WHERE key = 'setup_step') = 'sample';
`;

/** Numbered in order. Never edit one that has shipped; add a new one. */
const MIGRATIONS = [
  `
  CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
  CREATE TABLE bills (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    due_date TEXT NOT NULL,
    repeats_monthly INTEGER NOT NULL DEFAULT 1,
    paid_at TEXT,${row}
  );
  CREATE TABLE bill_payments (
    id TEXT PRIMARY KEY NOT NULL,
    bill_id TEXT NOT NULL REFERENCES bills (id),
    amount_cents INTEGER NOT NULL,
    due_date TEXT NOT NULL,${row}
  );
  CREATE TABLE expenses (
    id TEXT PRIMARY KEY NOT NULL,
    amount_cents INTEGER NOT NULL,
    category TEXT,${row}
  );
  CREATE TABLE savings_moves (
    id TEXT PRIMARY KEY NOT NULL,
    amount_cents INTEGER NOT NULL,${row}
  );
  `,
  CLEAR_SAMPLE_DATA,
  // Runs again because a live reload could bring the sample numbers back after the first run.
  CLEAR_SAMPLE_DATA,
];

export async function migrate(db: Db): Promise<void> {
  const current = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = current?.user_version ?? 0;
  for (let index = version; index < MIGRATIONS.length; index += 1) {
    await db.execAsync(MIGRATIONS[index]);
    await db.execAsync(`PRAGMA user_version = ${index + 1}`);
  }
}
