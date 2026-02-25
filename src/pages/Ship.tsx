import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { isAllTestsPassed } from '@/lib/testChecklist';
import { Lock } from 'lucide-react';

export function Ship() {
  const location = useLocation();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(isAllTestsPassed());
  }, [location.pathname]);

  if (!unlocked) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ship</h2>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-amber-600" aria-hidden />
              <CardTitle className="text-amber-800">Locked</CardTitle>
            </div>
            <CardDescription>
              Complete all 10 tests on the Test checklist before shipping.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/prp/07-test"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Open test checklist
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ship</h2>
      <Card>
        <CardHeader>
          <CardTitle>Ready to ship</CardTitle>
          <CardDescription>
            All tests passed. You can proceed to ship the Placement Readiness Platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Checklist is complete. Deploy or release according to your process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
