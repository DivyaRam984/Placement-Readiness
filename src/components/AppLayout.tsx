import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { ContextHeader } from './ContextHeader';
import { PrimaryWorkspace } from './PrimaryWorkspace';
import { SecondaryPanel } from './SecondaryPanel';
import { ProofFooter } from './ProofFooter';
import type { ProofItem } from './ProofFooter';

const defaultProofItems: ProofItem[] = [
  { id: 'ui', label: 'UI Built', checked: false },
  { id: 'logic', label: 'Logic Working', checked: false },
  { id: 'test', label: 'Test Passed', checked: false },
  { id: 'deployed', label: 'Deployed', checked: false },
];

interface AppLayoutProps {
  projectName: string;
  step: number;
  totalSteps: number;
  status: 'Not Started' | 'In Progress' | 'Shipped';
  headline: string;
  subtext: string;
  stepExplanation: string;
  promptContent?: string;
  workspaceChildren: ReactNode;
  proofItems?: ProofItem[];
  onProofToggle?: (id: string, checked: boolean) => void;
}

export function AppLayout({
  projectName,
  step,
  totalSteps,
  status,
  headline,
  subtext,
  stepExplanation,
  promptContent,
  workspaceChildren,
  proofItems,
  onProofToggle,
}: AppLayoutProps) {
  return (
    <div className="kn-app">
      <TopBar
        projectName={projectName}
        step={step}
        totalSteps={totalSteps}
        status={status}
      />
      <ContextHeader headline={headline} subtext={subtext} />
      <div className="kn-main">
        <PrimaryWorkspace>{workspaceChildren}</PrimaryWorkspace>
        <SecondaryPanel
          stepExplanation={stepExplanation}
          promptContent={promptContent}
          onCopy={() => navigator.clipboard.writeText(promptContent ?? '')}
        />
      </div>
      <ProofFooter items={proofItems ?? defaultProofItems} onToggle={onProofToggle} />
    </div>
  );
}
