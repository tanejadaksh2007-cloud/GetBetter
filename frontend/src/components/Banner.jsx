import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Banner() {
  return (
    <div className="bg-[#1C1417] border-b border-valAccent/30 text-rose-200 px-4 py-2.5 text-xs flex items-center justify-center gap-2 text-center backdrop-blur-sm">
      <ShieldAlert className="w-4 h-4 text-valAccent shrink-0" />
      <span>
        <strong>Mockup - real Riot Sign On requires production API approval.</strong>
      </span>
    </div>
  );
}
