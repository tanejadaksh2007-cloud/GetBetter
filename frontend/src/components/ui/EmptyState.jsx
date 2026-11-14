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
        <div className="w-12 h-12 rounded-xl bg-[#121C26] border border-valBorder flex items-center justify-center text-valMuted mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-bold text-white uppercase tracking-wide font-rajdhani mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-valMuted max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </Card>
  );
}
