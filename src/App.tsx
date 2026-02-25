import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages';

const DashboardLayout = lazy(() =>
  import('@/pages').then((m) => ({ default: m.DashboardLayout }))
);
const Dashboard = lazy(() =>
  import('@/pages').then((m) => ({ default: m.Dashboard }))
);
const Practice = lazy(() =>
  import('@/pages').then((m) => ({ default: m.Practice }))
);
const Assessments = lazy(() =>
  import('@/pages').then((m) => ({ default: m.Assessments }))
);
const Resources = lazy(() =>
  import('@/pages').then((m) => ({ default: m.Resources }))
);
const Profile = lazy(() =>
  import('@/pages').then((m) => ({ default: m.Profile }))
);
const Analyze = lazy(() =>
  import('@/pages').then((m) => ({ default: m.Analyze }))
);
const Results = lazy(() =>
  import('@/pages').then((m) => ({ default: m.Results }))
);
const History = lazy(() =>
  import('@/pages').then((m) => ({ default: m.History }))
);

function PageFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center text-gray-500">
      Loading…
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="practice" element={<Practice />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="resources" element={<Resources />} />
            <Route path="profile" element={<Profile />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="results" element={<Results />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
