import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { runAnalysis } from '@/lib/jdAnalysis';
import { saveEntry } from '@/lib/history';

export function Analyze() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const output = runAnalysis(jdText, company, role);
      const entry = saveEntry({
        company: company.trim(),
        role: role.trim(),
        jdText: jdText.trim(),
        extractedSkills: output.extractedSkills,
        checklist: output.checklist,
        plan: output.plan,
        questions: output.questions,
        readinessScore: output.readinessScore,
        companyIntel: output.companyIntel ?? undefined,
        roundMapping: output.roundMapping,
      });
      navigate(`/dashboard/results?id=${entry.id}`, { state: { entry } });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analyze Job Description</h2>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Paste JD details</CardTitle>
            <CardDescription>
              Add company, role, and full job description text. Analysis runs locally; nothing is sent to any server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company name
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Tech Corp"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE 1 / Frontend Developer"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="jdText" className="block text-sm font-medium text-gray-700 mb-1">
                Job description (paste full text)
              </label>
              <textarea
                id="jdText"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Analyzing…' : 'Analyze'}
            </button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
