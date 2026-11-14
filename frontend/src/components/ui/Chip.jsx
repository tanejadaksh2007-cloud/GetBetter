import React from 'react';

export default function Chip({
  label,
  active = false,
  onClick,
  count,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-rajdhani font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer select-none clip-chip ${
        active
          ? 'bg-red text-white border border-red shadow-md shadow-red/30'
          : 'bg-transparent text-muted hover:text-text hover:border-muted border border-border'
      } ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            active ? 'bg-black/30 text-white' : 'bg-surface text-muted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
