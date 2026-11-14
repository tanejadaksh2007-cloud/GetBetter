import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide rounded-lg transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-valAccent/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

  const variants = {
    primary: 'bg-valAccent hover:bg-valAccentDark text-white shadow-md shadow-valAccent/20 border border-transparent',
    secondary: 'bg-valCard hover:bg-valCardHover text-slate-100 border border-valBorder hover:border-slate-500',
    outline: 'bg-transparent hover:bg-valCard text-slate-200 border border-valBorder hover:border-valAccent hover:text-white',
    ghost: 'bg-transparent hover:bg-valCard text-valMuted hover:text-white border border-transparent',
    danger: 'bg-red-950/60 hover:bg-red-900 text-rose-300 border border-red-800/80',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-5 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
