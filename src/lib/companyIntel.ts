import type { CompanySize, CompanyIntel, RoundMapping, ExtractedSkills, SkillCategory } from '@/types/analysis';

const ENTERPRISE_NAMES = [
  'amazon', 'google', 'microsoft', 'meta', 'apple', 'infosys', 'tcs', 'wipro',
  'accenture', 'capgemini', 'cognizant', 'hcl', 'tech mahindra', 'ibm', 'oracle',
  'sap', 'salesforce', 'adobe', 'netflix', 'uber', 'paypal', 'goldman sachs',
  'morgan stanley', 'jpmorgan', 'jp morgan', 'deloitte', 'ey', 'kpmg', 'pwc',
];

const MID_SIZE_NAMES: string[] = [];

function normalizeCompany(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getCompanySize(company: string): CompanySize {
  if (!company.trim()) return 'Startup';
  const n = normalizeCompany(company);
  if (ENTERPRISE_NAMES.some((e) => n.includes(e) || e.includes(n))) return 'Enterprise';
  if (MID_SIZE_NAMES.some((m) => n.includes(m))) return 'Mid-size';
  return 'Startup';
}

export function getIndustry(company: string, jdText: string): string {
  const text = (company + ' ' + jdText).toLowerCase();
  if (/\b(finance|banking|investment)\b/.test(text)) return 'Financial Services';
  if (/\b(healthcare|medical|pharma)\b/.test(text)) return 'Healthcare';
  if (/\b(retail|ecommerce|e-commerce)\b/.test(text)) return 'Retail / E-commerce';
  if (/\b(education|edtech)\b/.test(text)) return 'Education';
  if (/\b(manufacturing|automotive)\b/.test(text)) return 'Manufacturing';
  return 'Technology Services';
}

export function getTypicalHiringFocus(size: CompanySize): string {
  if (size === 'Enterprise') {
    return 'Structured DSA and core CS fundamentals; standardized online tests and technical rounds; emphasis on algorithms, system design basics, and behavioral fit.';
  }
  if (size === 'Mid-size') {
    return 'Balance of problem-solving and stack depth; practical coding and system discussion; culture and ownership.';
  }
  return 'Practical problem-solving and stack depth; hands-on coding and system discussion; culture fit and ownership.';
}

function hasCategory(skills: ExtractedSkills, category: SkillCategory): boolean {
  const tags = skills.byCategory[category];
  return Array.isArray(tags) && tags.length > 0;
}

function hasDSA(skills: ExtractedSkills): boolean {
  return hasCategory(skills, 'Core CS');
}

function hasReactOrNode(skills: ExtractedSkills): boolean {
  const web = skills.byCategory['Web'] ?? [];
  return web.some((s) => /react|node/i.test(s));
}

export function getRoundMapping(size: CompanySize, extractedSkills: ExtractedSkills): RoundMapping {
  const dsa = hasDSA(extractedSkills);
  const reactNode = hasReactOrNode(extractedSkills);

  if (size === 'Enterprise' && dsa) {
    return [
      {
        roundNumber: 1,
        title: 'Online Test (DSA + Aptitude)',
        description: 'Timed coding and aptitude; focus on DSA and logical reasoning.',
        whyItMatters: 'This round filters candidates at scale; strong DSA and time management are essential to advance.',
      },
      {
        roundNumber: 2,
        title: 'Technical (DSA + Core CS)',
        description: 'Deep dive into data structures, algorithms, and core CS fundamentals.',
        whyItMatters: 'Interviewers assess problem-solving approach and depth; clarity and correctness matter more than speed.',
      },
      {
        roundNumber: 3,
        title: 'Tech + Projects',
        description: 'Discussion of your projects and technical decisions; may include system design basics.',
        whyItMatters: 'Shows how you apply knowledge in real work; align your project stories with the JD.',
      },
      {
        roundNumber: 4,
        title: 'HR',
        description: 'Behavioral fit, expectations, and company values.',
        whyItMatters: 'Final gate for culture fit; prepare STAR stories and questions about the role.',
      },
    ];
  }

  if (size === 'Enterprise' && !dsa) {
    return [
      {
        roundNumber: 1,
        title: 'Online Test',
        description: 'Aptitude and domain-specific or coding questions.',
        whyItMatters: 'First filter; practice timed tests in the areas mentioned in the JD.',
      },
      {
        roundNumber: 2,
        title: 'Technical Interview',
        description: 'Core fundamentals and problem-solving relevant to the role.',
        whyItMatters: 'Demonstrates depth in the skills the role requires.',
      },
      {
        roundNumber: 3,
        title: 'Projects / System discussion',
        description: 'Projects and possibly system design or architecture.',
        whyItMatters: 'Connects your experience to what the team does.',
      },
      {
        roundNumber: 4,
        title: 'HR',
        description: 'Behavioral and fit.',
        whyItMatters: 'Final alignment on values and expectations.',
      },
    ];
  }

  if ((size === 'Startup' || size === 'Mid-size') && reactNode) {
    return [
      {
        roundNumber: 1,
        title: 'Practical coding',
        description: 'Hands-on coding or take-home; often stack-specific (e.g. React, Node).',
        whyItMatters: 'Startups want to see you ship; clean, working code and clear thinking matter most.',
      },
      {
        roundNumber: 2,
        title: 'System discussion',
        description: 'How you’d build or improve a feature; trade-offs and design.',
        whyItMatters: 'Shows you can think beyond the screen and align with their stack.',
      },
      {
        roundNumber: 3,
        title: 'Culture fit',
        description: 'Working style, ownership, and team fit.',
        whyItMatters: 'Small teams depend on fit; be ready to discuss how you learn and collaborate.',
      },
    ];
  }

  if (size === 'Startup' || size === 'Mid-size') {
    return [
      {
        roundNumber: 1,
        title: 'Technical / Coding',
        description: 'Problem-solving or practical coding based on JD focus.',
        whyItMatters: 'First signal of technical level; focus on clarity and approach.',
      },
      {
        roundNumber: 2,
        title: 'Projects & experience',
        description: 'Deep dive into projects and relevant experience.',
        whyItMatters: 'Shows how you apply skills in real scenarios.',
      },
      {
        roundNumber: 3,
        title: 'Culture fit',
        description: 'Values, teamwork, and role expectations.',
        whyItMatters: 'Ensures mutual fit for a smaller team.',
      },
    ];
  }

  return [
    {
      roundNumber: 1,
      title: 'Technical round',
      description: 'Core skills and problem-solving as per JD.',
      whyItMatters: 'Primary evaluation of technical readiness.',
    },
    {
      roundNumber: 2,
      title: 'Projects / HR',
      description: 'Experience and fit.',
      whyItMatters: 'Rounds out the picture for the hiring team.',
    },
  ];
}

export function buildCompanyIntel(
  company: string,
  jdText: string,
  _extractedSkills: ExtractedSkills
): CompanyIntel | null {
  const trimmed = company.trim();
  if (!trimmed) return null;

  const size = getCompanySize(trimmed);
  const industry = getIndustry(trimmed, jdText);
  const typicalHiringFocus = getTypicalHiringFocus(size);

  return {
    companyName: trimmed,
    industry,
    sizeCategory: size,
    typicalHiringFocus,
  };
}

export function buildRoundMapping(
  company: string,
  extractedSkills: ExtractedSkills
): RoundMapping {
  const size = getCompanySize(company.trim());
  return getRoundMapping(size, extractedSkills);
}
