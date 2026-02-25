import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div>
      {label != null && (
        <label htmlFor={inputId} style={{ display: 'block', marginBottom: 'var(--kn-space-1)', fontSize: 'var(--kn-body-size)' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`kn-input ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error != null && (
        <p id={`${inputId}-error`} role="alert" style={{ marginTop: 'var(--kn-space-1)', fontSize: 'var(--kn-caption-size)', color: 'var(--kn-accent)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
