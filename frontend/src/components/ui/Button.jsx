import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  cutCorner = true,
  ...props
}) {
  const base =
    'relative inline-flex items-center justify-center font-rajdhani font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none select-none cursor-pointer active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-valAccent hover:bg-valAccentDark text-white border-b-2 border-red-800 shadow-md shadow-valAccent/20 hover:shadow-valAccent/40',
    secondary:
      'bg-[#14202C] hover:bg-[#1E2E3E] text-valText border border-valBorder hover:border-valAccent/60',
    outline:
      'bg-transparent hover:bg-valAccent/10 text-valText border border-valBorder hover:border-valAccent hover:text-white',
    ghost:
      'bg-transparent hover:bg-valCard hover:text-white text-valMuted',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const cutClass = cutCorner ? 'clip-cut-corner-br' : 'rounded-sm';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${cutClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
