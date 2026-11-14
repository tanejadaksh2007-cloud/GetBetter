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
            className="bg-surface border border-border clip-cut-corner-br p-6 animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-surface-hover" />
              <div className="h-6 w-12 bg-surface-hover" />
            </div>
            <div className="h-4 w-24 bg-surface-hover/80" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-surface-hover/60" />
              <div className="h-3 w-4/5 bg-surface-hover/60" />
            </div>
            <div className="h-9 w-full bg-surface-hover pt-4 clip-cut-corner-br" />
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
            className="h-14 bg-surface border border-border animate-pulse clip-cut-corner-br"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`h-32 bg-surface border border-border clip-cut-corner-br animate-pulse ${className}`} />
  );
}
