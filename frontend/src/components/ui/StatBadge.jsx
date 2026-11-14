import React from 'react';

export default function StatBadge({
  label,
  value,
  sublabel,
  className = '',
}) {
  return (
    <div
      className={`relative bg-[#14202C]/90 border-l-2 border-l-valAccent border-y border-r border-valBorder/80 px-4 py-2.5 clip-slant-right ${className}`}
    >
      <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-valMuted">
        {label}
      </div>
      <div className="text-2xl font-black font-rajdhani text-valText leading-none mt-0.5">
        {value}
      </div>
      {sublabel && (
        <div className="text-[10px] text-valMuted/80 font-mono mt-0.5">
          {sublabel}
        </div>
      )}
    </div>
  );
}
