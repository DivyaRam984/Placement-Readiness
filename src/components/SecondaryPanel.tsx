import type { ReactNode } from 'react';

interface SecondaryPanelProps {
  stepExplanation: string;
  promptContent?: string;
  onCopy?: () => void;
  children?: ReactNode;
}

export function SecondaryPanel({
  stepExplanation,
  promptContent,
  onCopy,
  children,
}: SecondaryPanelProps) {
  return (
    <aside className="kn-panel">
      <h3 className="kn-panel__title">Step</h3>
      <p className="kn-panel__text">{stepExplanation}</p>
      {promptContent != null && (
        <>
          <textarea
            className="kn-prompt-box"
            readOnly
            value={promptContent}
            aria-label="Copyable prompt"
          />
          <div className="kn-panel__actions">
            <button type="button" className="kn-btn kn-btn-secondary" onClick={onCopy}>
              Copy
            </button>
            <button type="button" className="kn-btn kn-btn-primary">
              Build in Lovable
            </button>
            <button type="button" className="kn-btn kn-btn-secondary">
              It Worked
            </button>
            <button type="button" className="kn-btn kn-btn-secondary">
              Error
            </button>
            <button type="button" className="kn-btn kn-btn-secondary">
              Add Screenshot
            </button>
          </div>
        </>
      )}
      {children}
    </aside>
  );
}
