export type KeyValueStore = {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
};

/**
 * The phone's secure vault only takes small values, and a sign-in session is larger,
 * so the session is split into pieces. A small count entry records how many there are.
 */
export function chunkedStorage(store: KeyValueStore, chunkSize = 1800) {
  const countKey = (key: string) => `${key}.count`;
  const partKey = (key: string, index: number) => `${key}.${index}`;

  async function removeItem(key: string): Promise<void> {
    const count = Number((await store.getItemAsync(countKey(key))) ?? 0);
    for (let index = 0; index < count; index += 1) {
      await store.deleteItemAsync(partKey(key, index));
    }
    await store.deleteItemAsync(countKey(key));
  }

  return {
    async getItem(key: string): Promise<string | null> {
      const saved = await store.getItemAsync(countKey(key));
      if (saved === null) return null;
      let value = '';
      for (let index = 0; index < Number(saved); index += 1) {
        const part = await store.getItemAsync(partKey(key, index));
        if (part === null) return null;
        value += part;
      }
      return value;
    },
    async setItem(key: string, value: string): Promise<void> {
      await removeItem(key);
      const count = Math.ceil(value.length / chunkSize);
      for (let index = 0; index < count; index += 1) {
        await store.setItemAsync(
          partKey(key, index),
          value.slice(index * chunkSize, (index + 1) * chunkSize),
        );
      }
      await store.setItemAsync(countKey(key), String(count));
    },
    removeItem,
  };
}
