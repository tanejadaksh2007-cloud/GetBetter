import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Banner() {
  return (
    <div className="bg-[#121820] border-b border-valBorder text-[11px] font-mono text-valMuted py-1.5 px-4 flex items-center justify-center gap-2 text-center tracking-wide">
      <ShieldAlert className="w-3.5 h-3.5 text-valAccent shrink-0" />
      <span>
        Mockup - real Riot Sign On requires production API approval.
      </span>
    </div>
  );
}
