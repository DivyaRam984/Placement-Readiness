import { SKILL_KEYWORDS, CATEGORY_ORDER } from './skillCategories';
import { buildCompanyIntel, buildRoundMapping } from './companyIntel';
import type {
  ExtractedSkills,
  RoundChecklist,
  DayPlanItem,
  AnalysisOutput,
  SkillCategory,
} from '@/types/analysis';

function matchWordBoundary(text: string, keyword: string): boolean {
  const lower = text.toLowerCase();
  const k = keyword.toLowerCase();
  const i = lower.indexOf(k);
  if (i === -1) return false;
  const before = i === 0 ? ' ' : lower[i - 1];
  const after = i + k.length >= lower.length ? ' ' : lower[i + k.length];
  const wordChar = /[a-z0-9]/;
  return !wordChar.test(before) && !wordChar.test(after);
}

export function extractSkills(jdText: string): ExtractedSkills {
  const lower = jdText.trim().toLowerCase();
  const byCategory: Record<SkillCategory, string[]> = {
    'Core CS': [],
    Languages: [],
    Web: [],
    Data: [],
    'Cloud/DevOps': [],
    Testing: [],
    General: [],
  };

  for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
    const list: string[] = [];
    for (const kw of keywords) {
      if (matchWordBoundary(lower, kw) || lower.includes(kw.toLowerCase())) {
        const label = kw.charAt(0).toUpperCase() + kw.slice(1).toLowerCase();
        if (!list.includes(label)) list.push(label);
      }
    }
    byCategory[category as SkillCategory] = list;
  }

  const categoriesPresent = CATEGORY_ORDER.filter(
    (c) => c !== 'General' && byCategory[c].length > 0
  );

  if (categoriesPresent.length === 0) {
    byCategory.General = ['General fresher stack'];
    return { byCategory, categoriesPresent: ['General'] };
  }

  return { byCategory, categoriesPresent };
}

function buildChecklist(extracted: ExtractedSkills): RoundChecklist[] {
  const { byCategory, categoriesPresent } = extracted;
  const hasDSA = byCategory['Core CS'].length > 0;
  const hasWeb = byCategory.Web.length > 0;
  const hasData = byCategory.Data.length > 0;
  const hasCloud = byCategory['Cloud/DevOps'].length > 0;
  const hasLanguages = byCategory.Languages.length > 0;

  const round1: string[] = [
    'Revise quantitative aptitude (time-speed-distance, percentages, ratios)',
    'Practice logical reasoning and puzzles',
    'Brush up basic CS fundamentals',
    'Review verbal ability if applicable',
  ];
  if (categoriesPresent.length > 0) round1.push('Align preparation with JD requirements');
  round1.push('Time yourself on sample aptitude tests', 'Prepare short self-introduction');

  const round2: string[] = [
    'Revise core data structures: arrays, linked lists, trees, graphs',
    'Practice 2–3 problems each on recursion, DP, and greedy',
    'Review time/space complexity for common patterns',
  ];
  if (hasDSA) {
    round2.push('Focus on DSA topics mentioned in JD');
    round2.push('Prepare 2–3 coding problems you can explain end-to-end');
  }
  round2.push('Revise OOP concepts and design basics');
  if (byCategory['Core CS'].length > 0) {
    round2.push('Brush up DBMS, OS, Networks as per JD');
  }
  round2.push('Mock coding round with timer');

  const round3: string[] = [
    'List 2–3 projects with tech stack and your role',
    'Prepare STAR-style answers for project deep dives',
  ];
  if (hasWeb) {
    round3.push('Revise React/Node (or stack from JD) concepts');
    round3.push('Prepare examples of REST/APIs you built or used');
  }
  if (hasData) round3.push('Prepare SQL scenarios and DB design examples');
  if (hasCloud) round3.push('Prepare examples of deployment/CI or cloud usage');
  if (hasLanguages) round3.push('Revise language-specific concepts from JD');
  round3.push('Prepare “Tell me about yourself” and role-specific questions');

  const round4: string[] = [
    'Prepare situational and behavioral answers',
    'Research company values and recent news',
    'Prepare questions to ask the interviewer',
    'Practice salary and role expectations (if applicable)',
    'Review resume for consistency with JD',
  ];
  if (categoriesPresent.length > 0) round4.push('Align your story with JD skills');
  round4.push('Mock HR round with a friend');

  return [
    { round: 'Round 1: Aptitude / Basics', items: round1.slice(0, 8) },
    { round: 'Round 2: DSA + Core CS', items: round2.slice(0, 8) },
    { round: 'Round 3: Tech interview (projects + stack)', items: round3.slice(0, 8) },
    { round: 'Round 4: Managerial / HR', items: round4.slice(0, 8) },
  ];
}

function build7DayPlan(extracted: ExtractedSkills): DayPlanItem[] {
  const { byCategory } = extracted;
  const hasReact = byCategory.Web.some((s) => s.toLowerCase().includes('react'));
  const hasDSA = byCategory['Core CS'].length > 0;
  const hasWeb = byCategory.Web.length > 0;
  const hasData = byCategory.Data.length > 0;

  const day1_2: string[] = [
    'Revise basics: OOP, DBMS, OS, Networks (pick 2–3 topics)',
    'Solve 2–3 aptitude sets and time yourself',
    'Note weak areas for Day 7 revision',
  ];
  if (byCategory['Core CS'].length > 0) {
    day1_2.push('Focus core CS topics that appear in the JD');
  }

  const day3_4: string[] = [
    'Arrays, strings, hashing: 3–4 problems',
    'Trees/Graphs or DP: 2–3 problems',
    'One mock coding round (45–60 min)',
  ];
  if (hasDSA) day3_4.push('Prioritise DSA areas mentioned in JD');

  const day5: string[] = [
    'Map each project to JD requirements',
    'Prepare 2–3 bullet points per project (impact + tech)',
    'Align resume wording with JD keywords',
  ];
  if (hasWeb) day5.push('Highlight frontend/backend work if relevant');
  if (hasData) day5.push('Prepare DB/project examples');

  const day6: string[] = [
    'Prepare 10 tech questions from JD stack',
    'Practice explaining projects in under 2 minutes',
    'Mock interview with a friend or record yourself',
  ];
  if (hasReact) day6.push('Revise React (hooks, state, lifecycle) and one mini project');

  const day7: string[] = [
    'Revise weak areas from Day 1–2 and 3–4',
    'Quick recap of key concepts from each day',
    'Light practice: 1–2 problems, no new topics',
  ];

  return [
    { day: 1, title: 'Basics + Core CS', tasks: day1_2 },
    { day: 2, title: 'Basics + Core CS', tasks: day1_2 },
    { day: 3, title: 'DSA + Coding practice', tasks: day3_4 },
    { day: 4, title: 'DSA + Coding practice', tasks: day3_4 },
    { day: 5, title: 'Project + Resume alignment', tasks: day5 },
    { day: 6, title: 'Mock interview questions', tasks: day6 },
    { day: 7, title: 'Revision + Weak areas', tasks: day7 },
  ];
}

function generateQuestions(extracted: ExtractedSkills): string[] {
  const { byCategory } = extracted;
  const questions: string[] = [];

  const add = (q: string) => {
    if (!questions.includes(q) && questions.length < 10) questions.push(q);
  };

  if (byCategory['Core CS'].length > 0 || byCategory['Core CS'].some((s) => /DSA|Data Structure|Algorithm/i.test(s))) {
    add('How would you optimize search in sorted data?');
    add('Explain time complexity of common sorting algorithms.');
    add('When would you use a hash map vs an array?');
  }
  if (byCategory.Data.some((s) => /SQL/i.test(s))) {
    add('Explain indexing and when it helps.');
    add('What is normalisation? When would you denormalise?');
  }
  if (byCategory.Web.some((s) => /React/i.test(s))) {
    add('Explain state management options in React.');
    add('What is the virtual DOM and how does reconciliation work?');
  }
  if (byCategory.Web.length > 0) {
    add('Explain REST vs GraphQL. When would you choose one over the other?');
  }
  if (byCategory['Cloud/DevOps'].length > 0) {
    add('How would you deploy this application? What would you use for CI/CD?');
  }
  if (byCategory.Languages.some((s) => /Java|Python|JavaScript/i.test(s))) {
    add('Explain pass-by-value vs pass-by-reference in your primary language.');
  }
  if (byCategory['Core CS'].length > 0) {
    add('Explain OOP principles with a real example from your project.');
  }

  add('Tell me about a challenging bug you fixed and how you approached it.');
  add('How do you stay updated with new technologies?');

  return questions.slice(0, 10);
}

export function computeReadinessScore(
  jdText: string,
  company: string,
  role: string,
  categoriesPresent: SkillCategory[]
): number {
  let score = 35;
  const categoryBonus = Math.min(categoriesPresent.filter((c) => c !== 'General').length * 5, 30);
  score += categoryBonus;
  if (company.trim().length > 0) score += 10;
  if (role.trim().length > 0) score += 10;
  if (jdText.trim().length > 800) score += 10;
  return Math.min(100, score);
}

export function runAnalysis(
  jdText: string,
  company: string,
  role: string
): AnalysisOutput {
  const extractedSkills = extractSkills(jdText);
  const categoriesForScore = extractedSkills.categoriesPresent.length
    ? extractedSkills.categoriesPresent
    : (['General'] as SkillCategory[]);
  const readinessScore = computeReadinessScore(
    jdText,
    company,
    role,
    categoriesForScore
  );
  const companyIntel = buildCompanyIntel(company, jdText, extractedSkills);
  const roundMapping = buildRoundMapping(company, extractedSkills);

  return {
    extractedSkills,
    checklist: buildChecklist(extractedSkills),
    plan: build7DayPlan(extractedSkills),
    questions: generateQuestions(extractedSkills),
    readinessScore,
    companyIntel,
    roundMapping,
  };
}
