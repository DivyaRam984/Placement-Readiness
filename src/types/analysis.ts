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

export interface AnalysisOutput {
  extractedSkills: ExtractedSkills;
  checklist: RoundChecklist[];
  plan: DayPlanItem[];
  questions: string[];
  readinessScore: number;
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
}
