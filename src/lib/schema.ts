import type {
  HistoryEntry,
  ExtractedSkills,
  SkillCategory,
  RoundChecklist,
  DayPlanItem,
  RoundMappingItem,
  CompanyIntel,
  AnalysisOutput,
} from '@/types/analysis';

/**
 * Standardized analysis entry schema for persistence.
 * Every saved history entry has these fields (even if empty).
 */
export interface StoredExtractedSkills {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
}

export interface StoredRoundMappingItem {
  roundTitle: string;
  focusAreas: string[];
  whyItMatters: string;
}

export interface StoredChecklistItem {
  roundTitle: string;
  items: string[];
}

export interface StoredPlanDay {
  day: number;
  focus: string;
  tasks: string[];
}

export type StoredSkillConfidence = 'know' | 'practice';

export interface StoredHistoryEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: StoredExtractedSkills;
  roundMapping: StoredRoundMappingItem[];
  checklist: StoredChecklistItem[];
  plan7Days: StoredPlanDay[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: Record<string, StoredSkillConfidence>;
  finalScore: number;
  updatedAt: string;
  companyIntel?: CompanyIntel | null;
}

export const EMPTY_EXTRACTED_SKILLS: StoredExtractedSkills = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: [],
};

function isNonEmptyString(s: unknown): s is string {
  return typeof s === 'string';
}

function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every((x) => typeof x === 'string');
}

function isStoredExtractedSkills(v: unknown): v is StoredExtractedSkills {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    isStringArray(o.coreCS) &&
    isStringArray(o.languages) &&
    isStringArray(o.web) &&
    isStringArray(o.data) &&
    isStringArray(o.cloud) &&
    isStringArray(o.testing) &&
    isStringArray(o.other)
  );
}

function isStoredRoundMappingItem(v: unknown): v is StoredRoundMappingItem {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    isNonEmptyString(o.roundTitle) &&
    isStringArray(o.focusAreas) &&
    isNonEmptyString(o.whyItMatters)
  );
}

function isStoredChecklistItem(v: unknown): v is StoredChecklistItem {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return isNonEmptyString(o.roundTitle) && isStringArray(o.items);
}

function isStoredPlanDay(v: unknown): v is StoredPlanDay {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.day === 'number' &&
    isNonEmptyString(o.focus) &&
    isStringArray(o.tasks)
  );
}

function isSkillConfidenceMap(v: unknown): v is Record<string, StoredSkillConfidence> {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return Object.values(o).every((x) => x === 'know' || x === 'practice');
}

/** Validate and parse a raw value as StoredHistoryEntry. Returns null if corrupted. */
export function parseStoredEntry(raw: unknown): StoredHistoryEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;

  const id = typeof o.id === 'string' ? o.id : null;
  const createdAt = typeof o.createdAt === 'string' ? o.createdAt : null;
  const company = typeof o.company === 'string' ? o.company : '';
  const role = typeof o.role === 'string' ? o.role : '';
  const jdText = typeof o.jdText === 'string' ? o.jdText : '';
  if (id === null || createdAt === null) return null;

  const extractedSkills = isStoredExtractedSkills(o.extractedSkills)
    ? o.extractedSkills
    : { ...EMPTY_EXTRACTED_SKILLS };
  const roundMapping = Array.isArray(o.roundMapping) && o.roundMapping.every(isStoredRoundMappingItem)
    ? o.roundMapping
    : [];
  const checklist = Array.isArray(o.checklist) && o.checklist.every(isStoredChecklistItem)
    ? o.checklist
    : [];
  const plan7Days = Array.isArray(o.plan7Days) && o.plan7Days.every(isStoredPlanDay)
    ? o.plan7Days
    : [];
  const questions = isStringArray(o.questions) ? o.questions : [];
  const baseScore = typeof o.baseScore === 'number' && Number.isFinite(o.baseScore) ? o.baseScore : 0;
  const skillConfidenceMap = isSkillConfidenceMap(o.skillConfidenceMap) ? o.skillConfidenceMap : {};
  const finalScore = typeof o.finalScore === 'number' && Number.isFinite(o.finalScore) ? o.finalScore : baseScore;
  const updatedAt = typeof o.updatedAt === 'string' ? o.updatedAt : createdAt;
  const companyIntel =
    o.companyIntel != null && typeof o.companyIntel === 'object'
      ? (o.companyIntel as CompanyIntel)
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

const CATEGORY_KEYS: (keyof StoredExtractedSkills)[] = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other'];
const TO_SKILL_CATEGORY: Record<keyof StoredExtractedSkills, SkillCategory> = {
  coreCS: 'Core CS',
  languages: 'Languages',
  web: 'Web',
  data: 'Data',
  cloud: 'Cloud/DevOps',
  testing: 'Testing',
  other: 'General',
};

function storedSkillsToExtracted(s: StoredExtractedSkills): ExtractedSkills {
  const byCategory: Record<SkillCategory, string[]> = {
    'Core CS': [],
    Languages: [],
    Web: [],
    Data: [],
    'Cloud/DevOps': [],
    Testing: [],
    General: [],
  };
  const categoriesPresent: SkillCategory[] = [];
  for (const key of CATEGORY_KEYS) {
    const arr = s[key] ?? [];
    const cat = TO_SKILL_CATEGORY[key];
    byCategory[cat] = arr;
    if (arr.length > 0) categoriesPresent.push(cat);
  }
  return { byCategory, categoriesPresent };
}

function storedToRoundMapping(items: StoredRoundMappingItem[]): RoundMappingItem[] {
  return items.map((r, i) => ({
    roundNumber: i + 1,
    title: r.roundTitle,
    description: r.focusAreas.join('. ') || '',
    whyItMatters: r.whyItMatters,
  }));
}

function storedToChecklist(items: StoredChecklistItem[]): RoundChecklist[] {
  return items.map((r) => ({ round: r.roundTitle, items: r.items }));
}

function storedToPlan(days: StoredPlanDay[]): DayPlanItem[] {
  return days.map((d) => ({ day: d.day, title: d.focus, tasks: d.tasks }));
}

/** Convert validated stored entry to HistoryEntry for UI. */
export function storedToHistoryEntry(stored: StoredHistoryEntry, companyIntel?: CompanyIntel | null): HistoryEntry {
  return {
    id: stored.id,
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
    company: stored.company,
    role: stored.role,
    jdText: stored.jdText,
    extractedSkills: storedSkillsToExtracted(stored.extractedSkills),
    checklist: storedToChecklist(stored.checklist),
    plan: storedToPlan(stored.plan7Days),
    questions: stored.questions,
    baseScore: stored.baseScore,
    finalScore: stored.finalScore,
    readinessScore: stored.finalScore,
    skillConfidenceMap: stored.skillConfidenceMap,
    companyIntel: companyIntel ?? undefined,
    roundMapping: storedToRoundMapping(stored.roundMapping),
  };
}

function extractedToStoredSkills(e: ExtractedSkills): StoredExtractedSkills {
  return {
    coreCS: e.byCategory['Core CS'] ?? [],
    languages: e.byCategory['Languages'] ?? [],
    web: e.byCategory['Web'] ?? [],
    data: e.byCategory['Data'] ?? [],
    cloud: e.byCategory['Cloud/DevOps'] ?? [],
    testing: e.byCategory['Testing'] ?? [],
    other: e.byCategory['General'] ?? [],
  };
}

/** Build stored entry payload from analysis output (id, createdAt, updatedAt added by saveEntry). */
export function buildStoredFromAnalysis(
  output: AnalysisOutput,
  company: string,
  role: string,
  jdText: string
): Omit<StoredHistoryEntry, 'id' | 'createdAt' | 'updatedAt'> {
  const baseScore = output.readinessScore;
  const storedRoundMapping: StoredRoundMappingItem[] = output.roundMapping.map((r) => ({
    roundTitle: r.title,
    focusAreas: r.description ? [r.description] : [],
    whyItMatters: r.whyItMatters,
  }));
  const storedChecklist = output.checklist.map((r) => ({ roundTitle: r.round, items: r.items }));
  const storedPlan = output.plan.map((d) => ({ day: d.day, focus: d.title, tasks: d.tasks }));

  return {
    company: company || '',
    role: role || '',
    jdText,
    extractedSkills: extractedToStoredSkills(output.extractedSkills),
    roundMapping: storedRoundMapping,
    checklist: storedChecklist,
    plan7Days: storedPlan,
    questions: output.questions,
    baseScore,
    skillConfidenceMap: {},
    finalScore: baseScore,
  };
}
