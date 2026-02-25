import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getTestChecklist,
  setTestChecked,
  resetTestChecklist,
  TOTAL_TESTS,
} from '@/lib/testChecklist';

const TESTS: { label: string; hint: string }[] = [
  {
    label: 'JD required validation works',
    hint: 'Leave JD empty and try to submit; the Analyze button should be disabled.',
  },
  {
    label: 'Short JD warning shows for <200 chars',
    hint: 'Paste fewer than 200 characters in the JD field; the warning message should appear below the textarea.',
  },
  {
    label: 'Skills extraction groups correctly',
    hint: 'Paste a JD containing DSA, React, and SQL; open Results and confirm skills appear under the right categories (e.g. Core CS, Web, Data).',
  },
  {
    label: 'Round mapping changes based on company + skills',
    hint: 'Run one analysis with company "Infosys" and DSA in the JD, another with "StartupCo" and React/Node; compare Round mapping sections on Results.',
  },
  {
    label: 'Score calculation is deterministic',
    hint: 'Run the same JD (and company/role) twice; the base readiness score on Results should be the same both times.',
  },
  {
    label: 'Skill toggles update score live',
    hint: 'On Results, change a skill between "I know this" and "Need practice"; the readiness score should update immediately without refreshing.',
  },
  {
    label: 'Changes persist after refresh',
    hint: 'On Results, toggle some skills and note the score; refresh the page and reopen the same result; toggles and score should be unchanged.',
  },
  {
    label: 'History saves and loads correctly',
    hint: 'Run an analysis, go to History, and click the new entry; the Results page should show the same company, role, and content.',
  },
  {
    label: 'Export buttons copy the correct content',
    hint: 'On Results, use "Copy 7-day plan", "Copy round checklist", and "Copy 10 questions"; paste into a text editor and confirm the content matches.',
  },
  {
    label: 'No console errors on core pages',
    hint: 'Open /, /dashboard, /dashboard/analyze, /dashboard/results, and /dashboard/history; keep DevTools Console open and confirm there are no errors.',
  },
];

export function TestChecklist() {
  const [state, setState] = useState<boolean[]>(() => getTestChecklist());

  useEffect(() => {
    setState(getTestChecklist());
  }, []);

  const passed = state.filter(Boolean).length;
  const allPassed = passed === TOTAL_TESTS;

  function handleToggle(index: number) {
    const next = setTestChecked(index, !state[index]);
    setState(next);
  }

  function handleReset() {
    setState(resetTestChecklist());
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test checklist</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tests Passed: {passed} / {TOTAL_TESTS}</CardTitle>
          <CardDescription>
            Complete all items before shipping. Checklist is stored in this browser.
          </CardDescription>
        </CardHeader>
        {!allPassed && (
          <CardContent>
            <p className="text-sm font-medium text-amber-700">Fix issues before shipping.</p>
          </CardContent>
        )}
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tests</CardTitle>
          <CardDescription>Check each item after verifying the behavior.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {TESTS.map((test, index) => (
              <li key={index} className="flex flex-col gap-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state[index] ?? false}
                    onChange={() => handleToggle(index)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-gray-900">{test.label}</span>
                </label>
                <p className="text-sm text-gray-500 pl-7">How to test: {test.hint}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={handleReset}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Reset checklist
      </button>
    </div>
  );
}
