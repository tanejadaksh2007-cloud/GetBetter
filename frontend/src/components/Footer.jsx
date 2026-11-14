import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A1118] border-t border-valBorder py-6 text-xs text-valMuted mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-valMuted" />
          <span className="font-semibold text-slate-300">VETERAN</span>
          <span className="text-valMuted/60">• Tactical VALORANT Hub</span>
        </div>
        <div className="text-center sm:text-right text-valMuted">
          Placeholder data. Live Riot data needs production API approval.
        </div>
      </div>
    </footer>
  );
}
