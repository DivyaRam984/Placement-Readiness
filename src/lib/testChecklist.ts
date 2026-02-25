const STORAGE_KEY = 'prp-test-checklist';
const TOTAL_TESTS = 10;

export type TestChecklistState = boolean[];

function readRaw(): unknown {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function ensureArray(value: unknown): boolean[] {
  if (!Array.isArray(value) || value.length !== TOTAL_TESTS) {
    return Array(TOTAL_TESTS).fill(false);
  }
  return value.map((v) => v === true).slice(0, TOTAL_TESTS);
}

export function getTestChecklist(): TestChecklistState {
  return ensureArray(readRaw());
}

export function setTestChecklist(state: TestChecklistState): void {
  const normalized = state.slice(0, TOTAL_TESTS);
  while (normalized.length < TOTAL_TESTS) normalized.push(false);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }
}

export function setTestChecked(index: number, checked: boolean): TestChecklistState {
  const state = getTestChecklist();
  const next = [...state];
  next[index] = checked;
  setTestChecklist(next);
  return next;
}

export function isAllTestsPassed(): boolean {
  const state = getTestChecklist();
  return state.length >= TOTAL_TESTS && state.every(Boolean);
}

export function resetTestChecklist(): TestChecklistState {
  const state = Array(TOTAL_TESTS).fill(false);
  setTestChecklist(state);
  return state;
}

export { TOTAL_TESTS };
