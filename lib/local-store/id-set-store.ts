import { useSyncExternalStore } from "react";
import { createStorageChannel } from "./storage-channel";

const EMPTY: string[] = [];

export interface IdSetStore {
  useIds: () => string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}

export function createIdSetStore(key: string): IdSetStore {
  const channel = createStorageChannel<string[]>(key, EMPTY);

  function toggle(id: string) {
    const current = channel.read();
    const next = current.includes(id)
      ? current.filter((existing) => existing !== id)
      : [...current, id];
    channel.write(next);
  }

  function has(id: string) {
    return channel.read().includes(id);
  }

  function useIds(): string[] {
    return useSyncExternalStore(channel.subscribe, channel.read, channel.getServerSnapshot);
  }

  return { useIds, has, toggle };
}
