import React from 'react';

export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-muted font-mono"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-surface border border-border px-3.5 py-2.5 text-xs sm:text-sm text-text placeholder-muted/60 transition-colors duration-150 focus:border-red focus:outline-none focus:ring-1 focus:ring-red/50 disabled:opacity-50 ${
          error ? 'border-red focus:border-red' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-red font-medium">{error}</p>}
    </div>
  );
}
