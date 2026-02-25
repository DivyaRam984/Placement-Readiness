export type SkillCategory =
  | 'Core CS'
  | 'Languages'
  | 'Web'
  | 'Data'
  | 'Cloud/DevOps'
  | 'Testing'
  | 'General';

export interface ExtractedSkills {
  byCategory: Record<SkillCategory, string[]>;
  categoriesPresent: SkillCategory[];
}

export interface RoundChecklist {
  round: string;
  items: string[];
}

export interface DayPlanItem {
  day: number;
  title: string;
  tasks: string[];
}

export type CompanySize = 'Startup' | 'Mid-size' | 'Enterprise';

export interface CompanyIntel {
  companyName: string;
  industry: string;
  sizeCategory: CompanySize;
  typicalHiringFocus: string;
}

export interface RoundMappingItem {
  roundNumber: number;
  title: string;
  description: string;
  whyItMatters: string;
}

export type RoundMapping = RoundMappingItem[];

export interface AnalysisOutput {
  extractedSkills: ExtractedSkills;
  checklist: RoundChecklist[];
  plan: DayPlanItem[];
  questions: string[];
  readinessScore: number;
  companyIntel: CompanyIntel | null;
  roundMapping: RoundMapping;
}

export type SkillConfidence = 'know' | 'practice';

export interface HistoryEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  checklist: RoundChecklist[];
  plan: DayPlanItem[];
  questions: string[];
  readinessScore: number;
  /** User self-assessment: per-skill "I know" vs "Need practice". Persisted in history. */
  skillConfidenceMap?: Record<string, SkillConfidence>;
  /** Company intel (heuristic). Persisted when company name provided. */
  companyIntel?: CompanyIntel | null;
  /** Round mapping (dynamic from company size + skills). Persisted in history. */
  roundMapping?: RoundMapping;
}
