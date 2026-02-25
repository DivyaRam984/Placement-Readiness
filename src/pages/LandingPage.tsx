import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Ace Your Placement
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-xl">
          Practice, assess, and prepare for your dream job
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Practice Problems</h2>
            <p className="text-gray-600 text-sm">
              Solve curated problems and build your coding skills.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Mock Interviews</h2>
            <p className="text-gray-600 text-sm">
              Simulate real interviews and get feedback.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h2>
            <p className="text-gray-600 text-sm">
              Monitor your growth and stay on track.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  );
}
