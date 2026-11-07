import { openDatabaseAsync } from 'expo-sqlite';

import { migrate, type Db } from './schema';

/**
 * Stand-in storage for Expo Go: a plain SQLite file that is NOT encrypted.
 * The SQLCipher version swaps in here, with a development build.
 */
export async function openDb(): Promise<Db> {
  const db = (await openDatabaseAsync('budget.db')) as unknown as Db;
  await migrate(db);
  return db;
}
