import { chunkedStorage, type KeyValueStore } from './session-storage';

function memoryStore(limit: number): KeyValueStore & { keys: () => string[] } {
  const data = new Map<string, string>();
  return {
    keys: () => [...data.keys()],
    getItemAsync: async (key) => data.get(key) ?? null,
    setItemAsync: async (key, value) => {
      if (value.length > limit) throw new Error('too large');
      data.set(key, value);
    },
    deleteItemAsync: async (key) => {
      data.delete(key);
    },
  };
}

describe('chunkedStorage', () => {
  it('returns null for something never saved', async () => {
    expect(await chunkedStorage(memoryStore(100), 100).getItem('session')).toBeNull();
  });

  it('saves a value larger than one slot and reads it back whole', async () => {
    const storage = chunkedStorage(memoryStore(100), 100);
    const value = 'x'.repeat(250) + 'end';
    await storage.setItem('session', value);
    expect(await storage.getItem('session')).toBe(value);
  });

  it('leaves no old pieces behind when a shorter value replaces a longer one', async () => {
    const store = memoryStore(100);
    const storage = chunkedStorage(store, 100);
    await storage.setItem('session', 'x'.repeat(250));
    await storage.setItem('session', 'short');
    expect(await storage.getItem('session')).toBe('short');
    expect(store.keys()).toHaveLength(2);
  });

  it('removes every piece', async () => {
    const store = memoryStore(100);
    const storage = chunkedStorage(store, 100);
    await storage.setItem('session', 'x'.repeat(250));
    await storage.removeItem('session');
    expect(store.keys()).toHaveLength(0);
    expect(await storage.getItem('session')).toBeNull();
  });
});
