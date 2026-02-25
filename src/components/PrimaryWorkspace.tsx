import type { ReactNode } from 'react';

interface PrimaryWorkspaceProps {
  children: ReactNode;
}

export function PrimaryWorkspace({ children }: PrimaryWorkspaceProps) {
  return <main className="kn-workspace">{children}</main>;
}
