import { useSyncExternalStore } from "react";
import { createStorageChannel } from "@/lib/local-store/storage-channel";

// Same "property:slug" / "land:slug" composite ids as favorites (see
// data/local/favorite-id.ts) — reused as-is rather than duplicated, since a
// bien and a terrain can both be added to the comparator. Capped at
// MAX_COMPARE_ITEMS so the comparison table below stays readable, so this
// needs its own write logic instead of the plain id-set-store.
const EMPTY: string[] = [];

export const MAX_COMPARE_ITEMS = 4;

const channel = createStorageChannel<string[]>("compare", EMPTY);

export function useCompareIds(): string[] {
  return useSyncExternalStore(channel.subscribe, channel.read, channel.getServerSnapshot);
}

export function isCompared(id: string): boolean {
  return channel.read().includes(id);
}

/** Returns false when the id was not already selected and the comparator is full. */
export function toggleCompare(id: string): boolean {
  const current = channel.read();
  if (current.includes(id)) {
    channel.write(current.filter((existing) => existing !== id));
    return true;
  }
  if (current.length >= MAX_COMPARE_ITEMS) return false;
  channel.write([...current, id]);
  return true;
}

export function removeFromCompare(id: string): void {
  channel.write(channel.read().filter((existing) => existing !== id));
}

export function clearCompare(): void {
  channel.write(EMPTY);
}
