import { useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getEntryById, getLatestEntry } from '@/lib/history';
import type { HistoryEntry, SkillCategory } from '@/types/analysis';

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

export function Results() {
  const entry = useResultsData();

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
    readinessScore,
  } = entry;

  const categoriesToShow: SkillCategory[] =
    extractedSkills.categoriesPresent.length > 0
      ? extractedSkills.categoriesPresent
      : ['General'];

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

      {/* Readiness score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Readiness score</CardTitle>
          <CardDescription>Based on JD completeness and detected skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{readinessScore}</span>
            <span className="text-gray-500">/ 100</span>
          </div>
        </CardContent>
      </Card>

      {/* Key skills extracted */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key skills extracted</CardTitle>
          <CardDescription>Tags grouped by category (from JD text)</CardDescription>
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
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
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
      <Card>
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
    </div>
  );
}
