import React from 'react';

export default function LoadingSkeleton({
  count = 3,
  type = 'card',
  className = '',
}) {
  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-valCard border border-valBorder rounded-[12px] p-6 animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-slate-800 rounded" />
              <div className="h-6 w-12 bg-slate-800 rounded" />
            </div>
            <div className="h-4 w-24 bg-slate-800/80 rounded" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-slate-800/60 rounded" />
              <div className="h-3 w-4/5 bg-slate-800/60 rounded" />
            </div>
            <div className="h-8 w-full bg-slate-800 rounded-lg pt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-valCard border border-valBorder rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`h-32 bg-valCard border border-valBorder rounded-[12px] animate-pulse ${className}`} />
  );
}
