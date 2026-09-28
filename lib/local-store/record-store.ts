import { useSyncExternalStore } from "react";
import { createStorageChannel } from "./storage-channel";
import type { LocalRecordBase } from "@/lib/types";

export interface RecordStore<T extends LocalRecordBase> {
  useAll: () => T[];
  getAll: () => T[];
  insert: (record: Omit<T, "id" | "createdAt">) => T;
  remove: (id: string) => void;
}

export function createRecordStore<T extends LocalRecordBase>(key: string): RecordStore<T> {
  const EMPTY: T[] = [];
  const channel = createStorageChannel<T[]>(key, EMPTY);

  function getAll(): T[] {
    return channel.read();
  }

  function insert(record: Omit<T, "id" | "createdAt">): T {
    const full = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as T;
    channel.write([...channel.read(), full]);
    return full;
  }

  function remove(id: string) {
    channel.write(channel.read().filter((record) => record.id !== id));
  }

  function useAll(): T[] {
    return useSyncExternalStore(channel.subscribe, channel.read, channel.getServerSnapshot);
  }

  return { useAll, getAll, insert, remove };
}
