import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-5 sm:p-6',
  cutCorner = true,
  ...props
}) {
  const cutClass = cutCorner ? 'clip-cut-corner-br' : 'rounded-none';

  return (
    <div
      className={`bg-surface border border-border ${
        hover
          ? 'hover:border-red hover:shadow-[0_0_0_1px_#FF4655] hover:-translate-y-0.5 transition-all duration-150'
          : 'shadow-md'
      } ${cutClass} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
