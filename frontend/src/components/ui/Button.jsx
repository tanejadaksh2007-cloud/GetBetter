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

  // Primary: solid red, hover brightens, text white
  // Secondary: yellow outline, text on hover or black on yellow
  const variants = {
    primary:
      'bg-red hover:bg-red-hover text-white border-b-2 border-black/40 shadow-md shadow-red/25 hover:shadow-red/40',
    secondary:
      'bg-transparent hover:bg-yellow text-yellow hover:text-black border border-yellow transition-colors font-bold shadow-sm',
    outline:
      'bg-transparent hover:bg-surface text-text border border-border hover:border-red hover:text-white',
    ghost:
      'bg-transparent hover:bg-surface hover:text-white text-muted',
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
