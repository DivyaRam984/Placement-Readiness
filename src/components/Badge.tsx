type BadgeVariant = 'default' | 'success' | 'warning' | 'accent';

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variantClass = variant === 'default' ? '' : ` kn-badge--${variant}`;
  return <span className={`kn-badge${variantClass}`}>{children}</span>;
}
