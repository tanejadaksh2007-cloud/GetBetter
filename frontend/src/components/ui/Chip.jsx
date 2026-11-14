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
          ? 'bg-valAccent text-white shadow-md shadow-valAccent/30 scale-[1.02]'
          : 'bg-[#14202C] text-valMuted hover:text-valText hover:bg-[#1A2A3A] border border-valBorder/70 hover:border-valBorder'
      } ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            active ? 'bg-black/30 text-white' : 'bg-black/40 text-valMuted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
