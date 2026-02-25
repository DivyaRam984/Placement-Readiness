import type { HistoryEntry, CompanyIntel } from '@/types/analysis';
import {
  parseStoredEntry,
  buildStoredFromAnalysis,
  storedToHistoryEntry,
  type StoredHistoryEntry,
} from '@/lib/schema';

const STORAGE_KEY = 'placement-readiness-history';

function readRaw(): unknown[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(items: StoredHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/** Try to migrate an old history entry shape to StoredHistoryEntry. Returns null if not migratable. */
function migrateLegacy(raw: unknown): StoredHistoryEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  const createdAt = typeof o.createdAt === 'string' ? o.createdAt : null;
  if (id === null || createdAt === null) return null;

  const company = typeof o.company === 'string' ? o.company : '';
  const role = typeof o.role === 'string' ? o.role : '';
  const jdText = typeof o.jdText === 'string' ? o.jdText : '';

  const es = o.extractedSkills as Record<string, unknown> | undefined;
  const byCategory = es?.byCategory as Record<string, string[]> | undefined;
  if (!byCategory || typeof byCategory !== 'object') return null;

  const extractedSkills = {
    coreCS: Array.isArray(byCategory['Core CS']) ? byCategory['Core CS'] : [],
    languages: Array.isArray(byCategory['Languages']) ? byCategory['Languages'] : [],
    web: Array.isArray(byCategory['Web']) ? byCategory['Web'] : [],
    data: Array.isArray(byCategory['Data']) ? byCategory['Data'] : [],
    cloud: Array.isArray(byCategory['Cloud/DevOps']) ? byCategory['Cloud/DevOps'] : [],
    testing: Array.isArray(byCategory['Testing']) ? byCategory['Testing'] : [],
    other: Array.isArray(byCategory['General']) ? byCategory['General'] : [],
  };

  const checklistRaw = Array.isArray(o.checklist) ? o.checklist : [];
  const checklist = checklistRaw.map((r: Record<string, unknown>) => ({
    roundTitle: typeof r.round === 'string' ? r.round : '',
    items: Array.isArray(r.items) ? r.items : [],
  }));

  const planRaw = Array.isArray(o.plan) ? o.plan : [];
  const plan7Days = planRaw.map((d: Record<string, unknown>) => ({
    day: typeof d.day === 'number' ? d.day : 0,
    focus: typeof d.title === 'string' ? d.title : '',
    tasks: Array.isArray(d.tasks) ? d.tasks : [],
  }));

  const roundMappingRaw = Array.isArray(o.roundMapping) ? o.roundMapping : [];
  const roundMapping = roundMappingRaw.map((r: Record<string, unknown>) => ({
    roundTitle: typeof r.title === 'string' ? r.title : '',
    focusAreas: typeof r.description === 'string' ? [r.description] : [],
    whyItMatters: typeof r.whyItMatters === 'string' ? r.whyItMatters : '',
  }));

  const questions = Array.isArray(o.questions) ? o.questions : [];
  const baseScore = typeof o.readinessScore === 'number' ? o.readinessScore : typeof o.baseScore === 'number' ? o.baseScore : 0;
  const skillConfidenceMap = o.skillConfidenceMap != null && typeof o.skillConfidenceMap === 'object' ? (o.skillConfidenceMap as Record<string, 'know' | 'practice'>) : {};
  const finalScore = typeof o.finalScore === 'number' ? o.finalScore : baseScore;
  const updatedAt = typeof o.updatedAt === 'string' ? o.updatedAt : createdAt;
  const ci = o.companyIntel;
  const companyIntel =
    ci != null &&
    typeof ci === 'object' &&
    typeof (ci as Record<string, unknown>).companyName === 'string' &&
    typeof (ci as Record<string, unknown>).industry === 'string'
    ? (ci as CompanyIntel)
    : undefined;

  return {
    id,
    createdAt,
    company,
    role,
    jdText,
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt,
    ...(companyIntel !== undefined && { companyIntel }),
  };
}

export interface GetEntriesResult {
  entries: HistoryEntry[];
  skippedCount: number;
}

export function getEntries(): GetEntriesResult {
  const raw = readRaw();
  const entries: HistoryEntry[] = [];
  let skippedCount = 0;
  for (const item of raw) {
    let stored = parseStoredEntry(item);
    if (!stored) stored = migrateLegacy(item);
    if (stored) {
      entries.push(storedToHistoryEntry(stored, stored.companyIntel));
    } else {
      skippedCount += 1;
    }
  }
  return { entries, skippedCount };
}

export function getEntryById(id: string): HistoryEntry | null {
  const raw = readRaw();
  const item = raw.find((e: unknown) => (e as Record<string, unknown>)?.id === id);
  if (item === undefined) return null;
  let stored = parseStoredEntry(item);
  if (!stored) stored = migrateLegacy(item);
  if (!stored) return null;
  return storedToHistoryEntry(stored, stored.companyIntel);
}

export function getLatestEntry(): HistoryEntry | null {
  const { entries } = getEntries();
  return entries.length > 0 ? entries[0] : null;
}

export function saveEntry(payload: {
  company: string;
  role: string;
  jdText: string;
  extractedSkills: Parameters<typeof buildStoredFromAnalysis>[0]['extractedSkills'];
  checklist: Parameters<typeof buildStoredFromAnalysis>[0]['checklist'];
  plan: Parameters<typeof buildStoredFromAnalysis>[0]['plan'];
  questions: string[];
  readinessScore: number;
  roundMapping: Parameters<typeof buildStoredFromAnalysis>[0]['roundMapping'];
  companyIntel?: CompanyIntel | null;
}): HistoryEntry {
  const output = {
    extractedSkills: payload.extractedSkills,
    checklist: payload.checklist,
    plan: payload.plan,
    questions: payload.questions,
    readinessScore: payload.readinessScore,
    roundMapping: payload.roundMapping,
    companyIntel: payload.companyIntel ?? null,
  } as Parameters<typeof buildStoredFromAnalysis>[0];
  const built = buildStoredFromAnalysis(output, payload.company, payload.role, payload.jdText);
  const now = new Date().toISOString();
  const stored: StoredHistoryEntry = {
    ...built,
    id: crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    ...(payload.companyIntel !== undefined && { companyIntel: payload.companyIntel }),
  };
  const raw = readRaw();
  const migrated: StoredHistoryEntry[] = [];
  for (const item of raw) {
    const s = parseStoredEntry(item) ?? migrateLegacy(item);
    if (s) migrated.push(s);
  }
  writeRaw([stored, ...migrated]);
  return storedToHistoryEntry(stored, stored.companyIntel);
}

export function updateEntry(
  id: string,
  updates: { skillConfidenceMap?: Record<string, 'know' | 'practice'>; finalScore?: number }
): void {
  const raw = readRaw();
  const idx = raw.findIndex((e: unknown) => (e as Record<string, unknown>)?.id === id);
  if (idx === -1) return;
  const item = raw[idx];
  let stored = parseStoredEntry(item) ?? migrateLegacy(item);
  if (!stored) return;
  const now = new Date().toISOString();
  stored = {
    ...stored,
    ...(updates.skillConfidenceMap !== undefined && { skillConfidenceMap: updates.skillConfidenceMap }),
    ...(updates.finalScore !== undefined && { finalScore: updates.finalScore }),
    updatedAt: now,
  };
  const migrated: StoredHistoryEntry[] = [];
  for (let i = 0; i < raw.length; i++) {
    const s = i === idx ? stored : (parseStoredEntry(raw[i]) ?? migrateLegacy(raw[i]));
    if (s) migrated.push(s);
  }
  writeRaw(migrated);
}