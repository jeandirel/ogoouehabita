/**
 * Generic localStorage-backed channel: one module-level cache + a custom
 * window event, so any number of components can read/write the same key
 * and stay in sync without a context re-render tree. This is the exact
 * plumbing components/providers/favorites-provider.tsx proved out first;
 * every local store in this app builds on this one primitive.
 */
export interface StorageChannel<T> {
  read: () => T;
  write: (value: T) => void;
  subscribe: (callback: () => void) => () => void;
  getServerSnapshot: () => T;
}

export function createStorageChannel<T>(key: string, emptyValue: T): StorageChannel<T> {
  const storageKey = `ogooue-habitat:${key}`;
  const eventName = `ogooue-habitat:${key}-change`;
  let cached: T | null = null;

  function read(): T {
    if (typeof window === "undefined") return emptyValue;
    if (cached) return cached;
    try {
      const stored = window.localStorage.getItem(storageKey);
      cached = stored ? (JSON.parse(stored) as T) : emptyValue;
    } catch {
      cached = emptyValue;
    }
    return cached!;
  }

  function write(value: T) {
    cached = value;
    window.localStorage.setItem(storageKey, JSON.stringify(value));
    window.dispatchEvent(new Event(eventName));
  }

  function getServerSnapshot(): T {
    return emptyValue;
  }

  function subscribe(callback: () => void) {
    const handleExternalChange = () => {
      cached = null;
      callback();
    };
    window.addEventListener("storage", handleExternalChange);
    window.addEventListener(eventName, callback);
    return () => {
      window.removeEventListener("storage", handleExternalChange);
      window.removeEventListener(eventName, callback);
    };
  }

  return { read, write, subscribe, getServerSnapshot };
}
