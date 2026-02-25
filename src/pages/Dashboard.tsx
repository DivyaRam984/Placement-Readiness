import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const SKILL_DATA = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_WITH_ACTIVITY = [0, 1, 2, 4, 5]; // Mon, Tue, Wed, Fri, Sat

const ASSESSMENTS = [
  { title: 'DSA Mock Test', when: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', when: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', when: 'Friday, 11:00 AM' },
];

function OverallReadiness() {
  const score = 72;
  const max = 100;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / max) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
        <CardDescription>Your current placement readiness score</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pb-2">
        <div className="flex flex-col items-center gap-4">
          <div className="relative inline-flex items-center justify-center">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160" aria-hidden>
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgb(229, 231, 235)"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="hsl(245, 58%, 51%)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: 'stroke-dashoffset 0.6s ease-in-out',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-gray-900">{score}</span>
              <span className="text-lg text-gray-500">/ {max}</span>
            </div>
          </div>
          <p className="text-base font-semibold text-gray-900">Readiness Score</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
        <CardDescription>Scores across key areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart
              data={SKILL_DATA}
              cx="50%"
              cy="50%"
              outerRadius="65%"
              margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
            >
              <PolarGrid stroke="rgb(229, 231, 235)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: 'rgb(31, 41, 55)',
                  fontSize: 14,
                  fontWeight: 500,
                }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{
                  fill: 'rgb(107, 114, 128)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
                orientation="middle"
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(245, 58%, 51%)"
                fill="hsl(245, 58%, 51%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ContinuePractice() {
  const completed = 3;
  const total = 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
        <CardDescription>Pick up where you left off</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-gray-900">Dynamic Programming</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {completed}/{total} completed
        </p>
      </CardContent>
      <CardFooter>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Continue
        </button>
      </CardFooter>
    </Card>
  );
}

function WeeklyGoals() {
  const solved = 12;
  const target = 20;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
        <CardDescription>This week&apos;s progress</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium text-gray-900">Problems Solved: {solved}/{target} this week</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(solved / target) * 100}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between gap-1">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={day}
              className="flex flex-col items-center gap-1"
              title={DAYS_WITH_ACTIVITY.includes(i) ? 'Activity' : 'No activity'}
            >
              <div
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                  DAYS_WITH_ACTIVITY.includes(i)
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
              >
                {day.slice(0, 1)}
              </div>
              <span className="text-xs text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingAssessments() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
        <CardDescription>Scheduled tests and reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-100">
          {ASSESSMENTS.map((item) => (
            <li key={item.title} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span className="font-medium text-gray-900">{item.title}</span>
              <span className="text-sm text-gray-500">{item.when}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverallReadiness />
        <SkillBreakdown />
        <ContinuePractice />
        <WeeklyGoals />
        <UpcomingAssessments />
      </div>
    </div>
  );
}
