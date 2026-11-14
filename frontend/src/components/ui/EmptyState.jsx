import React from 'react';
import Card from './Card';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <Card className={`text-center py-12 px-6 flex flex-col items-center justify-center ${className}`}>
      {Icon && (
        <div className="w-12 h-12 bg-bg border border-border flex items-center justify-center text-muted mb-3 clip-cut-corner-tl">
          <Icon className="w-6 h-6 text-red" />
        </div>
      )}
      <h3 className="text-lg font-bold text-text uppercase tracking-wide font-rajdhani mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </Card>
  );
}
