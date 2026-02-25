import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  LandingPage,
  DashboardLayout,
  Dashboard,
  Practice,
  Assessments,
  Resources,
  Profile,
} from '@/pages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
