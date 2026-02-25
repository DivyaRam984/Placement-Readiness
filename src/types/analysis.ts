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
  updatedAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  checklist: RoundChecklist[];
  plan: DayPlanItem[];
  questions: string[];
  /** From initial analysis; never changed after save. */
  baseScore: number;
  /** baseScore + skill confidence adjustments; updated when user toggles skills. */
  finalScore: number;
  /** Kept for backward compatibility; equals finalScore. */
  readinessScore: number;
  skillConfidenceMap: Record<string, SkillConfidence>;
  companyIntel?: CompanyIntel | null;
  roundMapping: RoundMapping;
}
