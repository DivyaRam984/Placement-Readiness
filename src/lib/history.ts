import type { HistoryEntry } from '@/types/analysis';

const STORAGE_KEY = 'placement-readiness-history';

function readEntries(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function saveEntry(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): HistoryEntry {
  const entries = readEntries();
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  writeEntries(entries);
  return newEntry;
}

export function getEntries(): HistoryEntry[] {
  return readEntries();
}

export function getEntryById(id: string): HistoryEntry | null {
  return readEntries().find((e) => e.id === id) ?? null;
}

export function getLatestEntry(): HistoryEntry | null {
  const entries = readEntries();
  return entries.length > 0 ? entries[0] : null;
}

export function updateEntry(
  id: string,
  updates: Partial<Pick<HistoryEntry, 'skillConfidenceMap'>>
): void {
  const entries = readEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return;
  entries[index] = { ...entries[index], ...updates };
  writeEntries(entries);
}
