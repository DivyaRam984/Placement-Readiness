import type { ReactNode } from 'react';

type Status = 'Not Started' | 'In Progress' | 'Shipped';

interface TopBarProps {
  projectName: string;
  step: number;
  totalSteps: number;
  status: Status;
  statusBadge?: ReactNode;
}

export function TopBar({
  projectName,
  step,
  totalSteps,
  status,
  statusBadge,
}: TopBarProps) {
  return (
    <header className="kn-topbar">
      <div className="kn-topbar__project">{projectName}</div>
      <div className="kn-topbar__progress">
        Step {step} / {totalSteps}
      </div>
      <div className="kn-topbar__status">
        {statusBadge ?? <span className="kn-badge">{status}</span>}
      </div>
    </header>
  );
}
