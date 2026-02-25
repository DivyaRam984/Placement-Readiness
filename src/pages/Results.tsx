import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getEntryById, getLatestEntry, updateEntry } from '@/lib/history';
import type { HistoryEntry, SkillCategory, SkillConfidence } from '@/types/analysis';

function useResultsData(): HistoryEntry | null {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const id = searchParams.get('id');

  return useMemo(() => {
    const stateEntry = (location.state as { entry?: HistoryEntry })?.entry;
    if (stateEntry) return stateEntry;
    if (id) return getEntryById(id);
    return getLatestEntry();
  }, [id, location.state]);
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function buildFullText(entry: HistoryEntry): string {
  const lines: string[] = [];
  lines.push(`${entry.company || '—'} · ${entry.role || '—'}`);
  lines.push('');
  lines.push('--- Readiness score ---');
  lines.push(`${entry.readinessScore} / 100`);
  lines.push('');
  lines.push('--- Key skills extracted ---');
  const cats = entry.extractedSkills.categoriesPresent.length
    ? entry.extractedSkills.categoriesPresent
    : (['General'] as SkillCategory[]);
  for (const cat of cats) {
    const tags = entry.extractedSkills.byCategory[cat];
    if (tags?.length) {
      lines.push(`${cat}: ${tags.join(', ')}`);
    }
  }
  lines.push('');
  lines.push('--- Round-wise checklist ---');
  for (const r of entry.checklist) {
    lines.push(r.round);
    r.items.forEach((i) => lines.push(`  • ${i}`));
    lines.push('');
  }
  lines.push('--- 7-day plan ---');
  for (const d of entry.plan) {
    lines.push(`Day ${d.day}: ${d.title}`);
    d.tasks.forEach((t) => lines.push(`  • ${t}`));
    lines.push('');
  }
  lines.push('--- 10 likely interview questions ---');
  entry.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  return lines.join('\n');
}

export function Results() {
  const entry = useResultsData();
  const [skillConfidenceMap, setSkillConfidenceMap] = useState<Record<string, SkillConfidence>>({});

  useEffect(() => {
    if (entry) setSkillConfidenceMap(entry.skillConfidenceMap ?? {});
  }, [entry?.id]);

  const persistConfidence = useCallback(
    (newMap: Record<string, SkillConfidence>) => {
      if (!entry) return;
      setSkillConfidenceMap(newMap);
      updateEntry(entry.id, { skillConfidenceMap: newMap });
    },
    [entry]
  );

  const setSkillConfidence = useCallback(
    (skill: string, value: SkillConfidence) => {
      persistConfidence({ ...skillConfidenceMap, [skill]: value });
    },
    [skillConfidenceMap, persistConfidence]
  );

  if (!entry) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analysis results</h2>
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No analysis found. Run an analysis from the Analyze page, or open a saved entry from History.
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    createdAt,
    company,
    role,
    extractedSkills,
    checklist,
    plan,
    questions,
    readinessScore: baseScore,
  } = entry;

  const categoriesToShow: SkillCategory[] =
    extractedSkills.categoriesPresent.length > 0
      ? extractedSkills.categoriesPresent
      : ['General'];

  const allSkills = useMemo(() => {
    const list: string[] = [];
    for (const cat of categoriesToShow) {
      const tags = extractedSkills.byCategory[cat];
      if (tags) for (const t of tags) list.push(t);
    }
    return list;
  }, [categoriesToShow, extractedSkills.byCategory]);

  const knowCount = allSkills.filter((s) => (skillConfidenceMap[s] ?? 'practice') === 'know').length;
  const practiceCount = allSkills.length - knowCount;
  const liveScore = Math.min(100, Math.max(0, baseScore + 2 * knowCount - 2 * practiceCount));

  const weakSkills = allSkills
    .filter((s) => (skillConfidenceMap[s] ?? 'practice') === 'practice')
    .slice(0, 3);

  const copyPlan = useCallback(() => {
    const text = plan
      .map(
        (d) =>
          `Day ${d.day}: ${d.title}\n${d.tasks.map((t) => `  • ${t}`).join('\n')}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
  }, [plan]);

  const copyChecklist = useCallback(() => {
    const text = checklist
      .map((r) => `${r.round}\n${r.items.map((i) => `  • ${i}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
  }, [checklist]);

  const copyQuestions = useCallback(() => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(text);
  }, [questions]);

  const downloadTxt = useCallback(() => {
    const text = buildFullText({ ...entry, readinessScore: liveScore });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-readiness-${company || 'analysis'}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entry, liveScore, company]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analysis results</h2>
      <p className="text-sm text-gray-500 mb-6">
        {company && `${company}${role ? ' · ' : ''}`}
        {role && role}
        {!company && !role && 'No company/role'}
        {' · '}
        {formatDate(createdAt)}
      </p>

      {/* Readiness score (live) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Readiness score</CardTitle>
          <CardDescription>
            Base from JD + self-assessment: +2 per skill marked &quot;I know&quot;, −2 per &quot;Need practice&quot;
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{liveScore}</span>
            <span className="text-gray-500">/ 100</span>
          </div>
        </CardContent>
      </Card>

      {/* Key skills extracted + toggles */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key skills extracted</CardTitle>
          <CardDescription>
            Mark each skill: &quot;I know this&quot; or &quot;Need practice&quot;. Choices are saved to this analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoriesToShow.map((cat) => {
              const tags = extractedSkills.byCategory[cat];
              if (!tags || tags.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="text-sm font-medium text-gray-700 mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const value = skillConfidenceMap[tag] ?? 'practice';
                      return (
                        <div
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1.5 text-sm"
                        >
                          <span className="font-medium text-gray-900">{tag}</span>
                          <span className="text-gray-400">·</span>
                          <div className="flex rounded-md border border-gray-200 bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => setSkillConfidence(tag, 'know')}
                              className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                                value === 'know'
                                  ? 'bg-primary text-white'
                                  : 'text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              I know this
                            </button>
                            <button
                              type="button"
                              onClick={() => setSkillConfidence(tag, 'practice')}
                              className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                                value === 'practice'
                                  ? 'bg-primary text-white'
                                  : 'text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              Need practice
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Copy sections or download everything as a single file</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyPlan}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Copy 7-day plan
          </button>
          <button
            type="button"
            onClick={copyChecklist}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Copy round checklist
          </button>
          <button
            type="button"
            onClick={copyQuestions}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Copy 10 questions
          </button>
          <button
            type="button"
            onClick={downloadTxt}
            className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Download as TXT
          </button>
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Round-wise preparation checklist</CardTitle>
          <CardDescription>Template-based items from detected skills</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {checklist.map((r) => (
              <li key={r.round}>
                <h3 className="font-medium text-gray-900 mb-2">{r.round}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {r.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7-day plan</CardTitle>
          <CardDescription>Adapted to detected skills</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {plan.map((d) => (
              <li key={d.day}>
                <h3 className="font-medium text-gray-900">
                  Day {d.day}: {d.title}
                </h3>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-sm text-gray-600">
                  {d.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 10 likely questions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10 likely interview questions</CardTitle>
          <CardDescription>Based on detected skills</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Action next</CardTitle>
          <CardDescription>Focus on weak areas and start the plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakSkills.length > 0 && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Top weak skills to practice:</span>{' '}
              {weakSkills.join(', ')}
            </p>
          )}
          <p className="text-sm font-medium text-gray-900">
            Start Day 1 plan now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
