import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-5 sm:p-6',
  ...props
}) {
  return (
    <div
      className={`bg-valCard rounded-[12px] border border-valBorder ${
        hover
          ? 'hover:border-valBorder/80 hover:bg-valCardHover/80 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-180'
          : 'shadow-lg'
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
