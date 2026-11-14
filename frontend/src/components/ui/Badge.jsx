import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center font-bold uppercase tracking-wider font-mono select-none';

  const variants = {
    default: 'bg-surface-hover text-muted border border-border',
    red: 'bg-red/15 text-red border border-red/40',
    accent: 'bg-red/15 text-red border border-red/40',
    yellow: 'bg-yellow/15 text-yellow border border-yellow/50',
    teal: 'bg-yellow/15 text-yellow border border-yellow/50',
    amber: 'bg-yellow/15 text-yellow border border-yellow/50',
    outline: 'bg-transparent text-muted border border-border',
    win: 'bg-yellow/15 text-yellow border border-yellow/60 font-bold',
    loss: 'bg-red/15 text-red border border-red/60 font-bold',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
