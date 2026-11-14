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
          className="block text-xs font-bold uppercase tracking-wider text-valMuted"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-[#121C26] border border-valBorder rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-valMuted/60 transition-colors duration-180 focus:border-valAccent focus:outline-none focus:ring-1 focus:ring-valAccent/50 disabled:opacity-50 ${
          error ? 'border-valAccent focus:border-valAccent' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-valAccent font-medium">{error}</p>}
    </div>
  );
}
