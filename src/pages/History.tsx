import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getEntries } from '@/lib/history';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function History() {
  const navigate = useNavigate();
  const entries = getEntries();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analysis history</h2>
      <Card>
        <CardHeader>
          <CardTitle>Saved analyses</CardTitle>
          <CardDescription>
            Stored in this browser. Click an entry to open its results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-gray-500 text-sm">No analyses yet. Run one from the Analyze page.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {entries.map((e) => (
                <li
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/dashboard/results?id=${e.id}`)}
                  onKeyDown={(ev) =>
                    (ev.key === 'Enter' || ev.key === ' ') && navigate(`/dashboard/results?id=${e.id}`)
                  }
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900">
                      {e.company || '—'} · {e.role || '—'}
                    </span>
                    <span className="text-gray-500">{formatDate(e.createdAt)}</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{e.readinessScore}/100</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
