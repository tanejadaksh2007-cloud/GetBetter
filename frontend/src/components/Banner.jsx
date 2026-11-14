import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Banner() {
  return (
    <div className="bg-amber-950/80 border-b border-amber-600/40 text-amber-200 px-4 py-2 text-xs md:text-sm flex items-center justify-center gap-2 text-center backdrop-blur-sm">
      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        <strong>Mockup Notice:</strong> Real Riot Sign On (RSO) and live match history require Riot Games production API approval. All stats and profiles are simulation placeholders.
      </span>
    </div>
  );
}
