import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Banner() {
  return (
    <div className="bg-surface border-b border-border text-xs sm:text-sm font-mono text-text py-2 px-4 flex items-center justify-center gap-2 text-center tracking-wide whitespace-nowrap overflow-x-auto">
      <ShieldAlert className="w-4 h-4 text-red shrink-0" />
      <span>
        Mockup - real Riot Sign On requires production API approval.
      </span>
    </div>
  );
}
