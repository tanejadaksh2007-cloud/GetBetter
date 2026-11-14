import React from 'react';

export default function PageHeader({
  badge,
  title,
  description,
  actions,
  className = '',
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-valBorder ${className}`}>
      <div className="space-y-1.5">
        {badge && <div>{badge}</div>}
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-rajdhani">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-valMuted max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
