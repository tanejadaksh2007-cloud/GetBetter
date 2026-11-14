import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center font-semibold uppercase tracking-wider rounded font-mono select-none';

  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    accent: 'bg-red-950/70 text-valAccent border border-valAccent/40',
    teal: 'bg-teal-950/60 text-teal-300 border border-teal-800/60',
    amber: 'bg-amber-950/60 text-amber-300 border border-amber-800/60',
    outline: 'bg-transparent text-valMuted border border-valBorder',
    win: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800',
    loss: 'bg-rose-950/80 text-rose-400 border border-rose-800',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
