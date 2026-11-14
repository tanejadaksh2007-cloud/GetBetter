import React from 'react';

export default function StatBadge({
  label,
  value,
  sublabel,
  className = '',
}) {
  return (
    <div
      className={`relative bg-surface/95 border-l-2 border-l-red border-y border-r border-border px-4 py-2.5 clip-slant-right shadow-sm ${className}`}
    >
      <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-muted">
        {label}
      </div>
      <div className="text-2xl font-black font-rajdhani text-yellow leading-none mt-0.5">
        {value}
      </div>
      {sublabel && (
        <div className="text-[10px] text-muted/80 font-mono mt-0.5">
          {sublabel}
        </div>
      )}
    </div>
  );
}
