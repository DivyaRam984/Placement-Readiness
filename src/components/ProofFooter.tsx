export interface ProofItem {
  id: string;
  label: string;
  checked: boolean;
  onProof?: () => void;
}

interface ProofFooterProps {
  items: ProofItem[];
  onToggle?: (id: string, checked: boolean) => void;
}

const DEFAULT_ITEMS: ProofItem[] = [
  { id: 'ui', label: 'UI Built', checked: false },
  { id: 'logic', label: 'Logic Working', checked: false },
  { id: 'test', label: 'Test Passed', checked: false },
  { id: 'deployed', label: 'Deployed', checked: false },
];

export function ProofFooter({
  items = DEFAULT_ITEMS,
  onToggle,
}: ProofFooterProps) {
  return (
    <footer className="kn-proof-footer">
      <div className="kn-proof-footer__title">Proof</div>
      <div className="kn-proof-checklist">
        {items.map((item) => (
          <label key={item.id} className="kn-proof-item kn-checkbox-wrap">
            <input
              type="checkbox"
              className="kn-checkbox"
              checked={item.checked}
              onChange={(e) => onToggle?.(item.id, e.target.checked)}
              aria-label={item.label}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </footer>
  );
}
